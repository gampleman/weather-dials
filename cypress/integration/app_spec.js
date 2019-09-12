describe('weather dial app', () => {
  it('should display a search box', () => {
    cy.visit('/');
    cy.findByLabelText('City')
  })
});
