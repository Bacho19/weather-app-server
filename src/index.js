const { ApolloServer, gql } = require("apollo-server");
const md5 = require("md5");
require("dotenv").config();

const typeDefs = gql`
  type User {
    username: String
    email: String
    password: String
  }

  type UserData {
    username: String
    email: String
  }

  input UserInput {
    username: String
    email: String!
    password: String!
  }

  type Mutation {
    createUser(input: UserInput): User
    loginUser(user: UserInput): User
  }

  type Query {
    users: [UserData]
  }
`;

const users = [
  {
    username: "user",
    email: "user@gmail.com",
    password: "ee11cbb19052e40b07aac0ca060c23ee",
  },
  {
    username: "user2",
    email: "user2@gmail.com",
    password: "ee11cbb19052e40b07aac0ca060c23ee",
  },
  {
    username: "test3",
    email: "user2@gmail.com",
    password: "ee11cbb19052e40b07aac0ca060c23ee",
  },
];

const resolvers = {
  Query: {
    users: () => users,
  },
  Mutation: {
    createUser: (_, { input }) => {
      users.push(input);
      return {
        username: input.username,
        email: input.email,
      };
    },
    loginUser: (_, { user }) => {
      const candidateUser = users.find((item) => item.email === user.email);
      if (candidateUser) {
        if (candidateUser.password === md5(user.password)) {
          return {
            username: candidateUser.username,
            email: candidateUser.email,
            password: candidateUser.password,
          };
        }
      }
      new Error("Invalid email or password");
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const PORT = process.env.PORT;

server
  .listen({
    port: PORT,
  })
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
