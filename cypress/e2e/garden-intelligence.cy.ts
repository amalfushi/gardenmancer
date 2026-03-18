describe('Garden Intelligence — M7 Features', () => {
  const createdGardenIds: string[] = []

  afterEach(() => {
    createdGardenIds.forEach((id) => {
      cy.request({ method: 'DELETE', url: `/api/gardens/${id}`, failOnStatusCode: false })
    })
    createdGardenIds.length = 0
  })

  describe('7.1 Hemisphere Support', () => {
    it('shows hemisphere selector on create garden form', () => {
      cy.visit('/gardens/new')
      cy.contains('Hemisphere').should('be.visible')
    })

    it('creates a garden with northern hemisphere', () => {
      cy.request('POST', '/api/gardens', {
        name: 'Northern Garden',
        type: 'raised',
        width: 4,
        length: 8,
        orientation: 'north',
        hemisphere: 'northern',
      }).then((res) => {
        expect(res.status).to.eq(201)
        expect(res.body.hemisphere).to.eq('northern')
        createdGardenIds.push(res.body.id)
      })
    })

    it('creates a garden with southern hemisphere', () => {
      cy.request('POST', '/api/gardens', {
        name: 'Southern Garden',
        type: 'raised',
        width: 4,
        length: 8,
        orientation: 'north',
        hemisphere: 'southern',
      }).then((res) => {
        expect(res.status).to.eq(201)
        expect(res.body.hemisphere).to.eq('southern')
        createdGardenIds.push(res.body.id)
      })
    })

    it('defaults hemisphere to northern when not specified', () => {
      cy.request('POST', '/api/gardens', {
        name: 'Default Hemisphere Garden',
        type: 'raised',
        width: 4,
        length: 8,
        orientation: 'north',
      }).then((res) => {
        expect(res.status).to.eq(201)
        expect(res.body.hemisphere).to.eq('northern')
        createdGardenIds.push(res.body.id)
      })
    })

    it('displays hemisphere on garden editor page', () => {
      cy.request('POST', '/api/gardens', {
        name: 'Hemisphere Display Test',
        type: 'raised',
        width: 4,
        length: 8,
        orientation: 'north',
        hemisphere: 'southern',
      }).then((res) => {
        createdGardenIds.push(res.body.id)
        cy.visit(`/gardens/${res.body.id}`)
        cy.contains('Southern').should('be.visible')
      })
    })
  })

  describe('7.2 Shade Zones', () => {
    it('displays shade zone editor on garden detail page', () => {
      cy.request('POST', '/api/gardens', {
        name: 'Shade Test Garden',
        type: 'raised',
        width: 4,
        length: 8,
        orientation: 'north',
        hemisphere: 'northern',
      }).then((res) => {
        createdGardenIds.push(res.body.id)
        cy.visit(`/gardens/${res.body.id}`)
        cy.contains('Shade Zones').should('be.visible')
      })
    })

    it('saves shade zones via API', () => {
      cy.request('POST', '/api/gardens', {
        name: 'Shade API Garden',
        type: 'raised',
        width: 4,
        length: 8,
        orientation: 'north',
        hemisphere: 'northern',
      }).then((createRes) => {
        createdGardenIds.push(createRes.body.id)

        const shadeZones = [{ id: 'sz1', x: 0, y: 0, width: 3, height: 3, intensity: 'partial' }]

        cy.request('PUT', `/api/gardens/${createRes.body.id}`, { shadeZones }).then((updateRes) => {
          expect(updateRes.body.shadeZones).to.have.length(1)
          expect(updateRes.body.shadeZones[0].intensity).to.eq('partial')
        })
      })
    })
  })

  describe('7.3 Raised Bed Density', () => {
    it('creates raised bed garden with correct type', () => {
      cy.request('POST', '/api/gardens', {
        name: 'Raised Bed Garden',
        type: 'raised',
        width: 4,
        length: 8,
        orientation: 'north',
        hemisphere: 'northern',
      }).then((res) => {
        expect(res.status).to.eq(201)
        expect(res.body.type).to.eq('raised')
        createdGardenIds.push(res.body.id)
      })
    })

    it('displays garden type on editor page', () => {
      cy.request('POST', '/api/gardens', {
        name: 'Raised Bed Type Test',
        type: 'raised',
        width: 4,
        length: 8,
        orientation: 'north',
        hemisphere: 'northern',
      }).then((res) => {
        createdGardenIds.push(res.body.id)
        cy.visit(`/gardens/${res.body.id}`)
        cy.contains('Raised Bed').should('be.visible')
      })
    })
  })

  describe('7.4 Auto-Optimize', () => {
    it('shows auto-optimize button when plants are placed', () => {
      cy.request('POST', '/api/gardens', {
        name: 'Optimize Test Garden',
        type: 'raised',
        width: 4,
        length: 8,
        orientation: 'north',
        hemisphere: 'northern',
      }).then((createRes) => {
        createdGardenIds.push(createRes.body.id)

        // Add plants to the layout
        cy.request('PUT', `/api/gardens/${createRes.body.id}`, {
          layout: [
            { plantId: 'tomato-cherry', gridX: 2, gridY: 2 },
            { plantId: 'basil-sweet', gridX: 3, gridY: 3 },
          ],
        })

        cy.visit(`/gardens/${createRes.body.id}`)
        cy.contains('Auto-Optimize Layout').should('be.visible')
      })
    })

    it('does not show auto-optimize button when no plants are placed', () => {
      cy.request('POST', '/api/gardens', {
        name: 'Empty Optimize Garden',
        type: 'raised',
        width: 4,
        length: 8,
        orientation: 'north',
        hemisphere: 'northern',
      }).then((createRes) => {
        createdGardenIds.push(createRes.body.id)
        cy.visit(`/gardens/${createRes.body.id}`)
        cy.contains('Auto-Optimize Layout').should('not.exist')
      })
    })
  })
})
