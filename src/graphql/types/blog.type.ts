export const blogType = `type Blog {
  id: ID!
  title: String!
  slug: String!
  body: String!
  coverImage: String!
  featured: Boolean!
  author: User!
  comments: [Comment!]!
  likes: [User!]!
  dislikes: [User!]!
  topics: [Topic!]!
  createdAt: String!
  updatedAt: String!
}`;

export const commentType = `type Comment {
  id: ID!
  body: String!
  user: User!
  blog: Blog!
  likedBy: [User!]!
  dislikedBy: [User!]!
  createdAt: String!
  updatedAt: String!
}

input CreateBlogInput {
  title: String!
  slug: String!
  body: String!
  coverImage: String
  featured: Boolean
  authorId: ID!
  topicIds: [ID!]
}


`;
