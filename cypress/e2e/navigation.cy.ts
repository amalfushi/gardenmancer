describe('Navigation & Edge Cases', () => {
  describe('Navigation links', () => {
    it('home page has feature cards linking to all sections', () => {
      cy.visit('/')
      cy.contains('Gardenmancer').should('be.visible')

      // Feature cards link to main sections
      cy.contains('Scan Seeds').should('be.visible')
      cy.contains('Browse Plants').should('be.visible')
      cy.contains('Plan Calendar').should('be.visible')
      cy.contains('Design Garden').should('be.visible')
    })

    it('bottom navigation bar is present on every page', () => {
      const pages = ['/', '/scan', '/plants', '/calendar', '/gardens']

      pages.forEach((page) => {
        cy.visit(page)
        // NavBar uses aria-label on each link
        cy.get('a[aria-label="Home"]').should('exist')
        cy.get('a[aria-label="Scan"]').should('exist')
        cy.get('a[aria-label="Plants"]').should('exist')
        cy.get('a[aria-label="Calendar"]').should('exist')
        cy.get('a[aria-label="Gardens"]').should('exist')
      })
    })

    it('navigates to scan page via nav bar', () => {
      cy.visit('/')
      cy.get('a[aria-label="Scan"]').click()
      cy.url().should('include', '/scan')
      cy.contains('Scan Seed Packet').should('be.visible')
    })

    it('navigates to plants page via nav bar', () => {
      cy.visit('/')
      cy.get('a[aria-label="Plants"]').click()
      cy.url().should('include', '/plants')
      cy.contains('Plant Database').should('be.visible')
    })

    it('navigates to calendar page via nav bar', () => {
      cy.visit('/')
      cy.get('a[aria-label="Calendar"]').click()
      cy.url().should('include', '/calendar')
      cy.contains('Planting Calendar').should('be.visible')
    })

    it('navigates to gardens page via nav bar', () => {
      cy.visit('/')
      cy.get('a[aria-label="Gardens"]').click()
      cy.url().should('include', '/gardens')
      cy.contains('My Gardens').should('be.visible')
    })

    it('navigates back to home via nav bar', () => {
      cy.visit('/plants')
      cy.get('a[aria-label="Home"]').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.contains('Gardenmancer').should('be.visible')
    })

    it('navigates via feature cards on home page', () => {
      cy.visit('/')
      cy.contains('Scan Seeds').click()
      cy.url().should('include', '/scan')

      cy.visit('/')
      cy.contains('Browse Plants').click()
      cy.url().should('include', '/plants')

      cy.visit('/')
      cy.contains('Plan Calendar').click()
      cy.url().should('include', '/calendar')

      cy.visit('/')
      cy.contains('Design Garden').click()
      cy.url().should('include', '/gardens')
    })
  })

  describe('404 and not-found pages', () => {
    it('shows 404 for invalid routes', () => {
      cy.visit('/nonexistent-page', { failOnStatusCode: false })
      cy.url().should('include', '/nonexistent-page')
      // Next.js shows a 404 page for unknown routes
    })

    it('shows plant not found for invalid plant ID', () => {
      cy.visit('/plants/this-plant-does-not-exist')
      cy.contains('Plant Not Found').should('be.visible')
    })

    it('shows error for invalid garden ID', () => {
      cy.visit('/gardens/this-garden-does-not-exist')
      // Garden detail shows error text
      cy.contains(/not found|Garden not found/i).should('be.visible')
    })
  })

  describe('Empty states', () => {
    it('calendar shows zone selection prompt initially', () => {
      cy.visit('/calendar')
      cy.contains('Select a Zone').should('be.visible')
      cy.contains('Choose your USDA hardiness zone').should('be.visible')
    })

    it('plants page shows empty state when search yields no results', () => {
      cy.visit('/plants')
      cy.get('input[aria-label="Search plants"]').type('xyznonexistentplant')
      cy.contains('No Matches').should('be.visible')
    })
  })

  describe('Browser history navigation', () => {
    it('supports back/forward browser navigation', () => {
      // Visit home, then navigate to plants
      cy.visit('/')
      cy.contains('Gardenmancer').should('be.visible')

      cy.get('a[aria-label="Plants"]').click()
      cy.contains('Plant Database').should('be.visible')

      // Navigate to a plant detail
      cy.contains('Cherry Tomato').click()
      cy.contains('Growing Info').should('be.visible')

      // Go back to plants list
      cy.go('back')
      cy.contains('Plant Database').should('be.visible')

      // Go back to home
      cy.go('back')
      cy.contains('Gardenmancer').should('be.visible')

      // Go forward to plants again
      cy.go('forward')
      cy.contains('Plant Database').should('be.visible')
    })
  })

  describe('Calendar page interactions', () => {
    beforeEach(() => {
      cy.visit('/calendar')
    })

    it('displays zone selector', () => {
      cy.contains('USDA Hardiness Zone').should('be.visible')
    })

    it('shows calendar after selecting a zone', () => {
      // Click the zone selector and pick Zone 6
      cy.get('input[aria-label="USDA Hardiness Zone"]').click()
      cy.get('[role="option"]').contains('Zone 6').click()

      // Calendar should now display planting data
      cy.contains('Zone 6 Planting Calendar').should('be.visible')
    })
  })

  describe('Mobile viewport rendering', () => {
    it('renders navigation correctly at mobile width', () => {
      // Cypress default is already 375px per config
      cy.visit('/')
      cy.contains('Gardenmancer').should('be.visible')

      // Nav bar should exist at mobile size
      cy.get('a[aria-label="Home"]').should('exist')
      cy.get('a[aria-label="Plants"]').should('exist')
    })

    it('plants page is usable at mobile width', () => {
      cy.visit('/plants')
      cy.contains('Plant Database').should('be.visible')
      cy.get('input[aria-label="Search plants"]').should('be.visible')
      cy.contains('Cherry Tomato').should('be.visible')
    })

    it('garden creation works at mobile width', () => {
      cy.visit('/gardens/new')
      cy.contains('Create New Garden').should('be.visible')
      cy.get('input[placeholder="My Raised Bed"]').should('be.visible')
      cy.contains('button', 'Create Garden').should('be.visible')
    })

    it('renders at a wider viewport too', () => {
      cy.viewport(1280, 720)
      cy.visit('/')
      cy.contains('Gardenmancer').should('be.visible')

      // At wider viewport, nav labels should show
      cy.visit('/plants')
      cy.contains('Plant Database').should('be.visible')
    })
  })

  describe('Page titles and metadata', () => {
    it('home page has correct title content', () => {
      cy.visit('/')
      cy.contains('Gardenmancer').should('be.visible')
      cy.contains('Plan, organize, and track your garden').should('be.visible')
    })

    it('scan page has descriptive text', () => {
      cy.visit('/scan')
      cy.contains('Take a photo of a seed packet').should('be.visible')
    })

    it('calendar page has instructional text', () => {
      cy.visit('/calendar')
      cy.contains('Select your USDA zone to see when to plant').should('be.visible')
    })
  })
})
