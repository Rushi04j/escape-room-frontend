Escape Room Coding Game – Backend API
This repository contains the backend services for the Escape Room Coding Game.
It is responsible for authentication, user management, and API communication with the frontend game.

The backend is built as a standalone REST API to maintain clear separation of concerns and enable independent deployment.

Tech Stack
Runtime & Framework
Node.js
Express.js
Database
MongoDB
Mongoose

Authentication & Security
JWT (JSON Web Tokens) for session handling
bcryptjs for password hashing

Utilities & Middleware
cors – Cross-Origin Resource Sharing
dotenv – Environment variable management

Core Responsibilities
User registration and login
Secure password hashing and credential validation
JWT-based authentication
REST API endpoints for frontend integration
Persistent user data storage in MongoDB

API Endpoints (High-Level)
POST /api/auth/signup   → Register a new user
POST /api/auth/login    → Authenticate user and issue JWT


All protected routes require a valid JWT in the request headers.

Project Structure
/backend
├── models        → Mongoose schemas
├── routes        → Express route handlers
├── controllers  → Request handling logic
├── middleware   → Auth and utility middleware
├── config       → Database and environment setup
└── server.js    → Application entry point

Environment Variables

Create a .env file in the root directory:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Running the Backend Locally
npm install
npm start

The server will start on:
http://localhost:5000

Design Notes
The backend is intentionally decoupled from the frontend.
Communication with the frontend happens strictly through REST APIs.
Game logic and UI state are handled on the frontend; the backend focuses on authentication and persistence.
This structure mirrors real-world backend services used in production systems.

Related Repositories

This backend is part of the Escape Room Coding Game project:
Landing Page Repository
Frontend Game Repository
Parent Overview Repository (recommended entry point)

Purpose

This backend demonstrates:
Practical Node.js and Express.js usage
Secure authentication workflows
REST API design
Database integration using MongoDB

License
This project is for educational and demonstration purposes.
