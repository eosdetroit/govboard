describe('Test Navigation Links Logged In', () => {
  it('Visits each page and ensures they can be accessed while logged in', () => {
    cy.visit('localhost:3000');

    cy.wait(1000);

	// Verify Vote Page

	cy.get('#nav').contains('Vote').click();
 
    cy.url()
    	.should('include', '/candidates');

	cy.get('.vote')
		.find('')
		.should('have.text','');

	cy.get('.candidate-grid')
		.find('a')
		.should('have.length', 2)

	cy.get('.candidate-grid')
		.find('a:first')
		.click()

	cy.get('.candidate-single')
		.find('h2')
		.should('have.text', 'Hulk Hogan')

	cy.get('.candidate-single')
		.find('.description')
		.should('have.text', 'Vote for me, BROTHER!')

	cy.get('.candidate-single')
		.find('img')
		.should('have.attr', 'src')
		.should('include','https://www.biography.com/.image/t_share/MTIwNjA4NjM0MDQyNzQ2Mzgw/hulk-hogan-9542305-1-402.jpg')

	cy.get('.candidate-single')
		.find('.telegram')
		.should('have.attr', 'href')
		.should('include', 'https://t.me/Hulkbot')

	cy.get('.candidate-single')
		.find('.twitter')
		.should('have.attr', 'href')
		.should('include', 'https://twitter.com/HulkHogan')

	cy.get('.candidate-single')
		.find('.wechat')
		.should('have.attr', 'href')
		.should('include', 'weixin://dl/profile/joshhorwitz')

  })
})