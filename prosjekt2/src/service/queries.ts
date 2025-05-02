import { gql } from '@apollo/client';

// Countries Queries
export const GET_COUNTRIES = gql`
  query GetCountries(
    $page: Int!
    $pageSize: Int!
    $orderBy: String!
    $search: String
    $ascOrDesc: String!
  ) {
    getCountriesPaginated(
      page: $page
      pageSize: $pageSize
      orderBy: $orderBy
      search: $search
      ascOrDesc: $ascOrDesc
    ) {
      totalPages
      countries {
        id
        country_name
        cca3
        capital
        image_url
        average_rating
      }
    }
  }
`;

export const GET_COUNTRY_BY_CCA3 = gql`
  query GetCountryByCca3($cca3: String!) {
    getCountryByCca3(cca3: $cca3) {
      id
      country_name
      cca3
      population
      official_language
      currency
      continent
      image_url
      average_rating
    }
  }
`;

// User Queries
export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    getCurrentUser {
      id
      name
      email
      address
      travel_days
      num_travels
      num_countries_visited
      country {
        id
        cca3
        country_name
      }
    }
  }
`;

export const CHECK_AUTH = gql`
  query CheckAuth {
    getCurrentUser {
      id
      name
      email
      country {
        country_name
        cca3
      }
    }
  }
`;

// Travel Queries
export const GET_TRAVELS_FROM_CURRENT_USER = gql`
  query GetTravelsFromCurrentUser {
    getTravelsByCurrentUser {
      id
      start_date
      end_date
      image_url
      description
      country {
        country_name
        image_url
      }
    }
  }
`;

export const GET_PAST_TRAVELS_FROM_CURRENT_USER = gql`
  query GetPastTravelsFromCurrentUser {
    getPastTravelsByCurrentUser {
      past_travels {
        id
        country {
          cca3
        }
      }
      active_travel {
        id
        country {
          cca3
        }
      }
    }
  }
`;

export const GET_TRAVEL_BY_ID = gql`
  query GetTravelById($id: ID!) {
    getTravelById(id: $id) {
      id
      start_date
      end_date
      image_url
      description
      country {
        country_name
        image_url
      }
    }
  }
`;

// Map Queries
export const GET_MAP_BY_ID = gql`
  query GetMapById($id: ID!) {
    getMapById(id: $id) {
      id
      map_name
      geojson_data
      created_at
      country_id
    }
  }
`;

// Ratings Queries
export const GET_USER_RATING_FOR_COUNTRY = gql`
  query GetUserRatingForCountry($countryId: ID!) {
    getUserRatingForCountry(countryId: $countryId) {
      rating_value
    }
  }
`;

// Comments Queries
export const GET_COMMENTS_BY_COUNTRY_ID = gql`
  query GetCommentsByCountryId($countryId: ID!) {
    getCommentsByCountryId(countryId: $countryId) {
      id
      user_id
      country_id
      text
      created_at
      user {
        id
        name
      }
      editable
    }
  }
`;
