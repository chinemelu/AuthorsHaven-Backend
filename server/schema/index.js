import { buildSchema } from 'graphql';


const schema = buildSchema(`
  type Mutation {
    signupUser(userSignupInput: UserInput): User
  }

  type Query {
    User(userQuery: UserInput): User
  }

  type User {
    _id: ID!
    username: String!
    firstname: String
    lastname: String
    email: String!
    password: String
    createdAt: String
    updatedAt: String
  }

  input UserInput {
    username: String!
    firstname: String!
    lastname: String!
    email: String!
    password: String!
    createdAt: String
    updatedAt: String
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);

export default schema;
