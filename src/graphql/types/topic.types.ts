export const topicType = `type Topic {
  id: ID!
  name: String!
  description: String
  coverImage: String!
  blogs: [Blog!]!
  followers: [User!]!
  createdAt: String!
  updatedAt: String!
}`;
