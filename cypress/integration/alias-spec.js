/// <reference types="cypress" />

it('use cy.alias', () => {
  cy.visit('dist/index.html')
  cy.contains('button[role=tab]', 'Page 1').as('page1')
  cy.contains('button[role=tab]', 'Page 2').as('page2')
  cy.get('@page1').should('have.attr', 'aria-selected', 'true')
  cy.get('@page2').should('not.have.attr', 'aria-selected', 'true')
  cy.get('@page2').click()

  cy.get('@page2').should('have.attr', 'aria-selected', 'true')
  cy.get('@page1').should('not.have.attr', 'aria-selected', 'true')
})

it('use cy.alias with page object-ish', () => {
  cy.visit('dist/index.html')
  cy.contains('button[role=tab]', 'Page 1').as('page1')
  cy.contains('button[role=tab]', 'Page 2').as('page2')

  const pages = {
    one() {
      return cy.get('@page1')
    },
    two() {
      return cy.get('@page2')
    },
  }

  pages.one().should('have.attr', 'aria-selected', 'true')
  pages.two().should('not.have.attr', 'aria-selected', 'true').click()

  pages.two().should('have.attr', 'aria-selected', 'true')
  pages.one().should('not.have.attr', 'aria-selected', 'true')
})

it('use cy.alias with page getters', () => {
  cy.visit('dist/index.html')
  cy.contains('button[role=tab]', 'Page 1').as('page1')
  cy.contains('button[role=tab]', 'Page 2').as('page2')

  // see intro in https://www.programiz.com/javascript/getter-setter
  const pages = {
    get one() {
      return cy.get('@page1')
    },
    get two() {
      return cy.get('@page2')
    },
  }

  pages.one.should('have.attr', 'aria-selected', 'true')
  pages.two.should('not.have.attr', 'aria-selected', 'true').click()

  pages.two.should('have.attr', 'aria-selected', 'true')
  pages.one.should('not.have.attr', 'aria-selected', 'true')
})

it('use cy.alias with page getters and in-time setter', () => {
  cy.visit('dist/index.html')

  const pages = {
    get one() {
      Cypress._.once(() => {
        cy.contains('button[role=tab]', 'Page 1').as('page1')
      })()
      return cy.get('@page1')
    },
    get two() {
      Cypress._.once(() => {
        cy.contains('button[role=tab]', 'Page 2').as('page2')
      })()
      return cy.get('@page2')
    },
  }

  pages.one.should('have.attr', 'aria-selected', 'true')
  pages.two.should('not.have.attr', 'aria-selected', 'true').click()

  pages.two.should('have.attr', 'aria-selected', 'true')
  pages.one.should('not.have.attr', 'aria-selected', 'true')
})

it('use cy.alias with function helpers', () => {
  function element(fn, alias) {
    fn().as(alias)
    return () => cy.get(`@${alias}`)
  }

  cy.visit('dist/index.html')

  const page1 = element(
    () => cy.contains('button[role=tab]', 'Page 1'),
    'page1',
  )

  const page2 = element(
    () => cy.contains('button[role=tab]', 'Page 2'),
    'page2',
  )

  page1().should('have.attr', 'aria-selected', 'true')
  page2().should('not.have.attr', 'aria-selected', 'true').click()

  page2().should('have.attr', 'aria-selected', 'true')
  page1().should('not.have.attr', 'aria-selected', 'true')
})

it('use cy.alias with helper with automatic alias', () => {
  function element(fn, alias = `element-${Cypress._.random(1e4)}`) {
    fn().as(alias)
    return () => cy.get(`@${alias}`)
  }

  cy.visit('dist/index.html')

  const page1 = element(() => cy.contains('button[role=tab]', 'Page 1'))
  const page2 = element(() => cy.contains('button[role=tab]', 'Page 2'))

  page1().should('have.attr', 'aria-selected', 'true')
  page2().should('not.have.attr', 'aria-selected', 'true').click()

  page2().should('have.attr', 'aria-selected', 'true')
  page1().should('not.have.attr', 'aria-selected', 'true')
})

it('use cy.alias via proxy', () => {
  function element(fn, alias = `element-${Cypress._.random(1e4)}`) {
    fn().as(alias)

    // really dummy proxy because the target is an empty object
    // the real target is the aliased object
    const p = new Proxy(
      {},
      {
        get(_, name) {
          return cy.get(`@${alias}`)[name]
        },
      },
    )

    return p
  }

  cy.visit('dist/index.html')

  const page1 = element(() => cy.contains('button[role=tab]', 'Page 1'))
  const page2 = element(() => cy.contains('button[role=tab]', 'Page 2'))

  page1.should('have.attr', 'aria-selected', 'true')
  page2.should('not.have.attr', 'aria-selected', 'true').click()

  page2.should('have.attr', 'aria-selected', 'true')
  page1.should('not.have.attr', 'aria-selected', 'true')
})
