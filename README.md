# NestJS Authentication API

A robust authentication system built with NestJS, featuring multiple authentication strategies including local login and Google OAuth integration.

## Features

- **User Registration & Login** - Traditional email/password authentication
- **JWT Authentication** - Access and refresh token implementation
- **Google OAuth** - Social login integration
- **Secure Cookies** - HTTP-only cookies for refresh tokens
- **MongoDB Integration** - User data persistence
- **Password Hashing** - Secure bcrypt encryption
- **Input Validation** - Request validation with class-validator

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Docker & Docker Compose
- MongoDB (or use the provided Docker setup)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Auth-In-Nest
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory with your configuration:

   ```env
   # Database
   DB_CONNECTION_STRING='mongodb://admin:password@localhost:27017/nestjs-auth'

   # Server
   NODE_ENV='development'
   PORT=4000

   # JWT Configuration
   JWT_SECRET='your-jwt-secret'
   JWT_EXPIRES_IN='2h'
   REFRESH_JWT_SECRET='your-refresh-jwt-secret'
   REFRESH_JWT_EXPIRES_IN='4d'

   # Cookie Configuration
   REFRESH_TOKEN_COOKIE_EXPIRES_IN_DAYS=4

   # Google OAuth (Get from Google Cloud Console)
   GOOGLE_CLIENT_ID='your-google-client-id'
   GOOGLE_CLIENT_SECRET='your-google-client-secret'
   GOOGLE_CALLBACK_URL='http://localhost:4000/auth/google/callback'

   # Frontend URL
   FRONTEND_URL='http://localhost:4000/frontend'
   ```

4. **Start MongoDB with Docker**

   ```bash
   docker-compose up -d
   ```

5. **Run the application**

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run start:prod
   ```

## API Endpoints

### Authentication

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| POST   | `/auth/register`        | Register new user         |
| POST   | `/auth/login`           | Login with email/password |
| POST   | `/auth/refresh`         | Refresh access token      |
| GET    | `/auth/google`          | Initiate Google OAuth     |
| GET    | `/auth/google/callback` | Google OAuth callback     |

### Users

| Method | Endpoint    | Description                       |
| ------ | ----------- | --------------------------------- |
| GET    | `/users/me` | Get current user data (protected) |

### General

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | `/`                   | Health check            |
| GET    | `/protected-resource` | Test protected endpoint |

## Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Access protected endpoint

```bash
curl -X GET http://localhost:4000/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:4000/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

## Database Management

Access MongoDB through the web interface:

- **Mongo Express**: http://localhost:8081
- **Username**: admin
- **Password**: password

## Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start in debug mode

# Production
npm run build              # Build the application
npm run start:prod         # Start production server

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Run tests with coverage

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## Project Structure

```
src/
├── auth/                  # Authentication module
│   ├── strategies/        # Passport strategies
│   ├── guards/           # Auth guards
│   └── dtos/             # Data transfer objects
├── user/                 # User module
│   ├── schemas/          # MongoDB schemas
│   └── interfaces/       # TypeScript interfaces
└── main.ts               # Application entry point
```

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (Local, JWT, Google OAuth)
- **Validation**: class-validator
- **Password Hashing**: bcrypt
- **Environment**: dotenv

## License

This project is [MIT licensed](LICENSE).
