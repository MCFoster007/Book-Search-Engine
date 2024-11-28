import { gql } from 'graphql-tag';
const typeDefs = gql `
  # Types
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Role {
    name: String!
  }

  type User {
    id: ID!
    name: String!
    age: Int!
    isAuthor: Boolean
    role: String!
    savedBooks: [Book] # Relation: A user can save books
  }

  # Input Types
  input CreateUserInput {
    name: String!
    age: Int!
    isAuthor: Boolean
    role: String!
  }

  input UpdateUserInput {
    id: ID!
    name: String
    age: Int
    isAuthor: Boolean
    role: String
  }

  input DeleteUserInput {
    id: ID!
  }

  input SaveBookInput {
    id: ID!
    title: String!
    author: String!
  }

  # Queries
  type Query {
    books: [Book]                     # Fetch all books
    returnBook: Book                  # Return a single book
    user(id: ID!): User!              # Fetch a user by ID
    userByName(name: String!): User!  # Fetch a user by name
  }

  # Mutations
  type Mutation {
    createUser(newUser: CreateUserInput!): User       # Create a new user
    updateUser(updatedUser: UpdateUserInput!): User  # Update an existing user
    deleteUser(delUser: DeleteUserInput!): User      # Delete a user
    saveBook(userId: ID!, book: SaveBookInput!): User # Save a book for a user
  }
`;
export default typeDefs;
