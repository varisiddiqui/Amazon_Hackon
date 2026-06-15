# CampusFlow Backend

Express API with **MongoDB Atlas** for user authentication + hardcoded seed data for campus modules.

## Quick start

```bash
cd backend
npm install
cp .env.example .env   # add your MONGO_URI
npm run dev
```

Server runs at **http://localhost:5002**

## Environment variables

```env
PORT=5002
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/campusflow?appName=hackathon6

# AWS
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=campusflow-uploads
AWS_SES_FROM_EMAIL=noreply@yourdomain.com

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

## AWS Integration — `/api/aws`

Uses **Amazon S3** (file storage) and **Amazon SES** (email notifications).

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/status` | Check S3/SES configuration |
| POST | `/presign` | Get presigned URL for direct S3 upload |
| POST | `/upload` | Upload file (multipart) → S3 + MongoDB |
| POST | `/upload/resume` | Upload resume PDF → S3 + AI analysis |
| POST | `/upload/profile` | Upload profile photo → S3 |
| GET | `/files` | List user's uploaded files |
| GET | `/files/:id/download` | Presigned download URL |
| DELETE | `/files/:id` | Delete from S3 + DB |
| POST | `/email` | Send email via SES |
| POST | `/email/welcome` | Send welcome email |

**S3 folder structure:** `{category}/{userId}/{timestamp}-{filename}`

**Upload categories:** `resume`, `profile`, `document`, `event`, `assignment`

Event registration automatically sends SES confirmation email when configured.

### AWS Setup Steps

1. Create IAM user with `AmazonS3FullAccess` + `AmazonSESFullAccess`
2. Create S3 bucket (e.g. `campusflow-uploads`) in `ap-south-1`
3. Verify sender email in SES
4. Add credentials to `backend/.env`


| Email | Password | Role |
|-------|----------|------|
| demo@campusflow.edu | demo1234 | student |
| faculty@campusflow.edu | demo1234 | faculty |
| admin@campusflow.edu | demo1234 | admin |

All signups, guest logins, and Google demo logins are **saved to MongoDB** with role.

## Auth API — `/api/auth`

- `POST /register` — saves user to DB with bcrypt password
- `POST /login` — validates from DB
- `POST /guest` — creates/reuses guest user in DB
- `POST /google` — creates/reuses Google demo user in DB
- `GET /me` — current user from DB
- `PATCH /me` — update profile in DB
- `GET /users?role=student|faculty|admin` — **admin only**, role-wise user list

## User schema (MongoDB)

```
fullName, email, password (hashed), department, year,
role (student|faculty|admin), rollNumber, imageUrl,
isGuest, authProvider (local|guest|google)
```

### Dashboard — `/api/dashboard`
- `GET /brief` — daily brief + overview cards
- `GET /context` — full AI student context
- `GET /activities/:type` — assignments, classes, events, attendance, notices sections

### Student — `/api/student`
- `GET /assignments`, `/attendance`, `/notices`, `/reminders`, `/profile`
- `GET /notices/:id`

### Notifications — `/api/notifications`
- `GET /` — list (query: `type`, `status`)
- `PATCH /:id/read`, `PATCH /:id/dismiss`
- `POST /` — create notification

### Events — `/api/events`
- `GET /` — all events (query: `category`, `search`, `level`)
- `GET /registrations`
- `GET /:id` — event detail
- `POST /:id/register`
- `GET /ai?q=`

### Timetable — `/api/timetable`
- `GET /`, `/next-class`, `/study-recommendation?subject=`
- `POST /personal-events`

### Hostel — `/api/hostel`
- `GET /`, `POST /complaints`, `POST /leave-requests`, `GET /ai?q=`

### Transport — `/api/transport`
- `GET /`, `GET /ai?q=`

### Placement — `/api/placement`
- `GET /`, `GET /roadmap/:company`, `POST /resume/analyze`, `GET /ai?q=`

### Settings — `/api/settings`
- `GET /`, `PUT /`

### AI — `/api/ai`

Uses **Google Gemini API** (`@google/generative-ai`) when `GEMINI_API_KEY` is set; falls back to rule-based CampusGPT.

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

Get a key: [Google AI Studio](https://aistudio.google.com/apikey)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/status` | Gemini config status (model, configured) |
| POST | `/chat` | `{ question }` → Gemini or CampusGPT response with `meta.poweredBy` |
| POST | `/tools/notice-summary` | Summarize notice via Gemini when configured |
| POST | `/tools/resume`, `/tools/study-plan`, `/tools/attendance-advice` | AI tools |
| GET | `/tools/placement-roadmap`, `/tools/event-recommendations`, `/tools/reminders`, `/notices` | AI tools |

**Gemini integration code:** `backend/services/geminiService.js` — calls `GoogleGenerativeAI` with campus student context.

Response includes metadata when Gemini is used:

```json
{
  "meta": {
    "poweredBy": "Google Gemini",
    "provider": "google-gemini",
    "model": "gemini-1.5-flash",
    "api": "Google Generative AI"
  }
}
```

## Auth header

```
Authorization: Bearer <token>
```

Login/register responses include `{ ok, user, token }`.

## Frontend integration (later)

Frontend currently uses local mock data. When ready to connect, add to `vite.config.js`:

```js
server: {
  proxy: { "/api": "http://localhost:5002" }
}
```

Then replace `src/data/*` calls with fetch to these endpoints.

## Project structure

```
backend/
├── data/           # Hardcoded seed (mirrors src/data/)
├── services/       # AI logic (mirrors src/services/aiService.js)
├── store/          # In-memory user state
├── routes/         # Express route handlers
├── middleware/     # JWT auth
└── server.js       # Entry point
```
