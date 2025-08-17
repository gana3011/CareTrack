import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { PrismaClient } from '../../../lib/generated/prisma';
import { gql } from 'graphql-tag';
import { cookies } from 'next/headers';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import { message } from 'antd';

dayjs.extend(weekday);

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

  type Shift {
    id: ID!
    workerId: Int!
    date: String!
    clock_in: String!
    clock_out: String
    clock_in_location: String!
    clock_out_location: String
    clock_in_note: String
    clock_out_note: String
    user: User
  }

  type SuccessResponse {
    success: Boolean!
    message: String
    shift: Shift
    location: String
  }

  type DailyAverageHours {
    date: String
    avg_hours: Float
  }

  type DailyPeopleCount {
    date: String
    people_count: Int
  }

  type StaffTotalHours {
    name: String
    total_hours: Float
  }

  type Query {
    fetchUserShiftsByWeek(date: String!): [Shift]!
    fetchActiveShifts(date: String!): [Shift]!
    fetchShiftHistory(date: String!): [Shift]!
    totalHoursPerStaff(date: String!): [StaffTotalHours]!
    peopleClockingInPerDay(date: String!): [DailyPeopleCount]!
    avgHoursPerDay(date: String!): [DailyAverageHours]!
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
    deleteUser(id: ID!): Boolean!
    addGeofence(name: String!, center: PointInput!, radiusMeters: Float!): SuccessResponse
    clockIn(userLocation: PointInput!, date: String!, clock_in_note: String): SuccessResponse
    clockOut(userLocation: PointInput!, date: String!, clock_out_note: String): SuccessResponse
  }
