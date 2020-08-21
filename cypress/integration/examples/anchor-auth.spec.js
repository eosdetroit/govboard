describe('Authorize Anchor Wallet', () => {
  it('establishes authorization and logs into govboard using Anchor Wallet', () => {
    cy.visit('localhost:3000');

    cy.contains('Login').click();

    cy.wait(1000);

    cy.contains('Anchor').click();

	cy.wait(1000);

    cy.contains('Open Anchor app').click();

  })
})