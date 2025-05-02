describe('Country Page Tests', () => {
  describe('Logged In User', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.get('button').contains('Try Demo Account').click();
      cy.url().should('include', '/mytravels');
      cy.visit('/');
    });

    it('should navigate to a country page when a country card is clicked', () => {
      // Tester navigasjon til en land-side etter å ha søkt og klikket på et land

      cy.get('input[type="text"]').type('Norway');

      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === 'getCountries') {
          req.reply({
            data: {
              getCountriesPaginated: {
                countries: [
                  {
                    id: '1',
                    cca3: 'NOR',
                    country_name: 'Norway',
                    image_url: 'https://example.com/norway.jpg',
                  },
                ],
                totalPages: 1,
              },
            },
          });
        }
      });

      cy.wait(300);
      cy.get('section')
        .find('article')
        .should('have.length', 1)
        .contains('Norway')
        .click();

      cy.url().should('include', '/nor');
      cy.contains('Norway').should('be.visible');
      cy.contains('Population: 5474360').should('be.visible');
      // sjekk at input feltet med placeholder "Write your comment here..." er synlig

      cy.get('textarea[placeholder="Add a comment..."]').should('be.visible');
      cy.contains('Post Comment').should('be.visible').click();
    });

    // sjekk om det funker å poste kommentar
    it('should allow posting a comment', () => {
      cy.get('input[type="text"]').type('Norway');

      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === 'getCountries') {
          req.reply({
            data: {
              getCountriesPaginated: {
                countries: [
                  {
                    id: '1',
                    cca3: 'NOR',
                    country_name: 'Norway',
                    image_url: 'https://example.com/norway.jpg',
                  },
                ],
                totalPages: 1,
              },
            },
          });
        }
      });

      cy.wait(300);
      cy.get('section')
        .find('article')
        .should('have.length', 1)
        .contains('Norway')
        .click();

      cy.url().should('include', '/nor');
      cy.contains('Norway').should('be.visible');
      cy.contains('Population: 5474360').should('be.visible');
      cy.get('textarea[placeholder="Add a comment..."]').type(
        'This is a comment'
      );
      cy.contains('Post Comment').click();
      cy.get('textarea[placeholder="Add a comment..."]').should('be.empty');
      cy.contains('This is a comment').should('be.visible');
    });
  });

  describe('Not Logged In User', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should not allow comments when not logged in', () => {
      // Tester at kommentarer ikke er tilgjengelige for brukere som ikke er logget inn
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === 'getCountries') {
          req.reply({
            data: {
              getCountriesPaginated: {
                countries: [
                  {
                    id: '1',
                    cca3: 'NOR',
                    country_name: 'Norway',
                    image_url: 'https://example.com/norway.jpg',
                  },
                ],
                totalPages: 1,
              },
            },
          });
        }
      });

      cy.get('input[type="text"]').type('Norway');
      cy.wait(300);

      cy.contains('Norway').click();

      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === 'getCountryByCca3') {
          req.reply({
            data: {
              getCountryByCca3: {
                id: '1',
                cca3: 'NOR',
                country_name: 'Norway',
                population: 5474360,
                image_url: 'https://example.com/norway.jpg',
              },
            },
          });
        }
      });

      cy.url().should('include', '/nor');
      cy.contains('Norway').should('be.visible');
      cy.contains('Population: 5474360').should('be.visible');
      cy.contains('Comments').should('be.visible');
      cy.contains('Log in to comment').should('be.visible');
      cy.get('textarea[placeholder="Write your comment here..."]').should(
        'not.exist'
      );
    });

    // sjekk om kommentarer er synlige
    it('should display comments', () => {
      cy.get('input[type="text"]').type('Norway');

      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === 'getCountries') {
          req.reply({
            data: {
              getCountriesPaginated: {
                countries: [
                  {
                    id: '1',
                    cca3: 'NOR',
                    country_name: 'Norway',
                    image_url: 'https://example.com/norway.jpg',
                  },
                ],
                totalPages: 1,
              },
            },
          });
        }
      });

      cy.wait(300);
      cy.get('section')
        .find('article')
        .should('have.length', 1)
        .contains('Norway')
        .click();

      cy.url().should('include', '/nor');
      cy.contains('Norway').should('be.visible');
      cy.contains('Population: 5474360').should('be.visible');
      cy.contains('Comments').should('be.visible');
      cy.contains('This is a comment').should('be.visible'); // sjekker om den kommentaren som ble laget i sist test er synlig
    });
  });
});
