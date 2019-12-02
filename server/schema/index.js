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
    addReplyToComment(replyInput: replyInput): Comments!
    addReplyToReply(replyInput: replyToReplyInput): Comments!
    followUser(followInput: followUser): User
    unfollowUser(followInput: followUser): User
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
    isVerified: Boolean
    profile: Profile
    createdAt: String
    updatedAt: String
  }

  type Profile {
    _id: ID
    avatar: String
    bio: String
    owner: ID!
    followers: [User]
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
    article: ID
    body: String!
    author: ID
    replies: [Replies]
    createdAt: String
    updatedAt: String
  }

  type Replies {
    _id: ID
    comment: ID
    author: ID
    article: ID
    replies: [Replies]
    body: String
    createdAt: String
  }

  type meta {
    votes: Int
    favs: Int
  }

  input followUser {
    token: String!
    userId: ID!
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
    commentId : ID
    articleId: ID
  }

  input replyToReplyInput {
    replyBody: String
    token: String
    replyId : ID
    articleId: ID
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
