describe('Login Page with Demo Login', () => {
  beforeEach(() => {
    // Naviger til login-siden
    cy.visit('/login');
  });

  it('should display the login form', () => {
    // Sjekk at login-siden vises med riktig innhold
    cy.get('button').contains('Try Demo Account').should('be.visible');
  });

  it('should login using the demo account', () => {
    // Klikk på "Try Demo Account"-knappen
    cy.get('button').contains('Try Demo Account').click();

    // Verifiser at brukeren navigeres til mytravels
    cy.url().should('include', '/mytravels');
  });

  it('should display error if demo login fails', () => {
    // Mock feil for demo-login ved å bruke `cy.intercept` (valgfritt)
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === 'Login') {
        req.reply({
          statusCode: 401,
          body: {
            errors: [{ message: 'Demo login failed. Please try again.' }],
          },
        });
      }
    });

    // Klikk på "Try Demo Account"-knappen
    cy.get('button').contains('Try Demo Account').click();

    // Sjekk at feilmeldingen vises
    cy.contains('Demo login failed. Please try again.').should('be.visible');
  });

  it('should allow navigating back using the Back button', () => {
    // Klikk på "Back"-knappen
    cy.get('button').contains('Back').click();

    // Sjekk at brukeren navigeres bort fra /login
    cy.url().should('not.include', '/login');
  });

  // logge på eksisterende bruker
  it('should allow logging in with an existing user', () => {
    // Skriv inn gyldig e-post og passord
    cy.get('input[type="email"]').type('test@test.test');
    cy.get('input[type="password"]').type('Password123');
    cy.get('button').contains('Sign In').click();
    cy.url().should('not.include', '/login');
  });
});
