export const authType = `
  type User {
    id: ID!
    username: String!
  }

  type AuthPayload {
    token: String
    user: User
  }
`;

`type Mutation {
    register(email:String!,name:String!,userName: String!, password: String!): User
    login(identifier: String!, password: String!): AuthPayload
  }`;
