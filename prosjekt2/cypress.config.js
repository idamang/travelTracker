import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173/project2/", // Definer grunnleggende URL for testene
    setupNodeEvents(on, config) {
      // Implementer event-lyttere her hvis nødvendig
    },
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}", // Mønster for testfiler
    supportFile: "cypress/support/e2e.js", // Tilpasset supportfil
  },

});
