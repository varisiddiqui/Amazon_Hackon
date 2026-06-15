# CampusFlow — Vercel Deploy Guide

Deploy **frontend + backend API** on one Vercel project.

---

## 1. Push code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. **Framework Preset:** Vite
4. **Root Directory:** `./` (project root)
5. Vercel auto-reads `vercel.json` — don't change build settings

---

## 3. Environment Variables (Vercel Dashboard → Settings → Environment Variables)

### Required (backend + auth)

| Variable | Example | Notes |
|----------|---------|-------|
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/campusflow` | **Must work from Vercel** — Atlas → Network Access → `0.0.0.0/0` |
| `JWT_SECRET` | `your-long-random-secret-key` | Change from dev default |

### Firebase (Google Sign-In) — frontend build

| Variable | Notes |
|----------|-------|
| `VITE_FIREBASE_API_KEY` | From Firebase Console |
| `VITE_FIREBASE_AUTH_DOMAIN` | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | |
| `VITE_FIREBASE_STORAGE_BUCKET` | |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | |
| `VITE_FIREBASE_APP_ID` | |

### Optional

| Variable | Notes |
|----------|-------|
| `CLIENT_ORIGIN` | Your Vercel URL e.g. `https://campusflow.vercel.app` |
| `GEMINI_API_KEY` | Google Gemini AI |
| `GEMINI_MODEL` | `gemini-1.5-flash` |
| `AWS_REGION` | S3 + SES |
| `AWS_ACCESS_KEY_ID` | |
| `AWS_SECRET_ACCESS_KEY` | |
| `AWS_S3_BUCKET` | |
| `AWS_SES_FROM_EMAIL` | |

> **Tip:** After first deploy, copy your live URL and set `CLIENT_ORIGIN` to it, then redeploy.

---

## 4. MongoDB Atlas (important)

1. [MongoDB Atlas](https://cloud.mongodb.com) → **Network Access**
2. Add **`0.0.0.0/0`** (Allow from anywhere) — required for Vercel serverless
3. Database: `campusflow` → Collection: `users`

Without this, signup/login will fail on production.

---

## 5. Firebase authorized domains

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your Vercel domain: `your-app.vercel.app`

---

## 6. Deploy

Click **Deploy** or push to `main` — Vercel auto-deploys.

After deploy, test:

```
https://YOUR-APP.vercel.app/api/health
```

Expected:

```json
{
  "ok": true,
  "mode": "mongodb",
  "platform": "vercel",
  "storage": "MongoDB Atlas (campusflow → users collection)"
}
```

---

## Project structure on Vercel

```
/                 → React frontend (dist/)
/api/index.js     → Express backend (serverless)
/backend/         → API logic
vercel.json       → Routing config
```

- `/api/*` → Express API
- All other routes → React SPA (`index.html`)

---

## Local development (unchanged)

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
npm run dev
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| 502 on `/api/*` | Check Vercel Function logs; ensure `MONGO_URI` is set |
| Login/signup fails | Atlas Network Access → `0.0.0.0/0` |
| Google login fails | Add Vercel domain in Firebase authorized domains |
| Blank page on refresh | `vercel.json` SPA rewrite — already configured |
| `mode: memory` on health | `MONGO_URI` missing or Atlas blocking Vercel IPs |

---

## Demo accounts (after seed)

| Email | Password |
|-------|----------|
| demo@campusflow.edu | demo1234 |
| admin@campusflow.edu | demo1234 |
