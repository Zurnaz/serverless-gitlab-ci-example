describe('Feature one', () => {
  it('call endpoint /first', () => {
    cy.request('/first')
      .its('headers')
      .its('content-type')
      .should('include', 'application/json')
  })
})
