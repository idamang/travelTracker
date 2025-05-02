# GraphQL Server Documentation

## Requirements

### Prerequisites
- **Node.js**: Version 16.x or later
- **npm**: Installed with Node.js
- **MySQL**: Database setup with valid credentials.

### Environment Variables
Ensure the following variables are defined in a `.env` file in the project root:

```dotenv
PORT=4000
NODE_ENV=development
DATABASE_NAME=t19_p2
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_HOST=it2810-19.idi.ntnu.no
DATABASE_PORT=3306
SECRET_KEY=your_secret_key
```

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd graphqlserver
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup the database:
   - Ensure your MySQL server is running.
   - Update `.env` with your database credentials.
   - Run migrations or manually create required tables based on models.

---

## Running the Application

### Development Mode
Start the server with hot-reloading:
```bash
npm run start
```

### Production Mode
Build and run the server:
```bash
npm run build
npm run serve
```

---

## API Endpoints

### GraphQL Endpoint
- **URL**: `http://localhost:<PORT>/graphql`
- **Interactive IDE**: GraphiQL available in development mode.

---

## Schema Overview

### Queries
- `getUsers`: Fetch all users.
- `getCurrentUser`: Fetch the authenticated user.
- `getMaps`: Fetch all maps.
- `getCountryByName(name: String!)`: Fetch a country by its name.
- `getCommentsByCountryId(countryId: ID!)`: Fetch comments for a specific country.
- ... (see full schema in `schema.ts`).

### Mutations
- `createUser`: Create a new user.
- `login`: Authenticate a user and retrieve a token.
- `createComment`: Create a new comment on a country.
- `updateComment`: Update an existing comment.
- `deleteComment`: Delete a comment.

---

## How to Authenticate
1. Obtain a JWT token by using the `login` mutation:
   ```graphql
   mutation {
     login(email: "example@example.com", password: "password") {
       token
       user {
         id
         name
       }
     }
   }
   ```

2. Store the token in `localStorage` (handled in frontend):
   ```javascript
   localStorage.setItem('token', <TOKEN>);
   ```

3. Token is sent automatically in the `Authorization` header:
   ```http
   Authorization: Bearer <TOKEN>
   ```

---

## Middleware

### `authMiddleware`
- Validates the token and sets the `userId` in the request context.
- Automatically restricts access to protected resources.

---

## Folder Structure

```plaintext
.
├── index.ts              # Main server file
├── db.ts                 # Database connection and model relationships
├── schema/               # GraphQL schema definitions
├── resolvers/            # Resolvers for GraphQL queries and mutations
├── models/               # Sequelize models
├── services/             # Services to handle queries gotten by resolvers
├── authmiddleware.ts     # Middleware for authentication
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── .env                  # Environment variables
```

---

## Notes
1. **Database Setup**: Ensure all models (`User`, `Country`, `Map`, etc.) and relationships are correctly migrated into your database.
2. **Error Handling**: Errors in queries or mutations are logged and returned as GraphQL errors.
3. **Customizations**:
   - Modify `authMiddleware` to handle additional roles or permissions.
   - Extend the schema and resolvers for additional functionality.

For further questions or assistance, consult the repository documentation or contact the project maintainer.