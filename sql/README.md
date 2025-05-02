# README: Setting Up the Database and Configuring the GraphQL Server

## Overview

This README provides instructions for setting up a MySQL database from a provided dump file and configuring a GraphQL server to connect to the database running on localhost.

---

## Prerequisites

- **MySQL Server**: Ensure that MySQL Server (v8.0 or later) is installed and running.
- **Node.js**: Ensure that Node.js is installed to run the GraphQL server.
- **GraphQL Server Source Code**: Ensure you have the source code for the GraphQL server project.

---

## Setting Up the Database

### 1. Import the MySQL Dump
1. Open a terminal.
2. Log in to your MySQL server:
   ```bash
   mysql -u root -p
   ```
   Provide the root password when prompted.

3. Create the database:
   ```sql
   CREATE DATABASE t19_p2;
   ```
4. Exit the MySQL client:
   ```bash
   exit
   ```

5. Import the database dump file:
   ```bash
   mysql -u root -p t19_p2 < path/to/dumpfile.sql
   ```
   Replace `path/to/dumpfile.sql` with the actual path to your SQL dump file.

6. Confirm the database is correctly imported:
   ```bash
   mysql -u root -p
   ```
   Then run:
   ```sql
   USE t19_p2;
   SHOW TABLES;
   ```
   You should see the tables listed in the database.

---

## Configuring the GraphQL Server

### Update the Database Configuration

1. Open the GraphQL server source code in your preferred editor.
2. Locate the database connection configuration file, typically named something like `config.js` or similar (specific location may vary depending on the project structure).
3. Update the MySQL connection details to point to the localhost database:
   ```javascript
   const dbConfig = {
       host: 'localhost',
       user: 'root',
       password: 'password', // Replace with your MySQL root password
       database: 't19_p2',
   };

   module.exports = dbConfig;
   ```
---

## Testing the Configuration

1. Open your browser or API client (e.g., Postman, GraphQL Playground).
2. Access the GraphQL server at its configured endpoint (e.g., `http://localhost:4000/graphql`).
3. Run a test query to ensure the database connection is working. For example:
   ```graphql
   {
       countries {
           id
           country_name
           population
       }
   }
   ```
   You should see a response with the list of countries.

---

## Troubleshooting

- **Connection Errors**:
  - Ensure the MySQL server is running.
  - Verify the connection details in the configuration file (e.g., username, password, database name).
  - Check if your MySQL server allows connections from localhost.

- **Missing Dependencies**:
  - Ensure all required dependencies are installed:
    ```bash
    npm install
    ```

- **Permission Issues**:
  - Ensure the MySQL user has appropriate permissions to access the database.

---

## Additional Notes

- Replace `root` with another MySQL user if preferred, but ensure that user has the necessary permissions.
- For production environments, avoid using the root user and update `NODE_ENV` variables to secure sensitive credentials. Use environment variables for managing sensitive data.

---

This completes the setup for your MySQL database and GraphQL server. Happy coding! 🚀