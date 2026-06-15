# CampusFlow

**AI-powered campus management platform** built for **Amazon HackOn**.  
One app for students, faculty, and admins — timetable, assignments, events, hostel, transport, placement prep, notifications, and a **Google Gemini** AI assistant.

---

## What Problem Does It Solve?

College students juggle too many disconnected systems — LMS, notices, events, hostel, transport, placement portals. Important updates get missed, and there is no single place to ask questions about campus life.

**CampusFlow solves this by:**

| Problem | CampusFlow Solution |
|---------|---------------------|
| Scattered campus info | Unified student dashboard with all modules in one place |
| Missed deadlines & notices | Smart notifications + AI daily brief & reminders |
| Manual event discovery | Campus Event Hub with AI recommendations |
| Low attendance awareness | Attendance tracker + AI advisor ("Can I skip this class?") |
| Placement prep overload | Placement Hub with resume analysis, roadmaps, interview prep |
| No instant campus help | **Google Gemini AI Assistant** — chat, voice, study plans |
| Slow auth & onboarding | Email/password, Google Sign-In (Firebase), guest demo mode |
| File & email workflows | **AWS S3** uploads + **SES** email notifications |
| Data not persisting | **MongoDB Atlas** for users; fallback local store for offline dev |

---

## Tech Stack

### Frontend

| Technology | Use |
|------------|-----|
| **React 19** | UI components & pages |
| **Vite 8** | Dev server & production build |
| **Tailwind CSS v4** | Styling & responsive layout |
| **React Router v7** | Client-side routing |
| **Firebase Auth** | Google Sign-In |
| **Firestore** | User profile sync (uid, role, photo) |
| **Framer Motion** | Animations |
| **Spline** | 3D hero section on landing page |

**Key folders:** `src/components/`, `src/pages/`, `src/context/`, `src/services/`, `src/firebase/`

### Backend

| Technology | Use |
|------------|-----|
| **Node.js + Express 5** | REST API server |
| **MongoDB Atlas + Mongoose** | User auth & persistent storage |
| **JWT + bcrypt** | Secure login & password hashing |
| **Google Gemini API** | AI chat & notice summarization |
| **AWS S3** | Resume, profile & document uploads |
| **AWS SES** | Event registration & welcome emails |
| **Multer** | Multipart file handling |

**Key folders:** `backend/routes/`, `backend/services/`, `backend/models/`, `backend/middleware/`

### Deployment

| Platform | Role |
|----------|------|
| **MongoDB Atlas** | Cloud database |
| **Firebase** | Google OAuth |
| **AWS** | S3 storage + SES email |

Local dev: Vite frontend (`5173`) + Express backend (`5002`).

---

## Features & Modules

### For Students
- **Dashboard** — daily brief, overview cards (classes, assignments, attendance, events)
- **AI Assistant** — Gemini-powered chat, notice summary, study plan, resume analyzer, voice input
- **Timetable** — today's classes, weekly schedule, study recommendations
- **Assignments & Attendance** — due dates, urgency badges, attendance safe-zone advisor
- **Campus Event Hub** — browse, register, AI event recommendations
- **Student Alert Center** — notifications with read/dismiss, priority alerts
- **Hostel** — mess menu, complaints, leave requests, notices
- **Transport** — bus schedule, live tracking, missed-bus alternatives
- **Placement Hub** — resume score, company roadmaps, coding/aptitude progress
- **Settings** — notification & AI preferences

### For Faculty
- Faculty dashboard (role-based access)

### For Admin
- Admin dashboard with **role-wise user list** (`student` / `faculty` / `admin`)

### Auth Options
- Email + password signup/login
- **Google Sign-In** (Firebase → synced to MongoDB)
- Guest demo mode
- JWT session with protected routes

---

## Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        LANDING PAGE (/)                          │
│              Hero · Features · Demo · Login / Signup             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
     /login           /signup         Continue as Guest
          │                │                │
          └────────────────┼────────────────┘
                           │
                    Auth (JWT + Firebase)
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   /dashboard      /faculty-dashboard   /admin-dashboard
   (Student)           (Faculty)           (Admin)
          │
          ├── Dashboard Home (brief, widgets)
          ├── AI Assistant (Gemini chat + tools)
          ├── Timetable
          ├── Events (register → SES email if AWS configured)
          ├── Notifications
          ├── Hostel / Transport / Placement
          └── Settings
```

### Request Flow (Frontend → Backend)

```
React Page
    │
    ▼
src/services/api.js  ──►  src/lib/apiClient.js  (JWT in header)
    │
    ▼
