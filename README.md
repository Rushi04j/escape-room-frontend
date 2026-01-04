Escape Room Coding Game – Frontend

This repository contains the frontend game interface for the Escape Room Coding Game project.

The frontend is responsible for rendering the gameplay experience, managing user interactions, handling game logic, and communicating with the backend APIs for authentication and user-related operations. It is intentionally separated from the backend to maintain a clean division between UI logic and server-side responsibilities.

Tech Stack
HTML5
CSS3
Vanilla JavaScript (ES6+)

Core Responsibilities

Render the interactive escape room gameplay UI
Manage timers, levels, and challenge progression
Handle user interactions and event-driven game logic
Communicate with backend REST APIs for authentication
Manage session-based game state on the client side

Gameplay Overview

Users enter the game after successful authentication
Gameplay is divided into topic-based challenges:
JavaScript
HTML
CSS

Challenges include:
Multiple-choice questions
Debugging tasks
Fill-in-the-blank questions
A global countdown timer adds time pressure and progression logic

Project Structure (High Level)
/frontend
├── index.html
├── css/
├── js/
│   ├── game.js
│   ├── challenges.js
│   └── utils.js
└── assets/

Design Notes

Built using Vanilla JavaScript to emphasize core language fundamentals without relying on frameworks.
Game logic, timers, and challenge handling are managed entirely on the client side.
Challenge data is currently hardcoded for simplicity and performance.
Leaderboard and progress tracking are session-based and reset on page reload.
Backend services handle authentication and persistent user data only.

API Integration
The frontend communicates with the backend using REST APIs for:
User login
User authentication validation
Secure session handling via JWT
All protected API requests include a valid JWT token.

Deployment
The frontend is suitable for deployment on static hosting platforms such as:
Vercel
Netlify

GitHub Pages
It is deployed independently from the backend API.

Relationship to Main Project

This frontend is part of the Escape Room Coding Game, which is structured across multiple repositories:

Landing Page → User entry point and onboarding
Frontend Game → Core gameplay logic and UI
Backend API → Authentication and data persistence

For a complete overview of the project architecture and repository links, refer to the main project repository.

Purpose

This repository demonstrates:
Strong fundamentals in Vanilla JavaScript
Event-driven frontend logic
UI state handling without frameworks
Practical frontend–backend integration using REST APIs

License
This project is for educational and demonstration purposes.
