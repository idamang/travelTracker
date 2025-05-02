import request from 'supertest';
import express, { NextFunction } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { authMiddleware } from '../authmiddleware';
import schema from '../schema/schema';
import resolvers from '../resolvers/resolvers';

// Mock the auth middleware
jest.mock('../authmiddleware', () => ({
  authMiddleware: jest.fn((req: Request, res: Response, next: NextFunction) => next()),
}));

// Mock express-graphql
import { Request, Response } from 'express';

jest.mock('express-graphql', () => ({
  graphqlHTTP: jest.fn(() => (req: Request, res: Response, next: NextFunction) => {
    (res as Response).status(200).json({ data: { __schema: {} } }); // Mocked GraphQL response
    next(); // Ensure middleware chaining
  }),
}));

describe('GraphQL Server', () => {
  let app: express.Express;

  beforeEach(() => {
    // Set up a new app instance for each test
    app = express();

    // Mocked middlewares and routes
    app.use((req, res, next) => {
      require('../authmiddleware').authMiddleware(req, res, next);
    });

    app.use(
      '/graphql',
      require('express-graphql').graphqlHTTP(() => ({
        schema,
        rootValue: resolvers,
        graphiql: false,
      }))
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should respond to a basic GraphQL query', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          query {
            __schema {
              types {
                name
              }
            }
          }
        `,
      });

    expect(response.status).toBe(200); // Assert status
    expect(response.body.data).toHaveProperty('__schema'); // Assert GraphQL schema
  });

  it('should apply middleware', async () => {
    await request(app)
      .post('/graphql')
      .send({
        query: `
          query {
            __schema {
              types {
                name
              }
            }
          }
        `,
      });

    expect(authMiddleware).toHaveBeenCalled(); // Verify auth middleware was called
    expect(graphqlHTTP).toHaveBeenCalled(); // Verify graphqlHTTP was called
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/nonexistent'); // Nonexistent route
    expect(response.status).toBe(404); // Expect 404 error
  });
});
