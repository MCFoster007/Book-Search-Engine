import { gql } from '@apollo/client';

export const QUERY_USER = gql`
query Users {
  users {
    _id
    username
    email
    bookCount
  }
}
`;

export const QUERY_USERNAME = gql`
query User($username: String) {
  user(username: $username) {
    _id
    username
    email
    bookCount
  }
}
`;


export const QUERY_ME = gql`
query Me {
  me {
    _id
    username
    email
    bookCount
  }
}
`;