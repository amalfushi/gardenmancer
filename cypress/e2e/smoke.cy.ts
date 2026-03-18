describe('Smoke Test', () => {
  it('loads the home page', () => {
    cy.visit('/')
    cy.contains('Gardenmancer').should('be.visible')
  })

  it('navigates to main sections', () => {
    cy.visit('/')

    // Check that main navigation links exist
    cy.get('nav').should('exist')

    // Verify key pages are accessible
    const pages = ['/plants', '/calendar', '/gardens']
    pages.forEach((page) => {
      cy.visit(page)
      cy.url().should('include', page)
    })
  })
})
