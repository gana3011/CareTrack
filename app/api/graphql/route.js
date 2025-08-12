import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { PrismaClient } from '../../../lib/generated/prisma';
import { gql } from 'graphql-tag';
import { cookies } from 'next/headers';

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
  
  input PointInput {
  lat: Float!
  lng: Float!
}

  type SuccessResponse {
  success: Boolean!
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
    addGeofence(name: String!, center: PointInput!, radiusMeters:Float!): SuccessResponse
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
      console.log('in grapphql');
      try {
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
      } catch (err) {
        throw new Error(err.message);
      }
      
    },
    // updateUser: async (_, { id, name, email, roles }) => {
    //   const updateData = {};
    //   if (name !== undefined) updateData.name = name;
    //   if (email !== undefined) updateData.email = email;
    //   if (roles !== undefined) updateData.roles = roles;
      
    //   return await prisma.user.update({
    //     where: { id: parseInt(id) },
    //     data: updateData
    //   });
    // },

    addGeofence: async (_, { name, center, radiusMeters },context) => {
  try {
    const cookieStore = await cookies();
    let userId = cookieStore.get('userId')?.value || null;
    userId = JSON.parse(userId);
    const rolesString = cookieStore.get('roles')?.value || '[]';
    let roles;
    try {
      roles = JSON.parse(rolesString);
    } catch {
      roles = [];
    }

    console.log("userId in graphql ", userId);
    console.log("roles in graphql ", roles);

    if (!roles.includes("manager")) {
      throw new Error("Not authorized to add geofence");
    }

    let geo;
    const user = await prisma.user.findUnique({
      where: {userId}, select:{
        id: true,
      }
    })
    const id = user.id;
    console.log('id in graphql', id);
    let manager = await prisma.geofence.findFirst({ 
      where: { managerId: id } 
    });

    if (manager) {
      geo = await prisma.$executeRaw`
        UPDATE "Geofence"
        SET center = ST_SetSRID(ST_MakePoint(${center.lng}, ${center.lat}), 4326)::geography,
        radius_meters = ${radiusMeters}
        WHERE "managerId" = ${id}
      `;
    } else {
      geo = await prisma.$executeRaw`
        INSERT INTO "Geofence" (name, "managerId", center, radius_meters)
        VALUES (
          ${name},
          ${id},
          ST_SetSRID(ST_MakePoint(${center.lng}, ${center.lat}), 4326)::geography,
          ${radiusMeters}
        )
      `;
    }

    return { success: true };

  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
}
}
}

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

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({ req, res }),
});

export { handler as GET, handler as POST };


