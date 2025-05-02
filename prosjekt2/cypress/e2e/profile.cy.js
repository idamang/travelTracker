describe('Profile Page', () => {
  beforeEach(() => {
    // Mock login og naviger til Profile-siden
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@test.test');
    cy.get('input[type="password"]').type('Password123');
    cy.get('button').contains('Sign In').click();
    cy.url().should('not.include', '/login');

    cy.visit('/profile'); // Naviger til profil-siden
  });

  it('should display profile details correctly', () => {
    // Bekreft at ProfileCard vises og inneholder brukerdetaljer

    cy.contains('Name').should('be.visible');
    cy.contains('Address').should('be.visible');
    cy.contains('Edit').should('be.visible');
  });

  it('should allow editing profile information', () => {
    // Klikk på Edit-knappen i ProfileCard

    cy.contains('Edit').click();

    // Rediger brukernavn og adresse
    cy.get('input[name="name"]').clear().type('New User Name');
    cy.get('input[name="address"]').clear().type('123 New Address');

    // Lagre endringene
    cy.contains('Save').click();

    // Bekreft at endringene er lagret
    cy.contains('New User Name').should('be.visible');
    cy.contains('123 New Address').should('be.visible');
  });

  it('should display user stats in StatusCard', () => {
    // Bekreft at StatusCard vises

    cy.contains('Countries Visited').should('be.visible');
    cy.contains('Total Trips').should('be.visible');
    cy.contains('Travel Days').should('be.visible');
    // Verifiser at verdiene er synlige
    cy.get('p')
      .contains(/[0-9]+/)
      .should('be.visible'); // Matcher tallverdier
  });

  it('should log out the user when Log Out button is clicked', () => {
    cy.contains('Log Out').click();

    cy.url().should('include', '/login');
    cy.contains('Sign In').should('be.visible');
  });
});
