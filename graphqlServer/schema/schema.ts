import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    created_at: String!
    address: String
    country_id: ID
    country: Country
    num_countries_visited: Int
    num_travels: Int
    travel_days: Int
    visitedCountries: [Country!]
    currentCountry: Country
  }

  type Rating {
    user_id: ID!
    country_id: ID!
    rating_value: Int!
    timestamp: String!
    user: User
    country: Country
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Map {
    id: ID!
    map_name: String!
    geojson_data: String!
    created_at: String!
    country_id: Int
  }

  type Country {
    id: ID!
    country_name: String!
    cca3: String
    continent: String
    population: Int
    currency: String
    official_language: String
    country_code: String
    tourism: Int
    capital: String
    image_url: String
    average_rating: Float
  }

  type Travel {
    id: ID!
    user_id: ID!
    country_destination: ID!
    country: Country!
    start_date: String!
    end_date: String!
    image_url: String
    description: String
  }

  type MapTravel {
    past_travels: [Travel]
    active_travel: Travel
  }

  type PaginatedCountries {
    countries: [Country]
    totalPages: Int
  }
  
  type Comment {
    id: ID!
    user_id: ID!
    country_id: ID!
    text: String!
    created_at: String!
    user: User
    country: Country
    editable: Boolean
  }

  type Query {
    getUsers: [User]
    getCurrentUser: User
    getMaps: [Map]
    getMapById(id: ID!): Map
    getCountryByName(name: String!): Country
    getCountryByCca3(cca3: String!): Country
    getTravelsByCurrentUser: [Travel]
    getTravelById(id: ID!): Travel
    getCountriesPaginated(
      page: Int!,
      pageSize: Int!,
      orderBy: String!,
      ascOrDesc: String!,
      search: String
    ): PaginatedCountries
    getUserRatingForCountry(countryId: ID!): Rating
    getCommentsByCountryId(countryId: ID!): [Comment]
    getCommentById(id: ID!): Comment
    getPastTravelsByCurrentUser: MapTravel!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!, address: String, countryId: ID): User
    updateUser(id: ID!, name: String!, email: String!, address: String, countryId: ID): User
    markCountryAsVisited(countryId: ID!): Boolean
    login(email: String!, password: String!): AuthPayload
    createTravel(
      countryId: ID!,
      startDate: String!,
      endDate: String!,
      imageUrl: String,
      description: String
    ): Travel
    updateTravel(
      travelId: ID!,
      startDate: String!,
      endDate: String!,
      imageUrl: String,
      description: String
    ): Travel
    upsertRating(countryId: ID!, ratingValue: Int!): Float
    createComment(countryId: ID!, text: String!): Comment
    updateComment(id: ID!, text: String!): Comment
    deleteComment(id: ID!): Boolean
  }
`);

export default schema;
