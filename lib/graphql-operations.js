import { gql } from '@apollo/client';

// Queries
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      userId
      name
      email
      roles
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      userId
      name
      email
      roles
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_BY_USER_ID = gql`
  query GetUserByUserId($userId: String!) {
    userByUserId(userId: $userId) {
      id
      userId
      name
      email
      roles
      createdAt
      updatedAt
    }
  }
`;

// Mutations
export const SYNC_USER = gql`
  mutation SyncUser($userId: String!, $name: String!, $email: String!, $picture: String, $roles: [String!]) {
    syncUser(userId: $userId, name: $name, email: $email, picture: $picture, roles: $roles) {
      id
      userId
      name
      email
      picture
      roles
      created_at
      updated_at
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String!, $roles: [String!]) {
    updateUser(id: $id, name: $name, email: $email, roles: $roles) {
      id
      userId
      name
      email
      roles
      created_at
      updated_at
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const ADD_GEOFENCE = gql`
  mutation AddGeofence($name: String!, $center: PointInput! , $radiusMeters: Float! ){
  addGeofence(name:$name, center:$center, radiusMeters:$radiusMeters){
  success
  }
}
`;

export const ADD_LOCATION = gql`
  mutation AddLocation($userLocation: PointInput!){
  addLocation(userLocation:$userLocation){
  success
  }
  }
`