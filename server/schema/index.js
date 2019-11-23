import { buildSchema } from 'graphql';


const schema = buildSchema(`
  type Mutation {
    signupUser(userSignupInput: UserInput, 
    userProfileInput: UserProfileInput): User!
    sendResetPasswordEmail(email: String!): String
    resetUserPassword(password: String!, token: String! ): User
    loginUser(usernameOrEmail: String!, password: String!): User!
    createArticle(articleInput: ArticleInput): Article!
    updateArticle(articleInput: UpdateArticleInput): Article
    deleteArticle(articleInput: DeleteArticleInput): Article
  }

  type Query {
    User(userQuery: UserInput): User
    readArticle(id: ID!): Article
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

  type Article {
    _id: ID
    title: String
    body: String
    author: String
    images: [String]
    comments: [String]
    meta: meta
  }

  type meta {
    votes: Int
    favs: Int
  }

  input ArticleInput {
    title: String
    token: String
    body: String
  }

  input UpdateArticleInput {
    _id: ID
    token: String!
    title: String
    body: String
    images: [String]
  }

  input DeleteArticleInput {
    _id: ID!
    token: String
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
