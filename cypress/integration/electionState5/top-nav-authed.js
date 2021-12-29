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

	// Verify Vote Page / Winner

	cy.get('#nav').contains('Vote').click();
 
    cy.url()
    	.should('include', '/candidates');

	cy.get('.vote .election-info .winner')
		.find('h2')
		.should('have.text','Election Winner');

	cy.get('.vote .election-info .winner')
		.find('h3')
		.should('have.text','Hulk Hogan');

	cy.get('.vote .election-info .winner')
		.should('have.text','oigoigtest11');

	cy.get('.vote .election-info .winner')
		.find('img')
		.should('have.attr', 'src')
		.should('include','https://www.biography.com/.image/t_share/MTIwNjA4NjM0MDQyNzQ2Mzgw/hulk-hogan-9542305-1-402.jpg')

	cy.get('.vote .election-info .winner')
		.should('have.text','VOTE');

	cy.wait(1000);

	// Verify Nomination Page

	cy.get('#nav').contains('Nominate').click();
 
    cy.url()
    	.should('include', '/nominate');

	cy.get('.nomination')
		.find('h1')
		.should('have.text','Nominate')

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