`;

async function checkIfInside(userLocation) {
  try {
    const geofence = await prisma.$queryRaw`
        SELECT "id", "name"
      FROM "Geofence"
      WHERE ST_DWithin(
        center,
        ST_SetSRID(ST_MakePoint(${userLocation.lng}, ${userLocation.lat}), 4326)::geography,
        radius_meters
      )
      LIMIT 1
      ;
        `;
    return geofence;
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
}

export const resolvers = {
  Query: {
    fetchUserShiftsByWeek: async (_, { date }) => {
      try {
        const cookieStore = await cookies();
        let userId = JSON.parse(cookieStore.get('userId')?.value || null);
        if (!userId) {
          throw new Error('User not authenticated');
        }
        const user = await prisma.user.findUnique({
          where: { userId },
          select: {
            id: true
          }
        });
        const id = user.id;
        let startOfWeek = dayjs(date).startOf('week').add(1, 'day').startOf('day');

        //if sunday get previous monday
        if (dayjs(date).day() === 0) {
          startOfWeek = dayjs(date).subtract(6, 'day').startOf('day');
        }
        const endOfWeek = startOfWeek.add(6, 'day').endOf('day');
        const shifts = await prisma.shift.findMany({
          where: {
            workerId: id,
            date: {
              gte: startOfWeek.toISOString(),
              lte: endOfWeek.toISOString()
            }
          }
        });
        //formatting
        return shifts.map(s => ({
          ...s,
          date: s.date ? dayjs(s.date).format('DD-MM-YY') : null,
          clock_in: s.clock_in ? dayjs(s.clock_in).format('HH:mm:ss') : null,
          clock_out: s.clock_out ? dayjs(s.clock_out).format('HH:mm:ss') : null
        }));
      } catch (err) {
        throw new Error(err.message);
      }
    },

    fetchActiveShifts: async (_, { date }) => {
      try {
        const cookieStore = await cookies();
        const roles = JSON.parse(cookieStore.get('roles')?.value || '[]');

        if (!roles.includes('manager')) {
          throw new Error('Not authorized to add geofence');
        }

        const shifts = await prisma.shift.findMany({
          where: {
            date: new Date(date),
            clock_out: null
          },
          select: {
            id: true,
            clock_in: true,
            clock_in_location: true,
            clock_in_note: true,
            worker: {
              select: {
                name: true,
                id: true
              }
            }
          }
        });

        return shifts.map(s => ({
          ...s,
          id: s.id,
          clock_in: s.clock_in ? dayjs(s.clock_in).format('HH:mm:ss') : null,
          clock_in_location: s.clock_in_location,
          clock_in_note: s?.clock_in_note,
          user: s.worker
        }));
      } catch (err) {
        throw new Error(err.message);
      }
    },

    fetchShiftHistory: async (_, { date }) => {
      try {
        const cookieStore = await cookies();
        const roles = JSON.parse(cookieStore.get('roles')?.value || '[]');

        if (!roles.includes('manager')) {
          throw new Error('Not authorized to add geofence');
        }

        const shifts = await prisma.shift.findMany({
          where: {
            date: new Date(date),
            clock_out: { not: null }
          },
          select: {
            id: true,
            clock_in: true,
            clock_in_location: true,
            clock_out: true,
            clock_out_location: true,
            clock_in_note: true,
            clock_out_note: true,
            worker: {
              select: {
                name: true,
                id: true
              }
            }
          }
        });

        return shifts.map(s => ({
          ...s,
          id: s.id,
          clock_in: s.clock_in ? dayjs(s.clock_in).format('HH:mm:ss') : null,
          clock_in_location: s.clock_in_location,
          clock_out: s.clock_out ? dayjs(s.clock_out).format('HH:mm:ss') : null,
          clock_out_location: s.clock_out_location,
          clock_in_note: s?.clock_in_note,
          clock_out_note: s?.clock_out_note,
          user: s.worker
        }));
      } catch (err) {
        throw new Error(err.message);
      }
    },

    avgHoursPerDay: async (_, { date }) => {
      let startOfWeek = dayjs(date).startOf('week').add(1, 'day').startOf('day');

      if (dayjs(date).day() === 0) {
        startOfWeek = dayjs(date).subtract(6, 'day').startOf('day');
      }
      const endOfWeek = startOfWeek.add(6, 'day').endOf('day');
      const avgHoursPerDay = await prisma.$queryRaw`
      SELECT "date",
      AVG(EXTRACT(EPOCH FROM ("clock_out"-"clock_in"))/3600) as avg_hours
      FROM "Shift"
      WHERE "clock_out" IS NOT NULL and 
      ("date">=${startOfWeek.toDate()} AND "date"<=${endOfWeek.toDate()})
      GROUP BY "date"
      ORDER BY "date"
      `;
      return avgHoursPerDay.map(avg => ({
        ...avg,
        date: dayjs(avg.date).format('DD-MM-YY'),
        avg_hours: avg.avg_hours
      }));
    },

    peopleClockingInPerDay: async (_, { date }) => {
      let startOfWeek = dayjs(date).startOf('week').add(1, 'day').startOf('day');

      if (dayjs(date).day() === 0) {
        startOfWeek = dayjs(date).subtract(6, 'day').startOf('day');
      }
      const endOfWeek = startOfWeek.add(6, 'day').endOf('day');

      const noOfPeople = await prisma.$queryRaw`
      SELECT "date",
      COUNT(DISTINCT "workerId") AS people_count
      FROM "Shift"
      WHERE "clock_in" IS NOT NULL
      AND "date" >= ${startOfWeek.toDate()}
      AND "date" <= ${endOfWeek.toDate()}
      GROUP BY "date"
      ORDER BY "date";
      `;
      return noOfPeople.map(no => ({
        ...no,
        date: dayjs(no.date).format('DD-MM-YYYY'),
        people_count: Number(no.people_count)
      }));
    },

    totalHoursPerStaff: async (_, { date }) => {
      let startOfWeek = dayjs(date).startOf('week').add(1, 'day').startOf('day');

      if (dayjs(date).day() === 0) {
        startOfWeek = dayjs(date).subtract(6, 'day').startOf('day');
      }
      const endOfWeek = startOfWeek.add(6, 'day').endOf('day');

      const totalHours = await prisma.$queryRaw`
      SELECT u."name",
      SUM(EXTRACT(EPOCH FROM (s."clock_out" - s."clock_in")) / 3600) AS total_hours
      FROM "Shift" AS s JOIN "User" AS u 
      ON s."workerId" = u.id
      WHERE s."clock_out" IS NOT NULL
      AND s."date" >= ${startOfWeek.toDate()}
      AND s."date" <= ${endOfWeek.toDate()}
      GROUP BY u."name"
      ORDER BY total_hours DESC;
  `;
      return totalHours;
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

    addGeofence: async (_, { name, center, radiusMeters }) => {
      try {
        const cookieStore = await cookies();
        let userId = JSON.parse(cookieStore.get('userId')?.value || null);
        const roles = JSON.parse(cookieStore.get('roles')?.value || '[]');

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
        let existing = await prisma.geofence.findUnique({
          where: {
            name_managerId: {
              name,
              managerId: id
            }
          }
        });

        if (existing) {
          return {
            success: false,
            message: 'A Location with the same name is already managed by you. Give a different name'
          };
        }

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

        return { success: true, message: 'Location added successfully' };
      } catch (err) {
        console.error(err);
        throw new Error(err.message);
      }
    },

    clockIn: async (_, { userLocation, date, clock_in_note }) => {
      try {
        const cookieStore = await cookies();
        let userId = JSON.parse(cookieStore.get('userId')?.value || null);
        const roles = JSON.parse(cookieStore.get('roles')?.value || '[]');

        if (!roles.includes('worker')) throw new Error('Not authorized to clock in');

        const user = await prisma.user.findUnique({
          where: { userId },
          select: {
            id: true
          }
        });

        const id = user.id;

        let geofence = await checkIfInside(userLocation);

        if (geofence.length == 0) {
          return { success: false, message: 'You need to be inside the perimeter to clock in' };
        }

        geofence = geofence[0];

        let shift = await prisma.shift.create({
          data: {
            workerId: id,
            date: date,
            clock_in: new Date(),
            clock_in_note,
            clock_in_geofenceId: geofence.id,
            clock_in_location: geofence.name
          }
        });
        return { success: true, shift, message: 'Clocked in' };
      } catch (err) {
        console.error(err);
        throw new Error(err.message);
      }
    },

    clockOut: async (_, { userLocation, date, clock_out_note }) => {
      try {
        const cookieStore = await cookies();
        let userId = JSON.parse(cookieStore.get('userId')?.value || null);
        const roles = JSON.parse(cookieStore.get('roles')?.value || '[]');

        if (!roles.includes('worker')) throw new Error('Not authorized to clock in');

        const user = await prisma.user.findUnique({
          where: { userId },
          select: {
            id: true
          }
        });

        const id = user.id;

        let geofence = await checkIfInside(userLocation);
        if (geofence.length == 0) {
          return { success: false, message: 'You need to be inside the perimeter to clock out' };
        }

        geofence = geofence[0];

        const openShift = await prisma.shift.findFirst({
          where: {
            workerId: id,
            date: date,
            clock_out: null
          }
        });

        if (!openShift) throw new Error('Not clocked in');

        let shift = await prisma.shift.update({
          where: { id: openShift.id },
          data: {
            clock_out: new Date(),
            clock_out_note,
            clock_out_geofenceId: geofence.id,
            clock_out_location: geofence.name
          }
        });
        return { success: true, shift };
      } catch (err) {
        console.error(err);
        throw new Error(err.message);
      }
    }
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
