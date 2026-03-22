# 🚪 Escape Room: The Coding Challenge 🎮

Welcome to the **Escape Room Coding Game**! This is a full-stack, immersive web application where players must solve programming challenges to escape a horror-themed room. 

![Escape Room Preview](public/preview.png) *(Preview of the game)*

---

## ✨ Features
- **Immersive User Experience**: A horror-themed UI with custom cursors, jump scares, background audio, and atmospheric lighting.
- **Dynamic Coding Challenges**: Built-in coding challenges ranging from JavaScript to HTML basics, powered by a customized Monaco Editor.
- **Full Authentication**: Secure signup and login system using JWTs and bcrypt.
- **Leaderboard & Dashboard**: Track your stats, best times, and overall performance.
- **Consolidated Architecture**: Both the frontend GUI and backend API (`Express.js`) are housed within this single repository, making it trivially easy to deploy to serverless platforms like Vercel.

---

## 🛠️ Tech Stack
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+), Monaco Editor.
- **Backend API**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JSON Web Tokens (JWT) & bcrypt.
- **Hosting**: Vercel (Serverless Functions via `api/index.js`).

---

## 📂 Project Structure
```text
/
├── api/                  # Express.js backend logic and routes
│   ├── models/           # MongoDB schemas (User, Game State, etc.)
│   ├── routes/           # API Endpoints (Auth, Game)
│   └── index.js          # Main Express app entrypoint & Vercel serverless handler
├── game/                 # Core game interface & logic
│   ├── index.html        # Game UI
│   ├── script.js         # Game mechanics & challenge handlers
│   └── styles.css        # Game themes & animations
├── public/               # Public assets (images, audio)
├── index.html            # Landing page (Auth UI)
├── script.js             # Landing page UI interactions
├── styles.css            # Landing page styling
├── vercel.json           # Vercel deployment & routing config
└── package.json          # Node dependencies
```

---

## 🚀 Running Locally

To run the full stack (frontend and backend) on your local machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rushi04j/escape-room-frontend.git
   cd escape-room-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your MongoDB connection string:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/Cluster0?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_key_here
   PORT=5000
   ```

4. **Start the server**:
   ```bash
   npm start
   ```
   *The server will boot up the Express API on port 5000 and serve the frontend statically. Navigate to `http://localhost:5000` to start playing!*

---

## 🌐 Deployment (Vercel + GitHub)

This application is fully optimized for **Vercel** with zero-configuration needed other than environment variables!

### 1. Link GitHub to Vercel
1. Push this code to the `master` branch on GitHub.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
3. Click **Add New** > **Project** and import this repository.
4. **Important**: Under "Environment Variables", make sure to add `MONGO_URI` before deploying.
5. Hit **Deploy**! Vercel will automatically read the `vercel.json` file and map all `/api/*` traffic to the backend serverless functions, while serving the HTML/CSS/JS frontend as static assets.

### 2. Automatic Deployments
Since Vercel is connected to exactly this GitHub repository, **any future `git push` to the `master` branch will automatically trigger a new deployment**. 

---
*Created by [Rushi04j](https://github.com/Rushi04j).*
