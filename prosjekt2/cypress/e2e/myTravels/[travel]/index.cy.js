describe('TripDetail Page', () => {
  beforeEach(() => {
    // Logg inn og naviger til en spesifikk reise
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@test.test');
    cy.get('input[type="password"]').type('Password123');
    cy.get('button').contains('Sign In').click();
    cy.url().should('not.include', '/login');

    // Naviger til en spesifikk reise
    cy.visit('/mytravels/112'); // Juster ID for testen
  });

  it('should display the back button and navigate back when clicked', () => {
    // Sjekk at tilbake-knappen vises
    cy.contains('← Back to your travels').should('be.visible');

    // Klikk på tilbake-knappen og sjekk navigasjon
    cy.contains('← Back to your travels').click();
    cy.url().should('include', '/mytravels');
  });

  // Legg til test for å sjekke at reisedetaljer vises
  it('should display trip details', () => {
    // Sjekk at reisedetaljer vises
    cy.get('#countryName').contains('Norway').should('be.visible');
    cy.get('#startDate').contains('2023-12-01').should('be.visible');
    cy.get('#endDate').contains('2023-12-10').should('be.visible');
    cy.get('#description')
      .contains('This was an amazing trip.')
      .should('be.visible');
  });

  // Legg til test for å sjekke at reisedetaljer kan redigeres og lagres

  it('should allow editing and saving trip details in TripOverview', () => {
    // Klikk på rediger-knappen i TripOverview

    cy.contains('Edit').click();

    // Endre startdato, sluttdato og beskrivelse
    cy.get('[aria-label="Start date, format: YYYY-MM-DD"]')
      .clear()
      .type('2023-12-01');
    cy.get('[aria-label="End date, format: YYYY-MM-DD"]')
      .clear()
      .type('2023-12-10');
    cy.get('textarea').clear().type('This was an amazing trip.');

    // Lagre endringene
    cy.contains('Save').click();

    // Bekreft at lagringsmeldingen vises
    cy.contains('Your trip has been saved successfully.').should('be.visible');
  });
});
