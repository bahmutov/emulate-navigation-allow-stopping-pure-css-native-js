/// <reference types="cypress" />

function onPage(index) {
  cy.contains('button[role=tab]', `Page ${index}`).should(
    'have.attr',
    'aria-selected',
    'true',
  )
  cy.contains('.content', `Page ${index} content`)
}

it('goes from tab to tab', () => {
  cy.visit('dist/index.html')
  onPage(1)
  cy.contains('button[role=tab]', 'Page 2').should(
    'not.have.attr',
    'aria-selected',
  )

  cy.log('**goes to tab 2**')
  cy.contains('button[role=tab]', 'Page 2').click()
  onPage(2)
  cy.contains('button[role=tab]', 'Page 1').should(
    'not.have.attr',
    'aria-selected',
  )
})

it('shows loading element', () => {
  cy.visit('dist/index.html')
  onPage(1)
  cy.contains('button[role=tab]', 'Page 2')
    .click()
    .should('have.attr', 'data-loading')
  onPage(2)
  cy.contains('button[role=tab]', 'Page 2').should(
    'not.have.attr',
    'data-loading',
  )
})

it('cancels transition', () => {
  cy.visit('dist/index.html')
  onPage(1)
  cy.contains('button[role=tab]', 'Page 2')
    .click()
    .should('have.attr', 'data-loading')
    .wait(1000)

  cy.contains('button[role=tab]', 'Page 2').click()
  cy.contains('button[role=tab]', 'Page 2').should(
    'not.have.attr',
    'data-loading',
  )
  onPage(1)
})

it('controls the loading time', () => {
  cy.clock()
  cy.visit('dist/index.html')
  onPage(1)
  cy.contains('button[role=tab]', 'Page 2')
    .click()
    .should('have.attr', 'data-loading')
  cy.tick(3000)
  cy.contains('button[role=tab]', 'Page 2').should(
    'not.have.attr',
    'data-loading',
  )
})

it('controls the loading time with alias', () => {
  cy.clock()
  cy.visit('dist/index.html')
  onPage(1)
  cy.contains('button[role=tab]', 'Page 2')
    .as('page2')
    .click()
    .should('have.attr', 'data-loading')
    .wait(500)
  cy.tick(3000)
  cy.get('@page2').should('not.have.attr', 'data-loading')
})

it('checks the ::before CSS content', () => {
  cy.clock()
  cy.visit('dist/index.html')
  onPage(1)
  cy.contains('button[role=tab]', 'Page 2')
    .click()
    .should('have.attr', 'data-loading')

  cy.window().then((win) => {
    cy.contains('button[role=tab]', 'Page 2').then(($page2) => {
      const before = win.getComputedStyle($page2[0], '::before')
      const content = before.getPropertyValue('content')
      // the content is a string, thus we need to quote it
      expect(content).to.equal('"✖"')
    })

    // advance the app's clock by 3 seconds
    cy.tick(3000)
      // and restore all timing functions
      .invoke('restore')

    // the loading content goes away
    cy.contains('button[role=tab]', 'Page 2').then(($page2) => {
      const before = win.getComputedStyle($page2[0], '::before')
      const content = before.getPropertyValue('content')
      // the content is a string, thus we need to quote it
      expect(content).to.equal('none')
    })
  })
})
