describe('template spec', () => {
  it('pasa', () => {
    cy.visit('/')          
    cy.contains('Home')    
  })
})