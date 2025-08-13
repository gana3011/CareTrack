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
  
  type Shift{
    id: ID!
    workerId: Int
    date: String
    clock_in: String
    clock_out: String
  }

  type SuccessResponse {
    success: Boolean!
    shift: Shift
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    userByUserId(userId: String!): User
  }

  type Mutation {
    syncUser(
      userId: String!
      name: String!
      email: String!
      picture: String
      roles: [String!]
      created_at: String
    ): User!
    updateUser(id: ID!, name: String, email: String, roles: [String!]): User!
    deleteUser(id: ID!): Boolean!
    addGeofence(name: String!, center: PointInput!, radiusMeters: Float!): SuccessResponse
    clockIn(userLocation: PointInput!, date: String!): SuccessResponse
    clockOut(userLocation: PointInput!, date: String!): SuccessResponse
  }
`;

async function checkIfInside(userLocation){
  try{
    const geofence = await prisma.$queryRaw`
        SELECT EXISTS(
        SELECT 1
        FROM "Geofence"
        WHERE ST_DWithin(
          center,
          ST_SetSRID(ST_MakePoint(${userLocation.lng}, ${userLocation.lat}), 4326)::geography,
          radius_meters
        )
      ) AS "exists";
        `
        if(!geofence[0]?.exists){
          return false;
        }
        else return true;
  }catch(err){
    console.error(err);
    throw new Error(err.message);
  }
}


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
    }
  },

  Mutation: {
    syncUser: async (_, { userId, name, email, picture, roles, created_at }) => {
      // Check if user already exists
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

    addGeofence: async (_, { name, center, radiusMeters }) => {
      try {
        const cookieStore = await cookies();
        let userId = JSON.parse(cookieStore.get('userId')?.value || null);
    const roles = JSON.parse(cookieStore.get('roles')?.value || '[]');

        console.log('userId in graphql ', userId);
        console.log('roles in graphql ', roles);

        if (!roles.includes('manager')) {
          throw new Error('Not authorized to add geofence');
        }

        let geo;
        const user = await prisma.user.findUnique({
          where: { userId },
          select: {
            id: true
          }
        });
        const id = user.id;
        let manager = await prisma.geofence.findFirst({
          where: { managerId: id }
        });

        if (manager) {
          geo = await prisma.$executeRaw`
        UPDATE "Geofence"
        SET center = ST_SetSRID(ST_MakePoint(${center.lng}, ${center.lat}), 4326)::geography,
        radius_meters = ${radiusMeters},
        "updated_at" = NOW()
        WHERE "managerId" = ${id}
      `;
        } else {
          geo = await prisma.$executeRaw`
        INSERT INTO "Geofence" (name, "managerId", center, radius_meters,updated_at)
        VALUES (
          ${name},
          ${id},
          ST_SetSRID(ST_MakePoint(${center.lng}, ${center.lat}), 4326)::geography,
          ${radiusMeters},
          now()
        )
      `;
      console.log(geo);
        }

        return { success: true };
      } catch (err) {
        console.error(err);
        throw new Error(err.message);
      }
    },

    clockIn: async(_, {userLocation, date}) => {
      try{
      const cookieStore = await cookies();
        let userId = JSON.parse(cookieStore.get('userId')?.value || null);
    const roles = JSON.parse(cookieStore.get('roles')?.value || '[]');

      if(!roles.includes("worker")) throw new Error('Not authorized to clock in');
      
      console.log(userLocation);

      const user = await prisma.user.findUnique({
          where: { userId },
          select: {
            id: true
          }
        });

      const id = user.id;

      const isInside = await checkIfInside(userLocation);
      if(!isInside){
        return {success: false}
      }
      
      let shift = await prisma.shift.create({
        data:{
          workerId: id,
          date: date,
          clock_in: new Date(),
        }
      })
      return {success: true, shift}  
      }
      catch(err){
        console.error(err);
        throw new Error(err.message);
      }
    },

    clockOut: async(_, {userLocation, date}) => {
      try{
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

      if(!roles.includes("worker")) throw new Error('Not authorized to clock in');
      
      console.log(userLocation);

      const user = await prisma.user.findUnique({
          where: { userId},
          select: {
            id: true
          }
        });

      const id = user.id;

      const isInside = await checkIfInside(userLocation);
      if(!isInside){
        return {success: false}
      }

      const openShift = await prisma.shift.findFirst({
      where: {
        workerId: id,
        date:date,
        clock_out: null
      }
    });

    if(!openShift) throw new Error("Not clocked out");
      
      let shift = await prisma.shift.update({
        where:{id: openShift.id},
        data:{
          clock_out: new Date()
        }
      });

      return {success: true, shift}  
      }
      catch(err){
        console.error(err);
        throw new Error(err.message);
      }
    },
  }
};

//Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      code: error.extensions?.code,
      path: error.path
    };
  }
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({ req, res })
});

export { handler as GET, handler as POST };
