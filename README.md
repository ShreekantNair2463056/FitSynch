# Gym & Fitness Membership Management System

A robust backend REST API built for a gym chain to manage memberships, class schedules, trainer profiles, attendance tracking, and admin analytics, replacing manual register-based workflows.

**Tech Stack**

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT) & bcrypt password hashing
* **Validation:** express-validator

---

**Project Structure (MVC Architecture)**

```text
├── controllers/       # Business logic for auth, plans, classes, bookings, attendance, etc.
├── models/            # Mongoose schemas (User, MembershipPlan, Membership, Class, Booking, Attendance, etc.)
├── routes/            # Express route endpoints mapped to controllers
├── middlewares/       # JWT authentication, role authorization, and request validation
├── utils/             # Helper utilities and centralized error handling
├── .env               # Environment configuration (not committed)
├── server.js          # Entry point and database connection setup
└── README.md          # Project documentation

```

---

**Getting Started & Installation**

Follow these instructions to set up and run the repository locally within minutes.

**Prerequisites**

* Node.js (v18+ recommended)
* MongoDB instance (Local or MongoDB Atlas URI)
* Postman (for API testing)

**1. Clone the Repository**

```bash
git clone https://github.com/ShreekantNair2463056/L-T_CIA3_5TH_SEM.git
cd L-T_CIA3_5TH_SEM

```

**2. Install Dependencies**

```bash
npm install

```

**3. Configure Environment Variables**
Create a `.env` file in the root directory and configure your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here

```

*(Note: Never hardcode secrets or commit your `.env` file to GitHub.)*

**4. Run the Application**

```bash
# Start in development mode with nodemon
npm run dev

# Start in production mode
npm start

```

---

**Functional Modules Implemented (13 Total)**

* **Member Registration & Authentication:** Secure sign-up and login with hashed passwords and JWT issuance.
* **Membership Plan Management:** Admin-defined plans specifying duration and pricing.
* **Membership Purchase & Expiry Tracking:** Active membership status management and automated expiry checks.
* **Trainer Profile Management:** Admin tools to assign specializations and manage trainer profiles.
* **Class Schedule Management:** Trainer/Admin creation of class sessions with capacity limits and schedules.
* **Class Booking Engine:** Member booking workflows with atomic capacity validation.
* **Attendance Check-In Module:** Real-time tracking for gym visits and verified class check-ins.
* **Waitlist for Full Classes:** Automatic FIFO queue handling and promotion upon cancellations.
* **Diet/Workout Plan Notes:** Personalized trainer notes assigned per member.
* **Renewal & Expiry Notifications:** Automated tracking and alert record generation ahead of expiration.
* **Member Self-Service Dashboard:** Aggregated personal view of memberships, bookings, attendance, and plans.
* **Branch Admin Reports:** Advanced data aggregations tracking attendance trends, plan popularity, and renewals.
* **Role-Based Access Control (RBAC):** Granular permissions partitioned across Member, Trainer, and Branch Admin roles.

---

**API Testing & Postman Collection**

A complete Postman collection covering all endpoint routes, request bodies, and role-based header configurations is included in the repository. Import the collection into Postman, set your `{{TOKEN}}` environment variable using a logged-in user's JWT, and execute the end-to-end gym workflows.
