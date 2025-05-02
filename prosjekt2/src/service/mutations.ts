import { gql } from '@apollo/client';

// User Mutations
export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        country {
          country_name
        }
      }
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation SIGNUP_USER(
    $name: String!
    $email: String!
    $password: String!
    $address: String
    $countryId: ID
  ) {
    createUser(
      name: $name
      email: $email
      password: $password
      address: $address
      countryId: $countryId
    ) {
      id
      name
      email
      address
      country {
        id
        country_name
      }
    }
  }
`;

// Travel Mutations
export const CREATE_TRAVEL = gql`
  mutation CreateTravel(
    $countryId: ID!
    $startDate: String!
    $endDate: String!
    $imageUrl: String
    $description: String
  ) {
    createTravel(
      countryId: $countryId
      startDate: $startDate
      endDate: $endDate
      imageUrl: $imageUrl
      description: $description
    ) {
      id
      user_id
      country_destination
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

export const UPDATE_TRAVEL = gql`
  mutation UpdateTravel(
    $id: ID!
    $startDate: String!
    $endDate: String!
    $imageUrl: String
    $description: String
  ) {
    updateTravel(
      travelId: $id
      startDate: $startDate
      endDate: $endDate
      imageUrl: $imageUrl
      description: $description
    ) {
      id
      start_date
      end_date
      image_url
      description
    }
  }
`;
export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $name: String!
    $email: String!
    $address: String
    $countryId: ID
  ) {
    updateUser(
      id: $id
      name: $name
      email: $email
      address: $address
      countryId: $countryId
    ) {
      id
      name
      email
      address
      country_id
    }
  }
`;

// Ratings Mutations
export const UPSERT_RATING = gql`
  mutation UpsertRating($countryId: ID!, $ratingValue: Int!) {
    upsertRating(countryId: $countryId, ratingValue: $ratingValue)
  }
`;

// Comments Mutations
export const CREATE_COMMENT = gql`
  mutation CreateComment($countryId: ID!, $text: String!) {
    createComment(countryId: $countryId, text: $text) {
      id
      user_id
      country_id
      text
      created_at
      user {
        id
        name
      }
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: ID!, $text: String!) {
    updateComment(id: $id, text: $text) {
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

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;
