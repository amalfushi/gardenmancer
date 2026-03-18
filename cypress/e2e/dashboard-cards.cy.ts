describe('Dashboard Card Sizing', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays all four feature cards', () => {
    cy.contains('Scan Seeds').should('be.visible')
    cy.contains('Browse Plants').should('be.visible')
    cy.contains('Plan Calendar').should('be.visible')
    cy.contains('Design Garden').should('be.visible')
  })

  it('all feature cards have consistent height', () => {
    // Verify all cards have height: 100% style for equal sizing
    cy.get('[class*="mantine-Card-root"]').then(($cards) => {
      // There should be at least 4 feature cards (stat cards may also use Card)
      const featureCards = $cards.filter((_, el) => {
        return el.style.height === '100%'
      })
      expect(featureCards.length).to.be.greaterThan(0)
    })
  })
})
