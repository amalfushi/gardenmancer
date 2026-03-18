describe('Plants Flow — Browse → Search → Detail', () => {
  beforeEach(() => {
    cy.visit('/plants')
  })

  it('displays the plant database title', () => {
    cy.contains('Plant Database').should('be.visible')
  })

  it('loads and displays seeded plants', () => {
    // The app seeds with plants from seed-plants.json
    // Cherry Tomato is the first seeded plant
    cy.contains('Cherry Tomato').should('be.visible')
  })

  it('shows search input and sun filter', () => {
    cy.get('input[aria-label="Search plants"]').should('be.visible')
  })

  it('filters plants by search text', () => {
    cy.get('input[aria-label="Search plants"]').type('tomato')

    // Should show tomato varieties
    cy.contains('Cherry Tomato').should('be.visible')
    cy.contains('Beefsteak Tomato').should('be.visible')

    // Non-tomato plants should not be visible
    cy.contains('Bell Pepper').should('not.exist')
  })

  it('shows no matches message for invalid search', () => {
    cy.get('input[aria-label="Search plants"]').type('zzzznotaplant')
    cy.contains('No Matches').should('be.visible')
    cy.contains('No plants match your search').should('be.visible')
  })

  it('clears search to show all plants again', () => {
    cy.get('input[aria-label="Search plants"]').type('tomato')
    cy.contains('Bell Pepper').should('not.exist')

    cy.get('input[aria-label="Search plants"]').clear()
    cy.contains('Bell Pepper').should('be.visible')
  })

  it('navigates to plant detail when a plant card is clicked', () => {
    cy.contains('Cherry Tomato').click()
    cy.url().should('include', '/plants/')

    // Detail page should show the plant name and info
    cy.contains('Cherry Tomato').should('be.visible')
    cy.contains('Solanum lycopersicum').should('be.visible')
  })

  it('plant detail page shows growing info section', () => {
    cy.contains('Cherry Tomato').click()

    cy.contains('Growing Info').should('be.visible')
    cy.contains('Sun Needs').should('be.visible')
    cy.contains('☀️ Full Sun').should('be.visible')
    cy.contains('Water Needs').should('be.visible')
    cy.contains('Height').should('be.visible')
    cy.contains('Spacing').should('be.visible')
    cy.contains('Days to Maturity').should('be.visible')
  })

  it('plant detail page shows hardiness zones', () => {
    cy.contains('Cherry Tomato').click()

    cy.contains('Hardiness Zones').should('be.visible')
    // Cherry tomato supports zones 3-10
    cy.contains('Zone 5').should('be.visible')
    cy.contains('Zone 7').should('be.visible')
  })

  it('plant detail page shows planting windows', () => {
    cy.contains('Cherry Tomato').click()

    cy.contains('Planting Windows').should('be.visible')
    cy.contains('🏠 Start Indoors:').should('be.visible')
    cy.contains('6-8 weeks before last frost').should('be.visible')
    cy.contains('🌱 Transplant:').should('be.visible')
  })

  it('plant detail page shows companion plants', () => {
    cy.contains('Cherry Tomato').click()

    cy.contains('Companion Plants').should('be.visible')
  })

  it('plant detail page shows source badge', () => {
    cy.contains('Cherry Tomato').click()

    cy.contains('Source:').should('be.visible')
    cy.contains('seed').should('exist')
  })

  it('plant detail has back navigation to plants list', () => {
    cy.contains('Cherry Tomato').click()
    cy.contains('← Back to Plants').should('be.visible')

    cy.contains('← Back to Plants').click()
    cy.url().should('include', '/plants')
    cy.contains('Plant Database').should('be.visible')
  })

  it('plant detail has Add to Garden button', () => {
    cy.contains('Cherry Tomato').click()
    cy.contains('🌱 Add to Garden').should('be.visible')
  })

  it('Add to Garden opens modal with garden selector', () => {
    cy.contains('Cherry Tomato').click()
    cy.contains('🌱 Add to Garden').click()

    // Modal should appear
    cy.contains('Add to Garden').should('be.visible')
  })

  it('shows plant not found for invalid plant ID', () => {
    cy.visit('/plants/nonexistent-plant-id-12345')
    cy.contains('Plant Not Found').should('be.visible')
    cy.contains('← Back to Plants').should('be.visible')
  })

  it('plant cards display spacing and maturity info', () => {
    // Plant cards show spacing and days-to-maturity
    cy.contains('24″ spacing').should('be.visible') // Cherry Tomato has 24" spacing
    cy.contains('65 days').should('be.visible') // Cherry Tomato: 65 days to maturity
  })
})
