import { graphql } from 'graphql';
import schema from '../schema/schema';

describe('GraphQL Schema', () => {
  const unwrapType = (type: any) => {
    if (type.kind === 'NON_NULL' || type.kind === 'LIST') {
      return unwrapType(type.ofType);
    }
    return type;
  };

  it('should allow querying user data', async () => {
    const query = `
      {
        __type(name: "User") {
          name
          fields {
            name
            type {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    `;

    const result = await graphql({
      schema,
      source: query,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.__type.name).toBe('User');

    const idField = result.data?.__type.fields.find((field: any) => field.name === 'id');
    const idType = unwrapType(idField.type);

    expect(idType).toEqual({
      kind: 'SCALAR',
      name: 'ID',
    });
  });

  it('should allow querying a list of countries with pagination', async () => {
    const query = `
      {
        __type(name: "Query") {
          fields {
            name
            type {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    `;

    const result = await graphql({
      schema,
      source: query,
    });

    expect(result.errors).toBeUndefined();

    const queryFields = result.data?.__type.fields.map((field: any) => field.name);
    expect(queryFields).toContain('getCountriesPaginated');
  });

  it('should validate the structure of a mutation', async () => {
    const query = `
      {
        __type(name: "Mutation") {
          fields {
            name
            args {
              name
              type {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    `;

    const result = await graphql({
      schema,
      source: query,
    });

    expect(result.errors).toBeUndefined();

    const createUserField = result.data?.__type.fields.find((field: any) => field.name === 'createUser');
    const createUserArgs = createUserField.args;

    const nameArg = createUserArgs.find((arg: any) => arg.name === 'name');
    const nameType = unwrapType(nameArg.type);

    expect(nameType).toEqual({
      kind: 'SCALAR',
      name: 'String',
    });
  });

  it('should fail for invalid queries', async () => {
    const query = `
      {
        nonExistentQuery {
          id
        }
      }
    `;

    const result = await graphql({
      schema,
      source: query,
    });

    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toContain('Cannot query field "nonExistentQuery"');
  });
});
