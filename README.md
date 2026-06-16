# CampusBazaar – Hostel Marketplace Platform

A web application where students can buy and sell second-hand items within their campus.

## Tech Stack

**Frontend:** React.js, React Router, Axios, Vanilla CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Authentication:** JWT  
**Media Storage:** Cloudinary

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)

### 1. Clone and Setup

```bash
cd new_project
```

### 2. Configure Environment Variables

Edit `server/.env` with your actual credentials:

```
MONGODB_URI=mongodb://localhost:27017/campusbazaar
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. Run the Application

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

The frontend runs on `http://localhost:3000` and proxies API requests to `http://localhost:5000`.

## Features

- **Authentication** — Signup, Login, JWT-protected routes
- **User Profile** — View and edit profile, upload profile picture
- **Item Listings** — Create, edit, delete listings with image uploads
- **Browse & Search** — Search by title, filter by category and condition
- **Item Detail** — Full item info with image gallery, seller info
- **Wishlist** — Save and remove items
- **Sold Tracking** — Mark items as Sold/Available with visible badge

## Folder Structure

```
new_project/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── components/         # Navbar, ItemCard, ProtectedRoute, Spinner
│       ├── pages/              # Home, Login, Signup, Profile, etc.
│       ├── context/            # AuthContext
│       ├── hooks/              # useAuth
│       ├── services/           # API functions (Axios)
│       ├── App.jsx             # Routes
│       ├── App.css             # Component styles
│       └── index.css           # Global styles & variables
│
├── server/                     # Express backend
│   ├── config/                 # DB connection, Cloudinary config
│   ├── controllers/            # Auth, User, Item, Wishlist controllers
│   ├── middleware/             # JWT auth, Multer upload
│   ├── models/                 # User, Item models
│   ├── routes/                 # API route definitions
│   └── server.js               # Entry point
│
└── README.md
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get profile (protected) |
| PUT | `/api/users/profile` | Update profile (protected) |

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/items` | Create item (protected) |
| GET | `/api/items` | Get all items (search, category, condition filters) |
| GET | `/api/items/:id` | Get single item |
| PUT | `/api/items/:id` | Update item (owner only) |
| DELETE | `/api/items/:id` | Delete item (owner only) |
| PUT | `/api/items/:id/sold` | Mark as sold (owner only) |
| PUT | `/api/items/:id/available` | Mark as available (owner only) |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Get wishlist (protected) |
| POST | `/api/wishlist/:itemId` | Add to wishlist (protected) |
| DELETE | `/api/wishlist/:itemId` | Remove from wishlist (protected) |
