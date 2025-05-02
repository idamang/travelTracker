import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import asyncLocalStorage from './requestContext';
import { authMiddleware } from './authmiddleware';
import schema from './schema/schema';
import resolvers from './resolvers/resolvers';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware to bind AsyncLocalStorage to each request
app.use((req, res, next) => {
  asyncLocalStorage.run({}, () => {
    next();
  });
});

app.use(cors({ origin: '*' }));

app.use(authMiddleware);

// GraphQL route
app.use(
  '/graphql',
  graphqlHTTP((req, res) => {
    const userId = asyncLocalStorage.getStore()?.userId;

    return {
      schema,
      rootValue: resolvers,
      graphiql: NODE_ENV === 'development', // Enable GraphiQL only in development
      context: { userId },
    };
  })
);

// Start the server
app.listen(PORT, () => {
  console.log(`GraphQL API running at http://localhost:${PORT}/graphql`);
});

export default app; // Export app for testing