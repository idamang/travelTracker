describe('Maps Component Tests', () => {
  describe('Logged in', () => {
    beforeEach(() => {
      // Logg inn med gyldige brukeropplysninger
      cy.visit('/login');
      cy.get('input[type="email"]').type('test@test.test');
      cy.get('input[type="password"]').type('Password123');
      cy.get('button').contains('Sign In').click();
      cy.url().should('not.include', '/login');
      cy.visit('/maps'); // Naviger til Maps-siden
    });

    it('should display the correct heading and legend', () => {
      // Tester overskrift og beskrivelsestekst
      cy.get('h1').contains('Interactive Map').should('be.visible');
      cy.get('p')
        .contains('View and explore travel locations on the interactive map.')
        .should('be.visible');

      // Tester legenden for kartfargene
      cy.get('p')
        .contains('Currently active travel or your home country')
        .should('be.visible');
      cy.get('p').contains('Countries visited.').should('be.visible');
      cy.get('.w-6.h-6.text-red-600').should('exist'); // Sjekker rød indikator
      cy.get('.w-6.h-6.text-green-600').should('exist'); // Sjekker grønn indikator
    });

    it('should render the map after GeoJSON data is fetched', () => {
      // Mock GeoJSON-data som inkluderer Aruba
      cy.intercept('GET', '**/assets/map.json', {
        fixture: 'geojson.json', // Antatt mock-fil som inneholder Aruba
      });

      // Mock GraphQL-respons for brukerdata
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === 'getPastTravelsFromCurrentUser') {
          req.reply({
            data: {
              getPastTravelsByCurrentUser: {
                active_travel: {
                  country: { cca3: 'ABW' }, // Aruba
                },
                past_travels: [
                  { country: { cca3: 'USA' } },
                  { country: { cca3: 'FRA' } },
                ],
              },
            },
          });
        }
      });

      // Bekreft at kartet vises etter innlasting
      cy.wait(500);
      cy.get('.leaflet-container').should('be.visible');
    });
  });

  describe('Logged out', () => {
    // Test at bruker blir bedt om å logge inn hvis ingen bruker er logget inn
    it('should prompt user to log in if no user is detected', () => {
      cy.visit('/maps');

      cy.url().should('include', '/login');
    });
  });
});
