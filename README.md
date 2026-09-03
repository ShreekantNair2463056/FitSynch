# FitSynch - Gym & Fitness Management System

FitSynch is a modern, full-stack web application built to streamline gym operations. It features interactive role-based dashboards tailored for Members, Personal Trainers, and Branch Administrators.

## Features

- **Members**: Browse and purchase digital subscriptions (Gold, Platinum, Diamond), view real-time class schedules, reserve spots or join waitlists, and track customized workout/diet regimes assigned by trainers.
- **Trainers**: Manage class schedules, monitor attendee capacity, and digitally log/update personalized workout and diet notes for assigned trainees.
- **Administrators**: Configure membership pricing tiers, oversee branch operations, and view dynamic business intelligence charts (e.g., daily attendance trends, subscription popularity).

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, React Router, Context API, Recharts, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing

---

## Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas cluster)

### 1. Clone the repository
```bash
git clone https://github.com/ShreekantNair2463056/L-T_CIA3_5TH_SEM.git
cd L-T_CIA3_5TH_SEM
```

### 2. Setup the Backend
The root directory serves as the backend application.

1. Install backend dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
3. Start the backend development server:
   ```bash
   npm start
   ```
   The backend should now be running on `http://localhost:5000`.

### 3. Setup the Frontend
The frontend is located in the `/frontend` directory.

1. Open a new terminal window/tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend should now be running on `http://localhost:5173`.

---

## Exploring the App

To explore the role-based features, you can create new accounts via the Registration page. 

**Note on Roles:**
By default, newly registered users are assigned the `Member` role. To test `Trainer` or `Admin` features, you will need to manually update the user's role string to `"Trainer"` or `"Admin"` directly in your MongoDB database under the `users` collection.