/api/*  ──►  Vite proxy (dev) → Express backend :5002
    │
    ▼
Express Routes  ──►  Services  ──►  MongoDB / Gemini / AWS S3·SES
```

### AI Assistant Flow

```
Student asks question
    │
    ▼
POST /api/ai/chat  { question }
    │
    ├── GEMINI_API_KEY set?  ──►  Google Gemini (campus context + student data)
    │
    └── Fallback  ──►  CampusGPT (rule-based local AI)
    │
    ▼
Response with meta: { poweredBy: "Google Gemini", model, ... }
    │
    ▼
AIAssistantPage shows answer + Gemini badge in UI
```

### Auth Flow

```
Signup/Login
    │
    ├── Email + Password  ──►  POST /api/auth/register | /login
    │                              └── bcrypt hash → MongoDB users collection
    │
    └── Google Sign-In  ──►  Firebase Auth  ──►  Firestore user doc
                                    │
                                    └── POST /api/auth/firebase  ──►  MongoDB sync
    │
    ▼
JWT token stored in localStorage  ──►  All protected API calls use Bearer token
```

---

## Project Structure

```
amazon/
├── src/                      # Frontend (React)
│   ├── components/           # UI modules (ai, dashboard, events, hostel, …)
│   ├── pages/                # Login, Signup, Admin/Faculty dashboards
│   ├── context/              # AuthContext, StudentNavContext
│   ├── services/             # api.js, aiService.js
│   ├── firebase/             # Firebase init & Google auth
│   └── lib/apiClient.js      # Fetch wrapper + JWT
│
├── backend/                  # Backend (Express)
│   ├── server.js             # API server entry (port 5002)
│   ├── routes/               # API route handlers
│   ├── services/             # auth, ai, gemini, s3, ses
│   ├── models/               # User, Upload (MongoDB schemas)
│   ├── config/               # db.js, aws.js
│   └── data/                 # Seed data for campus modules
│
└── .env.example              # Frontend env template
```

---

## API Overview

| Route | Description |
|-------|-------------|
| `GET /api/health` | Server status, DB mode, user count |
| `POST /api/auth/register` | Signup |
| `POST /api/auth/login` | Login |
| `POST /api/auth/firebase` | Google user sync |
| `GET /api/auth/me` | Current user profile |
| `GET /api/dashboard/brief` | Daily brief & overview |
| `GET /api/notifications` | Alerts list |
| `GET /api/events` | Events + registrations |
| `POST /api/ai/chat` | Gemini / CampusGPT chat |
| `GET /api/ai/status` | Gemini config status |
| `POST /api/aws/upload` | S3 file upload |
| `POST /api/aws/email` | SES email send |

Full API docs: run backend and open `http://localhost:5002/api`

---

## Getting Started (Local)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (recommended)
- Firebase project (for Google Sign-In)
- Optional: AWS credentials, Gemini API key

### 1. Clone & install

```bash
git clone <your-repo-url>
cd amazon

# Frontend
npm install

# Backend
cd backend && npm install && cd ..
```

### 2. Environment variables

**Root `.env`** (copy from `.env.example`):
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

**`backend/.env`** (copy from `backend/.env.example`):
```env
PORT=5002
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/campusflow

# Optional
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-flash
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=campusflow-uploads
AWS_SES_FROM_EMAIL=noreply@yourdomain.com
```

### 3. Run locally

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
npm run dev
```

- Frontend: **http://localhost:5173**
- Backend: **http://localhost:5002**
- Health check: **http://localhost:5002/api/health**

> Vite proxies `/api` → `localhost:5002` automatically.

### 4. Verify database

After backend starts, check console:
```
MongoDB connected: campusflow
Auth mode: MongoDB Atlas — signup/login saves to database
```

If MongoDB fails, app uses local file fallback (`backend/data/localUsers.json`) for dev only.

---

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| `demo@campusflow.edu` | `demo1234` | Student |
| `faculty@campusflow.edu` | `demo1234` | Faculty |
| `admin@campusflow.edu` | `demo1234` | Admin |

---

## Integrations Summary

| Service | Purpose | Config |
|---------|---------|--------|
| **MongoDB Atlas** | User accounts, uploads metadata | `MONGO_URI` |
| **Firebase** | Google Sign-In + Firestore profiles | `VITE_FIREBASE_*` |
| **Google Gemini** | AI Assistant chat & summaries | `GEMINI_API_KEY` |
| **AWS S3** | Resume, profile, document storage | `AWS_*` |
| **AWS SES** | Registration & welcome emails | `AWS_SES_FROM_EMAIL` |
| **JWT** | Session tokens for API auth | `JWT_SECRET` |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend (Vite) |
| `npm run dev:backend` | Start backend from root |
| `npm run build` | Production build |
| `cd backend && npm run dev` | Backend with nodemon |
| `cd backend && npm start` | Backend production mode |

---

## Team / Hackathon

Built for **Amazon HackOn** — demonstrating cloud integrations (AWS, MongoDB, Firebase, Gemini) in a real campus management product.

---

## License

MIT — free to use for hackathon and learning purposes.
