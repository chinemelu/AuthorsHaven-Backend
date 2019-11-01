import { buildSchema } from 'graphql';


const schema = buildSchema(`
  type Mutation {
    signupUser(userSignupInput: UserInput, 
    userProfileInput: UserProfileInput): User!
    sendResetPasswordEmail(email: String!): String
    resetUserPassword(password: String!, token: String! ): User!
  }

  type Query {
    User(userQuery: UserInput): User
  }

  type Password {
    token: String!
    password: String
  }

  type User {
    _id: ID!
    token: String!
    username: String!
    firstname: String
    lastname: String
    email: String!
    password: String
    isVerified: Boolean
    bio: String
    avatar: String
    createdAt: String
    updatedAt: String
  }

  input UserInput {
    username: String!
    firstname: String!
    lastname: String!
    email: String!
    password: String!
  }

  input UserProfileInput {
    bio: String
    avatar: String
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);

export default schema;
