# FitSynch - Gym & Fitness Management System

## Overview
FitSynch is a modern, full-stack web application designed to streamline the operations of a fitness center. It serves as a centralized platform connecting gym members, personal trainers, and branch administrators. The system eliminates paperwork and manual scheduling by offering interactive dashboards tailored to each user's specific role and permissions.

## Tech Stack
The project is built using the **MERN** stack (MongoDB, Express.js, React, Node.js), ensuring a fast, scalable, and responsive experience.

**Frontend:**
- **Framework:** React (bootstrapped with Vite for extremely fast hot-module reloading and optimized builds)
- **Styling:** Tailwind CSS v4 for a sleek, responsive, dark/glassmorphic UI design
- **Routing & State:** React Router for client-side navigation; React Context API for global state management (Authentication/User state)
- **Data Visualization:** Recharts for rendering dynamic, interactive business analytics charts
- **Network Requests:** Axios for handling HTTP requests to the backend API

**Backend:**
- **Runtime & Framework:** Node.js with Express.js for building a robust RESTful API
- **Database:** MongoDB (hosted on MongoDB Atlas) for flexible, NoSQL document storage
- **ODM:** Mongoose for database schema modeling and data validation
- **Authentication:** JSON Web Tokens (JWT) for secure, stateless user sessions and bcrypt for password hashing

---

## Architecture & How It Works (The Inside)

FitSynch operates on a decoupled **Client-Server Architecture**:

1. **The REST API (Backend):** 
   The Express server handles all business logic, database queries, and security. It exposes a series of endpoints (e.g., `/api/classes`, `/api/plans`). When a request comes in, it passes through middleware:
   - **Authentication Middleware:** Verifies the JWT token attached to the request header to ensure the user is logged in.
   - **Role-Based Access Control (RBAC):** Checks if the authenticated user has the required role (`Member`, `Trainer`, or `Admin`) to perform the action.
   
2. **The SPA (Frontend):** 
   The React frontend is a Single Page Application. It maintains the user's session token in `localStorage`. Based on the logged-in user's role, the UI dynamically re-renders to show the appropriate dashboard components without reloading the browser.

3. **Data Flow Example (Booking a Class):**
   - A Member clicks "Book Now" on a class card in the UI.
   - The Frontend sends a `POST` request to `/api/classes/:id/book` with the user's JWT.
   - The Backend intercepts the request, verifies the JWT, ensures the user is a 'Member', and checks if the class capacity is full.
   - If successful, the Backend atomically increments the class's `bookedCount`, creates a `Booking` document in MongoDB, and responds with a success status.
   - The Frontend receives the success response, shows a toast notification, and refetches the class list to instantly update the UI (showing one less available spot).

---

## Features (The Outside)

The platform dynamically adapts based on who logs in:

### 1. Member Experience
- **Digital Subscriptions:** Members can browse available membership tiers (e.g., Gold, Platinum, Diamond) and instantly subscribe to a plan, which then appears on their active profile.
- **Class Booking & Waitlists:** Members view a live schedule of fitness classes, checking real-time capacity. They can reserve a spot or join an automated waitlist if the class is full (if someone cancels, the waitlist promotes the next person automatically).
- **Personalized Regimes:** Members have a dedicated dashboard section to view custom workout and diet plans assigned exclusively to them by their trainers.
- **Attendance Tracking:** Members can view a historical log of their gym visits and class check-ins.

### 2. Trainer Portal
- **Class Management:** Trainers can easily schedule new classes (setting the title, date, time, duration, and capacity) and monitor how many members have enrolled.
- **Trainee Progress Logs:** Trainers can select any registered member from a dropdown to draft, assign, or update highly personalized workout and diet notes, which are instantly pushed to that member's dashboard.

### 3. Administrator Dashboard
- **Tier Management:** Admins have a full CRUD (Create, Read, Update, Delete) interface to configure membership pricing tiers and outline features (e.g., VIP Rooms, Gym Chef) for members to purchase.
- **Business Intelligence:** A built-in analytics suite uses dynamic charts to visualize business health, including a Bar Chart mapping daily attendance trends and a Pie Chart showing the popularity distribution of active subscriptions.
