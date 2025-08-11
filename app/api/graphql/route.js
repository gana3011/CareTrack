import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { PrismaClient } from '../../../lib/generated/prisma';
import { gql } from 'graphql-tag';

const prisma = new PrismaClient();

const typeDefs = gql`
  type User {
    id: ID!
    userId: String!
    name: String!
    email: String!
    picture: String
    roles: [String!]!
    created_at: String!
    updated_at: String!
    last_login: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    userByUserId(userId: String!): User
  }

  type Mutation {
    syncUser(userId: String!, name: String!, email: String!, picture: String, roles: [String!], created_at: String): User!
    updateUser(id: ID!, name: String, email: String, roles: [String!]): User!
    deleteUser(id: ID!): Boolean!
  }
`;


// Define your resolvers
export const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
    user: async (_, { id }) => {
      return await prisma.user.findUnique({ 
        where: { id: parseInt(id) } 
      });
    },
    userByUserId: async (_, { userId }) => {
      return await prisma.user.findUnique({ 
        where: { userId } 
      });
    },
  },
  Mutation: {
    syncUser: async (_, { userId, name, email, picture, roles, created_at }) => {
      // Check if user already exists
      let user = await prisma.user.findUnique({ 
        where: { userId } 
      });
 
      if (user) {
        // Update existing user
        user = await prisma.user.update({
          where: { userId },
          data: {
            name,
            email,
            roles: roles || user.roles,
            picture: picture || user.picture,
            updated_at: new Date(),
            last_login: new Date()
          }
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            userId, 
            name, 
            email, 
            picture: picture || null,
            roles: roles || [],
            created_at: created_at ? new Date(created_at) : new Date(),
            last_login: new Date()
          }
        });
      }

      return user;
    },
    updateUser: async (_, { id, name, email, roles }) => {
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (roles !== undefined) updateData.roles = roles;
      
      return await prisma.user.update({
        where: { id: parseInt(id) },
        data: updateData
      });
    },
    deleteUser: async (_, { id }) => {
      try {
        await prisma.user.delete({
          where: { id: parseInt(id) }
        });
        return true;
      } catch (error) {
        return false;
      }
    },
  },
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      code: error.extensions?.code,
      path: error.path,
    };
  },
});

// Create the handler
const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({ req, res }),
});

export { handler as GET, handler as POST };
