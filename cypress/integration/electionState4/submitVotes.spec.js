describe('Test Navigation Links Logged In', () => {
  it('Visits each page and ensures they can be accessed while logged in', () => {
    cy.visit('localhost:3000');

    cy.wait(1000);

	// Visit Vote Page

	cy.get('#nav').contains('Vote').click();
 
    cy.url()
		.should('include', '/candidates');
		
	// Vote Leaderboard

	cy.get('.vote .leaderboard')
		.find('tr:first td:nth-child(5) .btn')
		.click()

	cy.get('.vote .leaderboard')
		.find('#castvote')
		.should('have.text','You successfully cast a vote!')

	cy.get('.vote .leaderboard')
		.expect('tr:first td:nth-child(4)').to.be.greaterThan(0)

	// Vote Single Candidate Page

	cy.get('.candidate-grid')
		.find('a:first')
		.click()

	cy.get('.candidate-single')
		.find('.btn')
		.click()

	cy.get('.candidate-single')
		.find('#castvote')
		.should('have.text','You successfully cast a vote!')

	cy.get('.candidate-single')
		.expect('.vote-count').to.be.greaterThan(0)
  })
})