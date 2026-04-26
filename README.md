# TagBack — Lost & Found QR Network

## Setup in 3 steps

### Step 1 — Get MongoDB (free)
1. Go to mongodb.com/atlas → Create free account
2. Create cluster → Connect → Drivers → Copy connection string
3. Paste in backend/.env as MONGO_URI=...

### Step 2 — Install & Run
Terminal 1 (Backend):
  cd backend
  npm install
  npm run dev

Terminal 2 (Frontend):
  cd frontend
  npm install
  npm run dev

### Step 3 — Open browser
  http://localhost:3000

## Deploy Free
- Frontend → vercel.com (connect GitHub, import frontend folder)
- Backend → railway.app (connect GitHub, import backend folder)
- Database → MongoDB Atlas (already free)
