Escape Room Coding Game – Landing Page

This repository contains the landing page for the Escape Room Coding Game project.

The landing page serves as the entry point to the application, providing users with an introduction to the game, onboarding flow, and navigation to authentication and gameplay. It is intentionally maintained as a separate repository to reflect real-world separation between static marketing/onboarding content and core application logic.

Tech Stack
HTML5
CSS3
JavaScript (ES6+)

Responsibilities

Acts as the first point of interaction for users
Introduces the game concept and user flow
Handles navigation to authentication and gameplay
Provides a lightweight, fast-loading static experience

Project Structure (High Level)
/landing-page
├── index.html
├── css/
├── js/
└── assets/

Design Notes

Built using pure HTML, CSS, and JavaScript to keep the landing page lightweight and fast.
No backend logic is handled in this repository.
Authentication and game logic are managed by the backend and frontend repositories respectively.
This separation allows the landing page to be deployed independently using static hosting.

Deployment

The landing page is suitable for deployment on static hosting platforms such as:
Vercel
Netlify
GitHub Pages
Relationship to Main Project

This landing page is part of the Escape Room Coding Game project, which is structured across multiple repositories:

Landing Page → User entry point and onboarding
Frontend Game → Core gameplay logic and UI
Backend API → Authentication and data persistence
For the complete project overview and architecture, refer to the main repository.

Purpose

This repository demonstrates:
Clean static frontend development
Separation of concerns in application architecture
Real-world project organization practices

License
This project is for educational and demonstration purposes.
