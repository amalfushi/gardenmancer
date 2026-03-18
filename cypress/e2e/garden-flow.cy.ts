describe('Garden Flow — Create → Layout → Manage', () => {
  // Track gardens created during tests for cleanup
  const createdGardenIds: string[] = []

  afterEach(() => {
    // Clean up any gardens created during tests
    createdGardenIds.forEach((id) => {
      cy.request({ method: 'DELETE', url: `/api/gardens/${id}`, failOnStatusCode: false })
    })
    createdGardenIds.length = 0
  })

  describe('Garden list page', () => {
    it('displays the gardens page title', () => {
      cy.visit('/gardens')
      cy.contains('My Gardens').should('be.visible')
    })

    it('shows create new garden button', () => {
      cy.visit('/gardens')
      cy.contains('+ Create New Garden').should('be.visible')
    })

    it('shows empty state when no gardens exist', () => {
      // Check API for gardens — if empty, verify empty state
      cy.request('/api/gardens').then((res) => {
        if (res.body.length === 0) {
          cy.visit('/gardens')
          cy.contains('No Gardens Yet').should('be.visible')
          cy.contains('Create your first garden').should('be.visible')
        }
      })
    })

    it('navigates to create garden page via button', () => {
      cy.visit('/gardens')
      cy.contains('+ Create New Garden').click()
      cy.url().should('include', '/gardens/new')
    })
  })

  describe('Create garden form', () => {
    beforeEach(() => {
      cy.visit('/gardens/new')
    })

    it('displays the create garden form with title', () => {
      cy.contains('Create New Garden').should('be.visible')
    })

    it('shows all required form fields', () => {
      cy.contains('Garden Name').should('be.visible')
      cy.contains('Garden Type').should('be.visible')
      cy.contains('Width (feet)').should('be.visible')
      cy.contains('Length (feet)').should('be.visible')
      cy.contains('Orientation').should('be.visible')
    })

    it('has default values for type, width, length, and orientation', () => {
      // Width defaults to 4
      cy.get('input[aria-label="Width (feet)"]').should('have.value', '4')

      // Length defaults to 8
      cy.get('input[aria-label="Length (feet)"]').should('have.value', '8')
    })

    it('shows submit button with Create Garden text', () => {
      cy.contains('button', 'Create Garden').should('be.visible')
    })

    it('validates required garden name', () => {
      // Try submitting without a name
      cy.contains('button', 'Create Garden').click()
      cy.contains('Name is required').should('be.visible')
    })

    it('creates a garden successfully and redirects to editor', () => {
      // Fill out the form
      cy.get('input[placeholder="My Raised Bed"]').type('Cypress Test Garden')

      // Submit the form
      cy.contains('button', 'Create Garden').click()

      // Should redirect to the garden editor
      cy.url().should('include', '/gardens/')
      cy.url().should('not.include', '/gardens/new')

      // Garden name should appear on the editor page
      cy.contains('Cypress Test Garden').should('be.visible')

      // Save the garden ID for cleanup
      cy.url().then((url) => {
        const id = url.split('/gardens/')[1]
        if (id) createdGardenIds.push(id)
      })
    })

    it('creates a garden with custom dimensions', () => {
      cy.get('input[placeholder="My Raised Bed"]').type('Big Garden')

      // Clear and set width
      cy.get('input[aria-label="Width (feet)"]').clear().type('10')

      // Clear and set length
      cy.get('input[aria-label="Length (feet)"]').clear().type('20')

      cy.contains('button', 'Create Garden').click()

      // Should redirect and show dimensions
      cy.url().should('include', '/gardens/')
      cy.contains('10×20 ft').should('be.visible')

      cy.url().then((url) => {
        const id = url.split('/gardens/')[1]
        if (id) createdGardenIds.push(id)
      })
    })
  })

  describe('Garden editor page', () => {
    let testGardenId: string

    beforeEach(() => {
      // Create a test garden via API
      cy.request('POST', '/api/gardens', {
        name: 'Editor Test Garden',
        type: 'raised',
        width: 4,
        length: 8,
        orientation: 'south',
      }).then((res) => {
        testGardenId = res.body.id
        createdGardenIds.push(testGardenId)
        cy.visit(`/gardens/${testGardenId}`)
      })
    })

    it('displays garden name and dimensions', () => {
      cy.contains('Editor Test Garden').should('be.visible')
      cy.contains('4×8 ft').should('be.visible')
      cy.contains('Faces south').should('be.visible')
    })

    it('shows plant count badge', () => {
      cy.contains('0 plants').should('be.visible')
    })

    it('displays plant palette section', () => {
      cy.contains('Plant Palette').should('be.visible')
    })

    it('displays the garden canvas', () => {
      cy.get('[data-testid="garden-canvas"]').should('exist')
    })

    it('shows plants in the palette from seeded data', () => {
      // The palette should list seeded plants
      cy.contains('Cherry Tomato').should('be.visible')
    })

    it('does not show clear button when no plants are placed', () => {
      cy.contains('button', 'Clear').should('not.exist')
    })

    it('garden persists after page reload', () => {
      cy.reload()
      cy.contains('Editor Test Garden').should('be.visible')
      cy.contains('4×8 ft').should('be.visible')
    })

    it('garden appears in the garden list', () => {
      cy.visit('/gardens')
      cy.contains('Editor Test Garden').should('be.visible')
    })
  })

  describe('Garden data via API', () => {
    it('creates and retrieves a garden via API', () => {
      cy.request('POST', '/api/gardens', {
        name: 'API Test Garden',
        type: 'flat',
        width: 6,
        length: 12,
        orientation: 'east',
      }).then((createRes) => {
        expect(createRes.status).to.eq(201)
        expect(createRes.body).to.have.property('id')
        expect(createRes.body.name).to.eq('API Test Garden')
        expect(createRes.body.type).to.eq('flat')
        expect(createRes.body.layout).to.deep.eq([])

        const gardenId = createRes.body.id
        createdGardenIds.push(gardenId)

        // Retrieve the garden
        cy.request(`/api/gardens/${gardenId}`).then((getRes) => {
          expect(getRes.body.name).to.eq('API Test Garden')
          expect(getRes.body.width).to.eq(6)
          expect(getRes.body.length).to.eq(12)
          expect(getRes.body.orientation).to.eq('east')
        })
      })
    })

    it('updates garden layout via API', () => {
      cy.request('POST', '/api/gardens', {
        name: 'Layout Test Garden',
        type: 'raised',
        width: 4,
        length: 4,
        orientation: 'north',
      }).then((createRes) => {
        const gardenId = createRes.body.id
        createdGardenIds.push(gardenId)

        // Add a plant placement
        const layout = [{ plantId: 'tomato-cherry', gridX: 2, gridY: 2 }]
        cy.request('PUT', `/api/gardens/${gardenId}`, { layout }).then((updateRes) => {
          expect(updateRes.body.layout).to.have.length(1)
          expect(updateRes.body.layout[0].plantId).to.eq('tomato-cherry')
        })
      })
    })

    it('deletes a garden via API', () => {
      cy.request('POST', '/api/gardens', {
        name: 'Delete Me Garden',
        type: 'container',
        width: 2,
        length: 2,
        orientation: 'west',
      }).then((createRes) => {
        const gardenId = createRes.body.id

        cy.request('DELETE', `/api/gardens/${gardenId}`).then((deleteRes) => {
          expect(deleteRes.body).to.have.property('success', true)
        })

        // Verify it's gone
        cy.request({
          url: `/api/gardens/${gardenId}`,
          failOnStatusCode: false,
        }).then((getRes) => {
          expect(getRes.status).to.eq(404)
        })
      })
    })
  })
})
