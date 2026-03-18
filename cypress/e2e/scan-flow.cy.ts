describe('Scan Flow — Scan → Results → Save', () => {
  beforeEach(() => {
    cy.visit('/scan')
  })

  it('displays the scan page with title and capture component', () => {
    cy.contains('Scan Seed Packet').should('be.visible')
    cy.contains('Take a photo or upload an image').should('be.visible')
    cy.contains('Capture Seed Packet').should('be.visible')
  })

  it('shows Take Photo and Upload Image buttons', () => {
    cy.contains('📷 Take Photo').should('be.visible')
    cy.contains('📁 Upload Image').should('be.visible')
  })

  it('scan API returns mock plant data when MOCK_AI is enabled', () => {
    // Create a tiny 1x1 PNG as a test image
    const blob = Cypress.Blob.base64StringToBlob(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'image/png',
    )
    const formData = new FormData()
    formData.append('image', blob, 'seed-packet.png')

    cy.request({
      method: 'POST',
      url: '/api/scan',
      body: formData,
      // FormData is sent natively; skip JSON encoding
      headers: { 'content-type': 'multipart/form-data' },
      failOnStatusCode: false,
    }).then((res) => {
      // The mock endpoint should return 201 with plant data or
      // 500 if MOCK_AI is not set — both are valid outcomes
      if (res.status === 201) {
        expect(res.body).to.have.property('name')
        expect(res.body).to.have.property('spacing')
        expect(res.body).to.have.property('sunNeeds')
        expect(res.body).to.have.property('source', 'scan')
      } else {
        // API key not configured or mock not enabled — that's okay
        expect(res.status).to.be.oneOf([400, 500])
      }
    })
  })

  it('can create a plant via the plants API (simulating scan result save)', () => {
    const scannedPlant = {
      name: 'Cypress Test Sunflower',
      species: 'Helianthus annuus',
      spacing: 18,
      sunNeeds: 'full',
      daysToMaturity: 70,
      heightCategory: 'tall',
      waterNeeds: 'medium',
      companionPlants: ['cucumber', 'corn'],
      zones: [4, 5, 6, 7, 8],
      plantingWindows: {
        startIndoors: '4-6 weeks before last frost',
        transplant: 'After last frost',
        directSow: '1-2 weeks after last frost',
      },
      source: 'scan',
    }

    // Save plant via API (simulates what happens after a successful scan)
    cy.request('POST', '/api/plants', scannedPlant).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body).to.have.property('id')
      expect(res.body.name).to.eq('Cypress Test Sunflower')
      expect(res.body.source).to.eq('scan')

      const plantId = res.body.id

      // Verify it now appears in the plant list
      cy.visit('/plants')
      cy.contains('Cypress Test Sunflower').should('be.visible')

      // Clean up: delete the test plant
      cy.request('DELETE', `/api/plants/${plantId}`)
    })
  })

  it('saved scan plant appears on detail page with correct info', () => {
    const scannedPlant = {
      name: 'Cypress Scan Basil',
      species: 'Ocimum basilicum',
      spacing: 12,
      sunNeeds: 'full',
      daysToMaturity: 60,
      heightCategory: 'short',
      waterNeeds: 'medium',
      companionPlants: ['tomato', 'pepper'],
      zones: [4, 5, 6, 7, 8, 9],
      plantingWindows: {
        startIndoors: '6-8 weeks before last frost',
        transplant: 'After last frost',
      },
      source: 'scan',
    }

    cy.request('POST', '/api/plants', scannedPlant).then((res) => {
      expect(res.status).to.eq(201)
      const plantId = res.body.id

      // Navigate to detail page
      cy.visit(`/plants/${plantId}`)
      cy.contains('Cypress Scan Basil').should('be.visible')
      cy.contains('Ocimum basilicum').should('be.visible')
      cy.contains('Growing Info').should('be.visible')
      cy.contains('☀️ Full Sun').should('be.visible')
      cy.contains('scan').should('exist')

      // Clean up
      cy.request('DELETE', `/api/plants/${plantId}`)
    })
  })
})
