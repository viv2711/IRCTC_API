# IRCTC_API
# Railway Management System

A Node.js based railway management system similar to IRCTC that allows users to check train availability, book seats, and manage bookings.

## Tech Stack

- **Web Server**: Node.js with Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Token)
- **Validation**: Zod

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- PostgreSQL

## Setup and Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd IRCTC_API
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**

Rename .env.sample file to .env file in the root directory and add all the environment vars;

4. **Setup prisma orm**

```bash
cd IRCTC_API
cd server
cd db
npx prisma migrate dev
npx prisma generate client
```
Add the DATABASE_URL in the .env.sample after renaming it to .env file

5. **Start PostgreSQL using Docker**
```bash
docker-compose up -d
```

6. **Run the application in server terminal**
```bash
npm run dev
```

## API Documentation

### Authentication Endpoints
**Register User**
```bash
POST irctc/api/signup


{
    "username": "user123",
    "password": "password123",
    "type": "user"
}
```

**Login User**
```bash
POST irctc/api/signin
Content-Type: application/json

{
    "username": "user123",
    "password": "password123"
}
```

**Register Admin**
```bash
POST irctc/api/signup


{
    "username": "admin123",
    "password": "adminpassword123",
    "type": "admin"
}
```

**Login Admin**
```bash
POST irctc/api/signin
Content-Type: application/json

{
    "username": "admin123",
    "password": "adminpassword123"
}
```
### Admin Endpoints
All admin endpoints require:
*Authorization: Bearer <jwt_token>*
jwt_token created via separate admin_api_key
**Create Train**
```bash
POST irctc/api/admin/addTrain
Content-Type: application/json

{
    "trainName": "Bhopal Express", 
    "sourceStationName": "Delhi", 
    "destinationStationName": "Bhopal", 
    "totalSeats": 100, 
    "availableSeats": 100
}
```
### User Endpoints
All user endpoints require:
*Authorization: Bearer <jwt_token>*
**Get Available Trains**
```bash
GET irctc/api/user/getTrains
Content-Type: application/json
{
    "sourceStationName": "Bhopal" , 
    "destinationStationName": "Prayagraj"
}
```
**Book a Seat**
```bash
POST irctc/api/user/bookTickets
Content-Type: application/json

{
    "sourceStationName": "Bhopal", 
    "destinationStationName": "Indore", 
    "date": "2024-12-01T00:00:00Z"
}
```
Get all the bookings of an User
```bash
GET irctc/api/user/getBookingDetails
```
Database Models

+ User Model
   - id (UUID)
   - username (String)
   - password (String)
   - role (Enum: 'ADMIN', 'USER')
+ Train Model
   - id (UUID)
   - name (String)
   - sourceStation (String)
   - destinationStation (String)
   - totalSeats (Integer)
   - availableSeats (Integer)
+ Booking Model
   - id (UUID)
   - date (DateTime)
   - seatNo (Integer)
   - status (Enum: 'booked', 'cancelled')
   - userId (UUID)
   - trainId (UUID)
### Features
+ Role-based authentication (Admin/User)
+ JWT-based authorization
+ API key protection for admin routes using jwt
+ Input validation using Zod
+ Concurrent booking handling using transactions
+ Seat availability tracking


