describe('Explore Page', () => {
  beforeEach(() => {
    // Logg inn med demo-bruker
    // Logg inn med demo-bruker
    cy.visit('/login'); // Bruker relatert sti i stedet for full URL
    cy.get('button').contains('Try Demo Account').click();

    // Naviger til Explore-siden
    cy.visit('/'); // Bruker relatert sti
  });

  it('should display a list of countries', () => {
    // Sjekk at det er en liste med land som vises
    cy.get('section')
      .find('article') // Hvert land er representert som en `article`
      .should('have.length.greaterThan', 0); // Sørg for at det er minst ett land
  });

  it('should allow searching for countries', () => {
    // Skriv inn søketekst i søkefeltet
    cy.get('input[type="text"]').type('Norway');

    // Mock API for søke-respons
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
    // Vent på debounce-logikken og sjekk at "Norway" vises i listen
    cy.wait(300);
    cy.get('section')
      .find('article')
      .should('have.length', 1)
      .contains('Norway');
  });
  it('should navigate to a country detail page when a country is clicked', () => {
    // Klikk på første land i listen
    cy.get('section').find('article').first().click();

    // Sjekk at vi navigeres til detaljsiden for landet
    cy.url().should('include', '/fra'); // URL inkluderer landets kode
  });

  it('should display pagination and allow navigation between pages', () => {
    // Mock API for flere sider
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === 'getCountries') {
        req.reply({
          data: {
            getCountriesPaginated: {
              countries: Array.from({ length: 12 }, (_, i) => ({
                id: `${i + 1}`,
                cca3: `COUNTRY${i + 1}`,
                country_name: `Country ${i + 1}`,
                image_url: null,
              })),
              totalPages: 3, // 3 sider totalt
            },
          },
        });
      }
    });

    // Sjekk at paginering vises
    cy.contains('Next').should('be.visible');

    // Naviger til neste side
    cy.contains('Next').click();

    // Mock neste side
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.variables.page === 2) {
        req.reply({
          data: {
            getCountriesPaginated: {
              countries: Array.from({ length: 12 }, (_, i) => ({
                id: `${i + 13}`,
                cca3: `COUNTRY${i + 13}`,
                country_name: `Country ${i + 13}`,
                image_url: null,
              })),
              totalPages: 3,
            },
          },
        });
      }
    });

    // Sjekk at innholdet oppdateres for side 2
    cy.get('section').find('article').first().contains('Greece');
  });

  it('should show a "No countries found" message if no countries match the search', () => {
    // Skriv inn en tekst som ikke matcher noen land
    cy.get('input[type="text"]').type('UnknownCountry');

    // Mock API for ingen treff
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === 'getCountries') {
        req.reply({
          data: {
            getCountriesPaginated: {
              countries: [],
              totalPages: 0,
            },
          },
        });
      }
    });

    // Vent på debounce-logikken og sjekk at ingen land vises
    cy.wait(300);
    cy.contains('No countries found.').should('be.visible');
  });
});
