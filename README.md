## TravelTracker
**Travel Tracker** is a web application that allows users to document, plan, and explore their travel experiences. Users can log their trips, rate destinations, write memories, and visualize their journeys on an interactive map. The platform also offers the ability to explore new destinations, track personal travel history, and manage user profiles, making it an all-in-one travel companion for enthusiasts and frequent travelers.

## Hosted

You can find the website [here](http://it2810-19.idi.ntnu.no/project2/)



## Table of Content

- [TravelTracker](#traveltracker)
- [Hosted](#hosted)
- [Table of Content](#table-of-content)
- [Developers](#developers)
- [Features](#features)
- [Accessibility](#accessibility)
  - [Design Considerations](#design-considerations)
  - [Navbar](#navbar)
- [Folder structure](#folder-structure)
- [How to run](#how-to-run)
  - [Backend:](#backend)
  - [Frontend:](#frontend)
- [Hosting Information](#hosting-information)
- [Technology choices](#technology-choices)
  - [Frontend:](#frontend-1)
  - [Backend:](#backend-1)
- [Design choices](#design-choices)
- [Fixing Picture Errors](#fixing-picture-errors)
    - [Why Does This Happen?](#why-does-this-happen)
    - [How to Fix It](#how-to-fix-it)
- [NPM scripts](#npm-scripts)
- [Testing](#testing)
  - [Testing Tools](#testing-tools)
  - [Vitest Testing](#vitest-testing)
  - [Cypress Testing](#cypress-testing)
  - [GraphQL Server Testing](#graphql-server-testing)
  - [Running Tests](#running-tests)


## Developers

**Developed by:**

- Malin Gustavsen
- Ida Manger
- Christoffer Ulvang Thorvaldsen
- Ida Kristine Tandberg

## Features

- **My travels**: Displays users' planned, ongoing, and past trips in a simple dashboard. Users can view details for each trip, including the destination, travel dates, and status (upcoming, in-progress, or completed). This information can be accessed by clicking the "See Trip" button.

- **Add new travel**: On the "My Travels" page, users can create a new trip, whether it's an upcoming trip or one that has already been completed. Once created, the trip is saved and displayed on the "My Travels" page.

- **Explore new adventures**: User can explore diffenret destinations on the explore page. 

  - **Searching**: Search for spesific countries

  - **Filters**: Browse throughe different caregorties. The filters the user can choose from are country name, country code, tourism, and average rating.

  - **Sorting**: Sort the result alphabetically (ASC-DESC)

  - **Rating and comments**: Users can rate destinations and share their experiences by writing comments. It is possible to edit and delete the comments

- **Map**: Displays users' travel history visually.
  - Countries visited turn green on the map after being added to "My Travels." 
  - The user’s current destination is highlighted in red.
  - By clicking on the different countries, the current weather forecast for the selected country is displayed.
  - By clicking on the weather forecast, you are taken to the explore page for that country.

- **User Authentication**: Users can securely create accounts, log in, and log out of the application. Passwords are securely stored in the database using hashing algorithms. This ensures that even if the database is compromised, user passwords remain protected, as they cannot be retrieved or misused. For users who prefer not to create an account, a demo user is available, allowing them to explore the application’s features without registration.

- **My profle**: There are two main functionalities in the profile.
  - **Statistics**: Statistics on the number of trips, countries visited, and total travel days are updated as new trips are added by the user.
  - **Edit profile**: The user has the option to change their name and address.

- **Light and Drak mode**: Switch between light and dark mode 

## Accessibility

We have used ARIA labels where necessary. Regarding color usage, there are certain instances where we use a gray color instead of pure white or black. While we understand this might slightly reduce accessibility, we have made these choices to balance design considerations.

### Design Considerations

- **Spacing:** We have ensured that elements are spaced appropriately and avoided cramming items together. This makes it easier for all users, including those with visual impairments, to navigate and gain an overview of the interface.
- **Semantic HTML:** We have used semantic `<div>` elements and appropriate HTML tags to improve accessibility for screen readers and assistive technologies.

### Navbar

- **Issue:** The contrast between buttons and the bar color is slightly insufficient.
- **Design Choice:** This was a deliberate decision to create more spacing in the design, which can make it easier for visually impaired users to navigate and control the elements.


## Folder structure
```
T19-PROJECT-2/
├── .github/
│   └── GitHub-specific configuration files
|
├── graphqlServer/
│   ├── models/
│   ├── resolvers/
│   ├── schema/
│   ├── services/
│   ├── .env
│   ├── tsconfig.json
│   ├── package.json
│   └── other TypeScript files and JSON configuration files
├── prosjekt2/
│   ├── node_modules/
│   ├── public/
│   ├── cypress/
│   │   ├── e2e/
│   │   │   └── folder with .cy.js files for testing
│   │   ├── fixtures/
│   │   │   └── folder with mockupData
│   │   ├── support/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── folder with .tsx files
│   │   ├── pages/
│   │   │   └── folder with .tsx files
│   │   ├── services/
│   │   ├── test/
│   │   │   ├── unit/
│   │   │   │   └── unit-related tests
│   │   │   ├── integration/
│   │   │       └── integration tests
│   │   │ 
│   └── TypeScript files and configuration files
├── sql/
│   ├── createDB/
│   ├── MySQL diagram
│   └── README.md
├── package-lock.json
├── postcss.config.js
├── tailwind.config.cjs
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── update.py
├── README.md
└── .gitignore
```
The project is organized in a clean and modular structure to ensure efficient and well-structured development:

**`graphqlServer/`**
The backend part of the project, containing directories for models, resolvers, schemas, and services. This folder also includes environment variables (`.env`) and TypeScript files to handle logic and database integration.

**`prosjekt2/`**
The frontend part of the project. Key subfolders include:

- **`public/`**  
  Public resources directly accessible by the browser, such as images and icons.

- **`src/`**  
  Contains all the source files for building the frontend application, including:
  - **`assets/`**  
    Static resources images and other media.
  - **`components/`**  
    Reusable UI components written in TypeScript (`.tsx`).
  - **`pages/`**  
    Application pages organized into folders with specific functionalities.
  - **`services/`**  
    Logic and functions for handling API calls and data flow.
  - **`test/`**  
    Tests to ensure code quality and functionality.

`sql/`
Includes SQL scripts for database setup, along with documentation and diagrams illustrating the database structure.


## How to run 
Her er en oversikt over hvordan du kjører applikasjonen lokalt på pcen. Det kommer først en oversikt over backend, før frontend blir presentert (elns). Når du har fulgt begge disse forklaringene, skal applikasjonen kjøre på din localhost. 

**Clone the repository**:

   ```bash
   # SSH
   git clone git@git.ntnu.no:IT2810-H24/T19-Project-2.git

   # HTTPS
   git clone https://git.ntnu.no/IT2810-H24/T19-Project-2.git
   
   ```

### Backend:

Navigate into the `graphqlServer` directory and install the dependencies:

```bash
cd graphqlServer
npm run dev
```

You can see how to set up GraphQL Server in this guide
[GraphQL Server Setup Guide](graphqlServer/README.md)

### Frontend: 

Open a new terminal and navigate into the `prosjekt2` directory and install the dependencies:

```bash
cd ../prosjekt2
npm run dev
```
## Hosting Information

- **Frontend**: Hosted at `http://it2810-19.idi.ntnu.no/project2/`.
- **GraphQL API**: Available at `http://it2810-19.idi.ntnu.no:4000/graphql`.

Ensure that the Apache server on the VM is correctly configured to serve the React frontend, and that any firewall rules allow access to the necessary ports (like port `4000` for the GraphQL API).

## Technology choices
The TravelTracker application is built with the following technologies:

### Frontend: 
- **React**: A popular library for building user interfaces. React is used with TypeScript to provide strong typing, improved developer experience, and fewer runtime errors.
- **TypeScript**: A superset of JavaScript that brings static typing to the development process, enabling safer and more predictable code.
- **Tailwind CSS**: A utility-first CSS framework that allows for rapid styling and a consistent design system. Its responsive utilities ensure that the interface adapts seamlessly across different devices and screen sizes.
- **Shadcn**: A component-based library built on top of Tailwind CSS, providing a set of pre-designed and customizable components. It helps speed up development and ensures consistency in the application's design.
- **Lucide**: An open-source icon library used for adding clean and visually appealing icons to the interface. 

### Backend: 
Node.js with GraphQL, and MySQL for the database.

- **Node.js**: A JavaScript runtime built on Chrome's V8 engine, chosen for its ability to handle asynchronous operations and provide a lightweight, efficient backend. Node.js powers the server, enabling a fast and reliable API for the application.
- **GraphQL**: A query language for APIs that allows clients to request exactly the data they need. This flexibility minimizes over-fetching or under-fetching data, improving the efficiency of client-server communication.
- **MySQL**: A robust and widely-used relational database management system. MySQL is chosen for its reliability, scalability, and ability to manage structured data effectively. It stores critical data such as user information, trip details, ratings, and comments.

## Design choices
**General Design Choices**
- **Aesthetic Choices**:The visual elements, including color schemes, typography, and overall style, were carefully selected to reflect the project's theme and values. 

- **Functional Choices**:The structural and functional design focuses on user-friendliness and intuitive navigation. The layout ensures that users can easily interact with the system, reducing friction and enhancing their overall experience.

- **Technology Choices**: Specific frameworks, tools, and technologies were chosen to support the project's goals. These decisions were based on performance, scalability, and compatibility, ensuring that the design is robust and future-proof.

- **User Focus**: The design prioritizes the needs and preferences of the target audience. By understanding the users' requirements, the design was tailored to address their expectations, making the system more engaging and accessible.


**Sustainable Design Choices**

- **Minimalist Design**: Reduced use of heavy graphics and unnecessary animations to save energy.
Adoption of simple and lightweight designs that are less resource-intensive.

- **Reuse and Modularity**: Designing components for reuse across projects and systems. Modular architecture to enable easy updates or replacements instead of overhauling entire systems.

- **Color Choices**: We have chosen a color palette with reduced use of blue tones to support sustainable principles. Blue light requires more energy on screens such as OLED and AMOLED and can contribute to higher power consumption.

- **Dark Mode Option**: Offering a dark mode to reduce energy consumption on OLED and AMOLED screens. Dark mode is set as the default to maximize energy efficiency 


- **Inclusive and Accessible Design**: Ensuring the system is accessible to everyone, to reduce digital waste and unnecessary upgrades.


- **Local Storage and Caching**: Reducing the need for constant server communication by implementing caching and local data storage where possible.

- Vi har valgt en kremhvit bakgrunn istede for en helt hvit, dette for å senke bruken av høye rgb farger i tilleg til at det er mer behagelig for øyet


## Fixing Picture Errors

If you encounter issues with pictures not loading or displaying incorrectly, you can resolve them by updating the picture data in the backend. Follow these steps:

#### Why Does This Happen?

To avoid overloading the external API we use for fetching pictures, we implemented a setup to store the picture links returned by the API directly in the SQL database. However, these links have expiration dates set by the API, meaning they eventually become invalid. This can result in pictures not loading correctly on the platform.

#### How to Fix It

1. **Navigate to the `graphqlServer` Folder:**
   Open a terminal and move into the `graphqlServer` directory:

   ```bash
   cd graphqlServer
   ```

2. **Run the Update Script:**
   Execute the `update-pictures` script to refresh and fix picture data:

   ```bash
   npm run update-pictures
   ```

This will update the country images and resolve any issues related to missing or outdated picture data.

## NPM scripts
Below is an overview of the available npm scripts and their functionality:
- **`start`**  
  Starts the project in development mode using `nodemon`. This watches for file changes and automatically restarts the server when updates are made.  

- **`test`**  
  Runs all the tests in the project using the `jest` testing framework.  


- **`build`**  
  Compiles the TypeScript code into JavaScript using the TypeScript Compiler (`tsc`). The output is stored in the `dist` folder.  

- **`serve`**  
  Launches the server by running the compiled JavaScript file from the `dist` directory (`dist/index.js`).  

- **`dev`**  
  Runs the project directly with `ts-node`, allowing you to execute the `index.ts` file without needing to compile it first. This is ideal for quick development.

---

## Testing

To ensure a robust and reliable application, we have implemented comprehensive testing using the following tools and approaches:

---

### Testing Tools

1. **Vitest**  
   - Used for unit testing individual components and functions.

2. **Cypress**  
   - Used for end-to-end (E2E) testing to validate user flows and application interactivity.

3. **Jest**  
   - Used for testing the GraphQL server's core functionality, including schema validation, authentication, and database interactions.
---
### Vitest Testing

**How to run vitest:**

1. **Navigate to the `prosjekt2` folder**:
   Open a terminal and run:
   ```bash
   cd prosjekt2
   ````
2. **Install dependencies:** Run the following command to install the project dependencies:
   ```bash 
   npm install
   ````
   
3. **Run the tests:** Run the test manually in the terminal with this command
   ```bash 
   npm run test
   ````
   This will run all tests in the terminal and generate a report.

---
### Cypress Testing

**Prerequisites**

1. *Node.js:* Ensure Node.js is installed.
2. *npm:* npm usually comes with the Node.js installation.
3. *Cypress* installed in the project: Ensure Cypress is listed as a dependency in `package.json`.

**How to Run Cypress**

1. **Navigate to the `prosjekt2` folder**:
   Open a terminal and run:
   ```bash
   cd prosjekt2
   ````
2. **Install dependencies:** Run the following command to install the project dependencies:
   ```bash 
   npm install
   ````
   If this is not enough, you may also need to run:
   ```bash 
   npm install cypress --save-dev
   ````
3. **Open Cypress GUI:** Start the Cypress GUI to view and run tests manually:
   ```bash 
   npx cypress open
   ````
   This opens the Cypress Test Runner where you can select which test to run.
4. **Run tests in headless mode:** If you want to run the tests without the GUI, use:
   ```bash
   npx cypress run
   ```
   This will run all tests in the terminal and generate a report.

**Structure**

Tests are usually located in the following folder: **prosjekt2/cypress/e2e/**

- e2e: Contains end-to-end tests.
- fixtures: Contains test data used in the tests.
- support: Contains custom commands and global configurations for the tests.


---

### GraphQL Server Testing

We have implemented a test suite for critical components of the GraphQL server to ensure its reliability and correctness. The tests focus on the following areas:

1. **Index Tests**  
   - Verifies the server initializes correctly and applies middleware as expected.
   - Ensures the `/graphql` endpoint processes requests and returns appropriate responses.
   - Handles unknown routes gracefully by returning `404`.

2. **Database Tests**  
   - Confirms the database connection initializes properly.
   - Verifies the models are defined and relationships between entities (e.g., `User`, `Country`, `Travel`) are correctly established.

3. **Schema Tests**  
   - Validates the structure of the GraphQL schema, ensuring types, queries, and mutations are defined as expected.
   - Includes checks for nested fields and non-nullable constraints.

4. **Authentication Middleware Tests**  
   - Tests token validation and authorization mechanisms.
   - Ensures proper handling of invalid or missing tokens and verifies secure access to restricted operations.

5. **Request Context Tests**  
   - Confirms the behavior of `AsyncLocalStorage` for managing `userId` in the request context.
   - Validates that the context is properly isolated and managed across concurrent requests.

---

### Running Tests

To execute the GraphQL server tests:

1. Navigate to the `graphqlServer` directory:
   ```bash
   cd graphqlServer
   ```

2. Run the test suite using Jest:
   ```bash
   npm test
   ```

3. You should see output similar to this:
   ```
   PASS  tests/index.test.ts
   PASS  tests/db.test.ts
   PASS  tests/schema.test.ts
   PASS  tests/authMiddleware.test.ts
   PASS  tests/requestContext.test.ts
   ```

---




