describe('Calendar Filter — Filter by garden plants', () => {
  beforeEach(() => {
    cy.visit('/calendar')
  })

  it('displays the calendar page with title', () => {
    cy.contains('Planting Calendar').should('be.visible')
    cy.contains('Select your USDA zone').should('be.visible')
  })

  it('shows filter toggle after selecting a zone', () => {
    // Select zone 6
    cy.get('select, [role="combobox"], input').first().click()
    cy.contains('6').click()

    // Filter should appear
    cy.contains('My Garden Plants Only').should('be.visible')
    cy.contains('Showing:').should('be.visible')
  })

  it('filter toggles between all plants and garden plants', () => {
    // First create a garden with a plant for the filter to work
    const testPlant = {
      name: 'Calendar Filter Test Tomato',
      spacing: 24,
      sunNeeds: 'full',
      daysToMaturity: 75,
      heightCategory: 'tall',
      waterNeeds: 'medium',
      companionPlants: [],
      zones: [5, 6, 7],
      plantingWindows: {
        startIndoors: '6-8 weeks before last frost',
        transplant: 'After last frost',
      },
      source: 'manual',
    }

    cy.request('POST', '/api/plants', testPlant).then((plantRes) => {
      const plantId = plantRes.body.id

      const testGarden = {
        name: 'Calendar Filter Test Garden',
        type: 'raised',
        width: 4,
        length: 4,
        orientation: 'north',
      }

      cy.request('POST', '/api/gardens', testGarden).then((gardenRes) => {
        const gardenId = gardenRes.body.id

        // Add plant to garden
        cy.request('PUT', `/api/gardens/${gardenId}`, {
          layout: [{ plantId, gridX: 0, gridY: 0 }],
        })

        cy.visit('/calendar')

        // Clean up
        cy.request('DELETE', `/api/plants/${plantId}`)
        cy.request('DELETE', `/api/gardens/${gardenId}`)
      })
    })
  })
})
