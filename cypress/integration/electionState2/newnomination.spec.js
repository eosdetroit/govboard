describe('Test Navigation Links Logged In', () => {
  it('Visits each page and ensures they can be accessed while logged in', () => {
    cy.visit('localhost:3000');

    cy.wait(1000);

	// Verify Nomination Page

	cy.get('#nav').contains('Nominate').click();
 
    cy.url()
    	.should('include', '/nominate');

	cy.get('.nomination')
		.type('')
		.should('have.value','')

	cy.get('.nomination')
		.click('')

	cy.wait(500);	

	cy.get('.nomination')
		.find('.nomination-form #nomination-input')
		.should('be.visible','')

  })
})