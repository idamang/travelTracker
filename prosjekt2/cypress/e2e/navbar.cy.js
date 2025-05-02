describe('Navbar Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/project2/');
  });

  it('renders the navbar correctly', () => {
    cy.contains('TravelTracker').should('be.visible');
    cy.contains('My travels').should('be.visible');
    cy.contains('Map').should('be.visible');
    cy.contains('Explore').should('be.visible');
    cy.contains('Profile').should('be.visible');
  });

  it('checks if navigation items are buttons', () => {
    cy.contains('Profile').closest('button').should('exist');
    cy.contains('Explore').closest('button').should('exist');
    cy.contains('Map').closest('h1').should('not.exist');
    cy.contains('My travels').closest('button').should('exist');
    cy.contains('TravelTracker').closest('button').should('not.exist');
  });
});
