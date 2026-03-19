# MedWeb 2.0 - Medicine Inventory Viewer

A full-stack read-only storefront for a single medicine shop where users can browse, search, and check stock availability of medicines. Includes a protected Admin portal for managing inventory.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router DOM, React Query, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: JWT Authentication, bcryptjs, Helmet, Express Rate Limit, CORS

---

## Prerequisites
- **Node.js**: v16+
- **MongoDB**: A running local instance (`mongodb://127.0.0.1:27017/medweb`) or a MongoDB URI in `.env`

---

## 🛠 Setup Instructions

### 1. Clone the Project
Open the terminal in the root folder `MedWeb2.0` where the `client` and `server` directories are located.

### 2. Backend Setup
Navigate to the server directory:
```bash
cd server
```
Install dependencies:
```bash
npm install
```
Set up the `.env` file (optional if defaults are sufficient):
Create a `.env` file inside `server/` with:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/medweb
JWT_SECRET=your_jwt_secret_key
```

Run the Seed Script to insert initial data and create the admin user:
*(Make sure MongoDB is running locally before running this)*
```bash
npm run seed
```

Start the Backend Server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal tab and navigate to the client directory:
```bash
cd client
```
Install dependencies:
```bash
npm install
```
Start the Frontend Server:
```bash
npm run dev
```

### 4. Admin Access
To manage the inventory, go to the Admin Login page:
- URL: `http://localhost:5173/admin`
- Default Username: `admin`
- Default Password: `password123`
*(Note: Use the seed script to create this initial admin account)*

---

## 📡 API Documentation Summary

### Public Endpoints
- `GET /api/medicines` - Fetch all medicines (supports `?limit=`, `?page=`, `?category=`, `?availability=`, `?sort=`)
- `GET /api/medicines/search?q={query}` - Live search medicines by name, brand, or generic name
- `GET /api/medicines/:id` - Fetch single medicine details

### Protected Admin Endpoints (Requires Bearer JWT)
- `POST /api/auth/login` - Authenticate admin and return JWT
- `GET /api/admin/dashboard` - Get dashboard stats (Total, Low Stock, Out of Stock)
- `POST /api/admin/medicines` - Create a new medicine entry
- `PUT /api/admin/medicines/:id` - Update existing medicine entry
- `DELETE /api/admin/medicines/:id` - Delete a medicine entry

---

## 🔮 Future-Proofing
The application uses **React Query** and **Tailwind CSS**. State logic and styles can easily be ported to React Native and NativeWind with minimal refactoring. State management relies entirely on server state rather than complex frontend-only Redux stores.
