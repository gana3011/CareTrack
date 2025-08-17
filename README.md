# CareTrack - Healthcare Staff Management System

## Overview

CareTrack is a comprehensive healthcare staff management application designed to track and manage healthcare workers' shifts through geofencing technology. The application provides role-based access control for managers and workers, enabling efficient staff scheduling, location-based clock-in/out functionality, and real-time monitoring of active shifts.

## Architecture

### Technology Stack

- **Frontend**: Next.js 15.2.4 with React 19.0.0
- **Styling**: Tailwind CSS 4.1.12 with Ant Design 5.27.0 components
- **Database**: PostgreSQL with Prisma ORM 6.13.0
- **API**: GraphQL with Apollo Server 5.0.0 and Apollo Client 3.13.9
- **Authentication**: Auth0 NextJS SDK 4.2.1
- **Maps**: Leaflet 1.9.4 with React Leaflet 5.0.0
- **Charts**: Recharts 3.1.2
- **Date Handling**: Day.js 1.11.13

### Application Structure

```
CareTrack/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/logout/          # Auth0 logout endpoint
│   │   ├── graphql/              # GraphQL API endpoint
│   │   └── users/sync/           # User synchronization endpoint
│   ├── manager/                  # Manager dashboard page
│   ├── worker/                   # Worker dashboard page
│   ├── layout.jsx               # Root layout component
│   └── page.jsx                 # Landing page
├── components/                   # React components
├── lib/                         # Library files and utilities
├── prisma/                      # Database schema and migrations
├── utils/                       # Utility functions
└── public/                      # Static assets
```

## Features Implemented

### 1. Authentication & Authorization
- **Auth0 Integration**: Secure authentication using Auth0 with JWT tokens
- **Role-Based Access Control**: Two distinct roles - `manager` and `worker`
- **Middleware Protection**: Route protection based on user roles
- **User Synchronization**: Automatic user sync with local database upon login

### 2. Geofencing & Location Management
- **Interactive Map Interface**: Leaflet-based map for defining geofences
- **Circular Geofences**: Managers can create circular perimeters with custom radius
- **Location Validation**: Workers must be within defined geofences to clock in/out
- **Geographic Data Storage**: PostGIS extension for efficient geographic queries

### 3. Shift Management
- **Clock In/Out System**: Location-verified time tracking
- **Shift Notes**: Optional notes for both clock-in and clock-out events
- **Weekly View**: Workers can view their weekly schedule
- **Active Shift Monitoring**: Real-time tracking of ongoing shifts
- **Shift History**: Complete historical records with detailed information

### 4. Dashboard & Analytics
- **Manager Dashboard**: Comprehensive overview with multiple views:
  - Perimeter management
  - Active shifts monitoring
  - Shift history
  - Analytics dashboard
- **Worker Dashboard**: Simplified interface for shift management
- **Data Visualization**: Charts showing:
  - Average hours per day
  - People clocking in per day
  - Total hours per staff member

### 5. Responsive Design
- **Mobile-First Approach**: Fully responsive design for mobile and desktop
- **Ant Design Components**: Professional UI components
- **Tailwind CSS**: Utility-first styling approach

## Database Schema

### Users Table
```sql
- id: Primary key
- userId: Auth0 user identifier (unique)
- email: User email address
- name: User full name
- picture: Profile picture URL
- roles: Array of user roles
- created_at, updated_at: Timestamps
- last_login: Last login timestamp
```

### Geofence Table
```sql
- id: Primary key
- name: Geofence name
- managerId: Reference to manager who created it
- center: Geographic point (PostGIS)
- radiusMeters: Radius in meters
- created_at, updated_at: Timestamps
- Unique constraint: (name, managerId)
```

### Shift Table
```sql
- id: Primary key
- workerId: Reference to worker
- date: Shift date
- clock_in, clock_out: Timestamps
- clock_in_geofenceId, clock_out_geofenceId: Geofence references
- clock_in_location, clock_out_location: Location names
- clock_in_note, clock_out_note: Optional notes
```

## GraphQL API

### Queries
- `fetchUserShiftsByWeek`: Get worker's weekly shifts
- `fetchActiveShifts`: Get currently active shifts (manager only)
- `fetchShiftHistory`: Get completed shifts for a date (manager only)
- `avgHoursPerDay`: Analytics for average hours per day
- `peopleClockingInPerDay`: Daily clock-in statistics
- `totalHoursPerStaff`: Staff-wise total hours

### Mutations
- `syncUser`: Synchronize user data from Auth0
- `addGeofence`: Create new geofence (manager only)
- `clockIn`: Clock in at location (worker only)
- `clockOut`: Clock out at location (worker only)

