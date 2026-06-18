# Store Rating Platform

A full-stack app where users can submit ratings (1–5) for registered stores. Built with React, Express, and PostgreSQL.

## Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS + React Router + Axios
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt

## Roles
- **Admin:** Manage users/stores, view dashboard stats, filter/sort listings
- **Normal User:** Sign up, browse/search stores, submit/modify ratings
- **Store Owner:** View store's average rating and list of raters

## Setup

### Backend
\`\`\`bash
cd server
npm install
\`\`\`
Create `server/.env`:
\`\`\`
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
\`\`\`
Create the DB and run `server/src/db/schema.sql` against it, then:
\`\`\`bash
npm run dev
\`\`\`
Runs on `http://localhost:5000`.

### Frontend
\`\`\`bash
cd client
npm install
\`\`\`
Create `client/.env`:
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`
\`\`\`bash
npm run dev
\`\`\`
Runs on `http://localhost:5173`.

### First Admin
Register normally (creates a `user` role), then promote via SQL:
\`\`\`sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
\`\`\`

## Validation Rules
- **Name:** 20–60 characters
- **Address:** Max 400 characters
- **Password:** 8–16 chars, 1 uppercase, 1 special character
- **Email:** Standard format
