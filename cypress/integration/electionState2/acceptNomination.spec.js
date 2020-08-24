describe('Test Navigation Links Logged In', () => {
  it('Visits each page and ensures they can be accessed while logged in', () => {
    cy.visit('localhost:3000');

    cy.wait(1000);

	// Verify Nomination Page

	cy.get('#nav').contains('Nominate').click();
 
    cy.url()
    	.should('include', '/nominate');

	cy.get('#form-name')
		.type('Hulk Hogan')
		.should('have.value','Hulk Hogan')

	cy.get('#form-picture')
		.type('https://www.biography.com/.image/t_share/MTIwNjA4NjM0MDQyNzQ2Mzgw/hulk-hogan-9542305-1-402.jpg')
		.should('have.value','https://www.biography.com/.image/t_share/MTIwNjA4NjM0MDQyNzQ2Mzgw/hulk-hogan-9542305-1-402.jpg')

	cy.get('#form-description')
		.type('Vote for me, BROTHER')
		.should('have.value','Vote for me, BROTHER')

	cy.get('#form-telegram')
		.type('Hulkbot')
		.should('have.value','Hulkbot')

	cy.get('#form-twitter')
		.type('https://twitter.com/HulkHogan')
		.should('have.value','HulkHogan')

	cy.get('#form-wechat')
		.type('https://wechat.com')
		.should('have.value','joshhorwitz')

	cy.get('#accept-nom')
		.click()

	cy.wait(1000)

	cy.get('.nomination')
		.find('#updatenom')
		.should('have.text','You have updated your nomination info!')

  })
})