## Original Feature Requirements

The following features were specified in the project requirements:

### 1. Manager Features
- **Location Perimeter Setting**: Set a location perimeter (e.g., within 2 km) where care workers can clock in
- **Staff Clock-in Table**: View table of all staff who are currently clocked in
- **Staff Activity History**: For each staff member, view:
  - When and where they clocked in
  - When and where they clocked out
- **Analytics Dashboard**: 
  - Average hours people spend clocked in each day
  - Number of people clocking in each day
  - Total hours clocked in per staff over the last week

### 2. Care Worker Features
- **Clock In**: 
  - Ability to clock in when entering the perimeter
  - Optional note provision when clocking in
  - Validation to prevent clock-in when outside perimeter
- **Clock Out**:
  - Ability to clock out when already clocked in
  - Optional note provision when clocking out

### 3. User Authentication
- **Auth0 Integration**: Complete authentication system using Auth0
- **Multiple Login Options**: Support for Google login and email login
- **User Registration**: Account registration functionality
- **Session Management**: Login/logout capabilities
- **Task History**: View history of shifts and activities

### 4. UI/UX
- **Design Library**: Built using Ant Design as specified
- **Responsive Design**: Works well on desktop and mobile devices
- **Clean Interface**: User-friendly and visually appealing design
- **Mobile Optimization**: Fully responsive across different screen sizes

### 5. Bonus Features (Not Implemented)
- **Progressive Web App (PWA)**: Could be enhanced to work offline and be installable
- **Automatic Location Detection**: Notifications when entering/leaving perimeter

## Implementation Status: 4/4 Core Features Complete

All four core requirements have been successfully implemented with additional enhancements beyond the basic MVP requirements.


## Authentication Flow

The application implements a secure authentication flow using Auth0 with automatic user synchronization:

```
User Login Process:
┌─────────────────┐
│ User visits app │
└─────────┬───────┘
          │
          ▼
┌─────────────────────────────┐
│ User clicks "Login"         │
│ - Gmail OAuth               │
│ - Email + Password          │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ Auth0 Authentication        │
│ - Validates credentials     │
│ - Generates JWT tokens      │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ Auth0 Post-Login Action     │
│ - Adds default "worker"     │
│   role to user metadata     │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ Auth0 Action Calls          │
│ /api/users/sync endpoint    │
│ - Sends user data + roles   │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ GraphQL Mutation            │
│ - syncUser mutation         │
│ - Saves user to database    │
│ - Stores roles array        │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ Middleware Processing       │
│ - Sets HTTP-only cookies    │
│ - Extracts roles from JWT   │
│ - Routes based on role:     │
│   • Manager → /manager      │
│   • Worker → /worker        │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ User Dashboard              │
│ - Role-specific interface   │
│ - Protected routes          │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ User clicks "Logout"        │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ /api/auth/logout endpoint   │
│ - Clears HTTP-only cookies  │
│ - Invalidates session       │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ Redirect to /auth/logout    │
│ - Auth0 logout page         │
│ - Complete session cleanup  │
└─────────────────────────────┘
```

### Flow Details:

1. **Initial Authentication**: User authenticates via Auth0 using Gmail OAuth or email/password
2. **Role Assignment**: Auth0 post-login action automatically assigns default "worker" role to user metadata
3. **User Synchronization**: Auth0 action triggers `/api/users/sync` endpoint with user data and roles
4. **Database Storage**: GraphQL `syncUser` mutation saves user information and roles to PostgreSQL
5. **Session Management**: Middleware sets secure HTTP-only cookies for session management
6. **Role-based Routing**: Middleware extracts roles from JWT and routes users to appropriate dashboard
7. **Protected Access**: All subsequent requests are validated through middleware for proper authorization
8. **Logout Process**: User clicks logout → `/api/auth/logout` clears cookies → redirects to Auth0 logout

## Environment Setup

### Required Environment Variables
```env
# Auth0 Configuration
AUTH0_SECRET=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_SCOPE=
AUTH0_AUDIENCE=

# Database
DATABASE_URL=
SHADOW_DB_URL=

# Application
APP_BASE_URL=
```

### Database Setup
1. Install PostgreSQL with PostGIS extension
2. Run Prisma migrations: `npx prisma migrate deploy`
3. Generate Prisma client: `npx prisma generate`

## Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## Note to reviewers
Currently manager roles can only be added via the auth0 dashboard.

So, I have included a test manager account for review.

**Email**: test.manager@gmail.com
**Password**: Test@123