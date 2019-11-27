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
    addComment(commentInput: commentInput): Comments!
    addReply(replyInput: replyInput): Comments!
  }

  type Query {
    User(userQuery: UserInput): User
    readArticle(id: ID!): Article
    getUserProfile(username: String!): User
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
    createdAt: String
    updatedAt: String
    comments: [Comments!]!
    meta: meta
  }

  type Comments {
    _id: ID
    articleId: ID
    body: String!
    author: ID
    replies: [Replies]
    createdAt: String
    updatedAt: String
  }

  type Replies {
    _id: ID
    commentId: ID
    author: ID
    body: String
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

  input commentInput {
    commentBody: String
    token: String
    articleId: ID
  }

  input replyInput {
    replyBody: String
    token: String
    commentId: ID
  }

  input UpdateArticleInput {
    _id: ID
    token: String!
    title: String!
    body: String!
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
