describe('Test Navigation Links Logged In', () => {
  it('Visits each page and ensures they can be accessed while logged in', () => {
    cy.visit('localhost:3000');

    cy.wait(1000);

    cy.get('#nav').contains('About').click();

    cy.url()
		.should('include', '/about');

	cy.get('.about')
		.find('h1')
		.should('have.text','About');

	cy.wait(1000);

	// Verify Vote Page

	cy.get('#nav').contains('Vote').click();
 
    cy.url()
    	.should('include', '/candidates');

	cy.get('.vote')
		.find('.election-info')
		.should('have.text','Ballot ID:');

	cy.get('.vote')
		.find('.election-status')
		.should('have.text','Election Status: Nominations Open');

	cy.wait(1000);

	// Verify Nomination Page

	cy.get('#nav').contains('Nominate').click();
 
    cy.url()
    	.should('include', '/nominate');

	cy.get('.nomination')
		.find('.nomination-list')
		.should('be.visible')

	cy.get('.nomination')
		.find('.nomination-form #nomination-input')
		.should('be.visible')

	cy.wait(1000);

	// Verify Homepage

	cy.get('#nav').contains('Home').click();
 
    cy.url()
    	.should('include', '/');

	cy.get('.home')
		.find('h1')
		.should('have.text','OIG Election Process');
  })
})