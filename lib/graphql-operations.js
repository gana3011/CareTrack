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

export const FETCH_USER_SHIFTS_BY_WEEK = gql`
  query FetchUserShiftsByWeek($date: String!){
  fetchUserShiftsByWeek(date:$date){
    date,
    clock_in,
    clock_out
  }
  }
`;

export const FETCH_ACTIVE_SHIFTS = gql`
  query FetchActiveShifts($date: String!){
  fetchActiveShifts(date: $date){
  id,
  clock_in,
  clock_out,
  user{
  name,
  id
  }
  }
  }
`;

// export const TOTAL_HOURS_PER_STAFF = gql`
//   query TotalHoursPerStaff($date: String!){
//   totalHoursPerStaff(date:$date){
//   name,
//   total_hours
//   }
//   }
// `;

// export const PEOPLE_CLOCKINGIN_PER_DAY = gql`
// query PeopleClockInPerDay($date:String!){
// peopleClockInPerDay(date:$date){
// date,
// people_count
// }
// }
// `

// export const AVG_HOURS_PER_DAY = gql`
// query AvgHoursPerDay($date:String!){
// avgHoursPerDay(date:$date){
// date,
// people_count
// }
// }
// `

export const FETCH_DASHBOARD_STATS = gql`
query FetchDashboardStats($date: String!){
avgHoursPerDay(date:$date){
date, avg_hours
}
peopleClockingInPerDay(date:$date){
date, people_count
}
totalHoursPerStaff(date:$date){
name, total_hours
}
}
`

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
  success,
  message
  }
}
`;

export const CLOCK_IN = gql`
  mutation ClockIn($userLocation: PointInput!,$date: String!){
  clockIn(userLocation:$userLocation, date: $date){
  success
  }
  }
`

export const CLOCK_OUT = gql`
  mutation ClockOut($userLocation: PointInput!,$date: String!){
  clockOut(userLocation:$userLocation, date: $date){
  success
  }
  }
`