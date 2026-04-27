📍 ReturnIt — Smart Lost & Found QR Network
> **Never lose your valuables again.** India's first privacy-first QR-based lost & found platform — no app needed to find, instant WhatsApp alerts, anonymous chat, and reward system.
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=flat-square&logo=mongodb)
![Razorpay](https://img.shields.io/badge/Razorpay-Payment-blue?style=flat-square)
---
🧠 Overview
ReturnIt is a full-stack hyperlocal platform that helps users recover lost valuables using unique QR codes.
Stick a QR tag on your wallet, bag, laptop, or keys. If it gets lost, any stranger can scan it with their phone camera — no app download needed — and the owner gets an instant WhatsApp notification with the finder's location and message. All communication is 100% anonymous — the owner's phone number is never revealed.
> Built for India. Launched in Indore. Designed to scale across 5+ cities.
---
✨ Features
🔐 Secure Authentication — JWT-based login & registration with bcrypt password hashing
📦 Item Registration — Add wallet, bag, laptop, keys with category, description & reward amount
🏷️ QR Code Generation — Unique UUID-based QR per item, downloadable as SVG
📱 No-App Scan Page — Public web page opens when QR is scanned — zero friction for finders
🔔 Instant WhatsApp Alerts — Owner notified via Twilio API the moment QR is scanned
📍 Auto Location Capture — GPS coordinates logged on every scan
💬 Anonymous Chat — Finder and owner communicate without sharing real contact details
💰 Reward System — Owner can offer ₹100–₹1000 reward via Razorpay UPI transfer
⭐ Trust Score — Finders earn reputation points for returning items
📊 Owner Dashboard — Manage all items, view scan history, chat with finders
🏙️ City Heatmap — Visualize where items are lost most in your city
---
🛠️ Tech Stack
Layer	Technology
Frontend	Next.js 14, React.js, CSS Modules
Backend	Node.js, Express.js, REST API
Database	MongoDB Atlas, Mongoose ODM
Authentication	JWT (JSON Web Tokens), bcryptjs
Notifications	Twilio WhatsApp API
Payments	Razorpay API (UPI, Cards, Wallets)
QR Generation	qrcode npm, qrcode.react
Deployment	Vercel (frontend), Railway (backend)
---
📁 Project Structure
```
returnit/
├── backend/
│   └── src/
│       ├── config/         # MongoDB connection
│       ├── models/         # User, Item, Message schemas
│       ├── routes/         # auth, items, scan, chat, payments
│       ├── middleware/      # JWT auth middleware
│       ├── utils/          # QR generator, WhatsApp notifications
│       └── server.js       # Express entry point
│
├── frontend/
│   └── src/
│       ├── components/     # Navbar, ItemCard
│       ├── pages/          # index, dashboard, login, register
│       │   ├── items/      # new item, item detail
│       │   └── scan/       # public QR scan page
│       ├── lib/            # API calls, AuthContext
│       └── styles/         # Global CSS (dark theme + aurora)
│
└── README.md
```
---
⚙️ Setup Instructions
1. Clone Repository
```bash
git clone https://github.com/TheSiddCode/returnit.git
cd returnit
```
2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.mongodb.net/returnit
JWT_SECRET=your_long_random_secret_key
CLIENT_URL=http://localhost:3000

# Optional — WhatsApp alerts
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Optional — Reward payments
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_SECRET=your_razorpay_secret
```
3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_your_key
```
4. Open in Browser
```
http://localhost:3000
```
---
🔄 How It Works
```
User registers item → Gets unique QR code → Sticks on item
         ↓
    Item gets lost
         ↓
Finder scans QR (no app needed) → Web page opens
         ↓
Finder sends message + location captured automatically
         ↓
Owner gets WhatsApp notification instantly
         ↓
Owner & Finder chat anonymously → Item returned → Reward paid via UPI
```
---
🌐 Live Demo
🔗 Coming Soon — returnit.vercel.app
---
🔐 Environment Variables
Variable	Required	Description
`MONGO_URI`	✅ Yes	MongoDB Atlas connection string
`JWT_SECRET`	✅ Yes	Any long random string
`CLIENT_URL`	✅ Yes	Frontend URL
`TWILIO_ACCOUNT_SID`	⚡ Optional	For WhatsApp alerts
`TWILIO_AUTH_TOKEN`	⚡ Optional	For WhatsApp alerts
`RAZORPAY_KEY_ID`	⚡ Optional	For reward payments
`RAZORPAY_SECRET`	⚡ Optional	For reward payments
> ⚠️ Never upload `.env` or `.env.local` to GitHub. Both are in `.gitignore`.
---
🚀 Deployment
Service	Platform	Cost
Frontend	Vercel	Free
Backend	Railway	Free
Database	MongoDB Atlas M0	Free
Total infra cost	—	₹0/month at launch
---
💰 Business Model
Revenue Stream	Price	Difficulty
QR Sticker Packs (5 tags)	₹99	Easy
Premium Account	₹199/year	Easy
Reward Commission (5%)	Per transaction	Medium
B2B — Hotels & Colleges	₹2,000/month	Medium
> Projected Year 1 Revenue from Indore alone: **~₹3.5 Lakhs**
---
🔮 Future Improvements
📱 Native mobile app (React Native)
🤖 AI-based item recognition from photo
🗺️ City-wide lost item heatmap
🔵 Bluetooth + NFC tag support
🌍 Multi-language support (Hindi, Marathi, Gujarati)
🏨 B2B dashboard for hotels and colleges
---
👨‍💻 Author
Siddhant Singh Rajawat
GitHub: @TheSiddCode
Project: github.com/TheSiddCode/returnit
---
> ⭐ If this project helped you or you find it interesting, please give it a star — it helps a lot!
