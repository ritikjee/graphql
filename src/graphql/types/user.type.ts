export const userType = `type User {
  id: ID!
  name: String!
  userName: String!
  email: String!
  profileImage: String!
  coverImage: String!
  bio: String!
  blogs: [Blog!]!
  followers: [User!]!
  following: [User!]!
  comments: [Comment!]!
  likedBlogs: [Blog!]!
  dislikedBlogs: [Blog!]!
  likedComments: [Comment!]!
  dislikedComments: [Comment!]!
  topicsFollowed: [Topic!]!
  createdAt: String!
  updatedAt: String!
}
`;
