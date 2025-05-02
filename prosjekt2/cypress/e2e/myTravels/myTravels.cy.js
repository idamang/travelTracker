describe('MyTravels Page', () => {
  beforeEach(() => {
    // Mock login og naviger til MyTravels
    cy.visit('/login'); // Juster URL etter behov
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@test.test');
    cy.get('input[type="password"]').type('Password123');
    cy.get('button').contains('Sign In').click();
    cy.url().should('not.include', '/login');
  });

  it('should display a list of trips', () => {
    // Sjekk at reisene vises
    cy.get('section')
      .find('article')
      .should('have.length', 1)
      .first()
      .contains('Norway');
  });

  it('should filter trips by upcoming and past trips', () => {
    // Klikk på filterbryteren for å vise kommende reiser
    cy.get('[aria-label="Showing past travels"]').click();

    // Sjekk at kun kommende reiser vises
    cy.contains("You don't seem to have any logged travels.").should(
      'be.visible'
    );

    // Klikk igjen for å vise tidligere reiser
    cy.get('[aria-label="Showing all upcoming travels"]').click();

    // Sjekk at kun tidligere reiser vises
    cy.get('section').find('article').should('have.length', 1);
  });

  it('should navigate to trip details when a trip is clicked', () => {
    // Klikk på en reise
    cy.get('section').find('article').first().click();

    // Sjekk at vi navigeres til detaljsiden
    cy.url().should('include', '/mytravels/112');
  });
});
