import { buildSchema } from 'graphql';


const schema = buildSchema(`
  type Mutation {
    signupUser(userSignupInput: UserInput, 
    userProfileInput: UserProfileInput): User!
    sendResetPasswordEmail(email: String!): String
    resetUserPassword(password: String!, token: String! ): User
    loginUser(usernameOrEmail: String!, password: String!): User!
    createArticle(articleInput: ArticleInput): Article!
    publishArticle(updateArticleInput: UpdateArticleInput): Article
    saveArticle(updateArticleInput: UpdateArticleInput): Article
    deleteArticle(deleteArticleInput: DeleteArticleInput): Article
    addComment(commentInput: commentInput): Comments!
    addReplyToComment(replyBody: String, token: String, commentId:ID
      articleId: ID): Comments!
    addReplyToReply(replyBody: String, token: String, replyId:ID, 
      articleId: ID): Comments!
    followUser(token: String!, userId: ID!): User
    unfollowUser(token: String!, userId: ID!): User
    createBookmark(token: String!, articleId: String!): Article
    deleteBookmark(token: String!, articleId: String!): Article
    createRating(ratingInput: ratingInput): Rating
    addLikeToArticle(token: String!, articleId: String!): Like
    unlikeArticle(token: String!, articleId: String!): Like
    reportArticle(reportInput: reportInput): Report
    likeComment(token: String, commentId: ID, articleId: ID): Comments
    unlikeReply(token: String, articleId: ID, replyId: ID): Replies
    unlikeComment(token: String, commentId: ID, articleId: ID): Comments
    likeReply(token: String, articleId: ID, replyId: ID): Replies
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
    username: String
    firstname: String
    lastname: String
    email: String
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
    bookmarks: [Article]
  }

  type Article {
    _id: ID
    title: String
    body: String
    author: User
    images: [String]
    ratings: [Rating]
    likes: [Like]
    createdAt: String
    updatedAt: String
    reports: [Report]
    comments: [Comments!]!
    meta: meta
    isDraft: Boolean
  }

  type Comments {
    _id: ID
    article: ID
    body: String!
    author: ID
    meta: meta
    likes: [Like]
    replies: [Replies]
    createdAt: String
    updatedAt: String
  }

  type Replies {
    _id: ID
    comment: ID
    author: ID
    article: ID
    likes: [Like]
    replies: [Replies]
    body: String
    meta: meta
    createdAt: String
  }

  type meta {
    likes: Int
    timeToRead: Float
  }

  type Rating {
    _id: ID
    reviewer: User
    rating: Float
    article: ID
  }

  type Like {
    _id: ID
    reviewer: User
    article: ID
  }

  type Report {
    _id: ID
    reporter: User
    article: Article
    reportType: String
  }

  input reportInput {
    token: String!
    articleId: String! 
    reportType: String
  }

  input ratingInput {
    token: String!
    articleId: String!
    rating: Float
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
