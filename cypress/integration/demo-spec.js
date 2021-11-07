/// <reference types="cypress" />

it('uses full page object', () => {
  const pages = {
    visit() {
      cy.visit('dist/index.html')

      cy.contains('button[role=tab]', 'Page 1').as('page1')
      cy.contains('button[role=tab]', 'Page 2').as('page2')

      Object.defineProperties(window, {
        page1: {
          get() {
            return cy.get('@page1')
          },
        },
        page2: {
          get() {
            return cy.get('@page2')
          },
        },
      })
    },
  }

  pages.visit()
  page1.should('have.attr', 'aria-selected', 'true')
  page2.should('not.have.attr', 'aria-selected', 'true')

  page2.click().should('have.attr', 'data-loading')

  page2.should('have.attr', 'aria-selected', 'true')
  page1.should('not.have.attr', 'aria-selected', 'true')

  page2.should('not.have.attr', 'data-loading')

  // by using Object.defineProperty and only specifying the getter,
  // we prevent the user from accidentally overwriting the variable
  // THIS WILL CAUSE AN ERROR
  // Cannot set property page2 of #<Window> which has only a getter
  // page2 = 'foo'
})
