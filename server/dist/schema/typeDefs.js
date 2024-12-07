import { gql } from 'graphql-tag';
const typeDefs = gql `
  # Types
  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  type Auth {
    token: String!
    user: User!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [Book]
  }

  # Input Types
  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }

  input SaveBookInput {
    bookId: ID!
    title: String!
    authors: [String]
    description: String
    image: String
    link: String
  }

  # Queries
  type Query {
    users: [User]
    user(username: String): User
    me: User
  }

  # Mutations
  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: SaveBookInput!): User
    removeBook(bookId: ID!): User
  }
`;
export default typeDefs;
