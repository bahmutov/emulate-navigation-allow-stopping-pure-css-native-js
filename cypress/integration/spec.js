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
