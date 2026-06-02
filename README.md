# CONTRI — Splitwise Clone

A simplified Splitwise-inspired expense tracking app built with React, Bun, Express, Prisma, and PostgreSQL. Deployed on Vercel (frontend) and Render (backend).

## Live URLs

- **Frontend:** https://splitwise-clone-coral-xi.vercel.app
- **Backend:** https://splitwise-clone-aq0k.onrender.com
- **GitHub:** https://github.com/RjyavardhanSingh/splitwise-clone

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Bun, Express, Prisma ORM |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (7-day expiry), bcrypt |
| Email | Gmail API via googleapis |
| Deployment | Vercel (frontend), Render (backend) |

## Features

- Email/password registration and login
- Google OAuth sign-in
- Email verification with 6-digit code
- Forgot/reset password flow
- Create groups and invite members by email
- Add expenses with equal split among members
- Real-time balance calculation (who owes whom)
- Settle up between members
- Activity feed with expense history
- Dashboard with net balance across all groups
- Search groups and transactions
- Dark/light theme with persistent preference
- Responsive mobile-first design
- Expense category icons (meal, stay, transport, travel, outing, shopping, settlement, other)

## Setup Instructions

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- PostgreSQL database (Supabase free tier recommended)

### Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env: set DATABASE_URL, DIRECT_URL, JWT_SECRET, CLIENT_URL
bun install
bunx prisma generate
bunx prisma db push
bun index.js
```

The server starts on `http://localhost:4000`.

### Frontend Setup

```bash
cd client
cp .env.example .env
# Edit .env: set VITE_API_URL=http://localhost:4000/api
bun install
bun run dev
```

The client starts on `http://localhost:5173`.

### Environment Variables

**Backend `.env`**

```
DATABASE_URL=postgresql://user:password@host:6543/db?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:5432/db
JWT_SECRET=your_secret_key
PORT=4000
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token
```

**Frontend `.env`**

```
VITE_API_URL=http://localhost:4000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## AI Tool Used

**Model:** Claude (Anthropic) — Sonnet 4 via the opencode CLI tool

The AI acted as a junior engineer that asked detailed product and engineering questions before building. All context, decisions, and prompts are documented in [AI_CONTEXT.md](./AI_CONTEXT.md).

## Deliverables

| # | File/URL | Description |
|---|---|---|
| 1 | [Frontend URL](https://splitwise-clone-coral-xi.vercel.app) | Public deployed app |
| 2 | [GitHub Repository](https://github.com/RjyavardhanSingh/splitwise-clone) | Source code |
| 3 | [README.md](./README.md) | This file — setup instructions |
| 4 | [BUILD_PLAN.md](./BUILD_PLAN.md) | Build plan with research, scope, architecture, tradeoffs |
| 5 | [AI_CONTEXT.md](./AI_CONTEXT.md) | Full working context used to generate the app |
| 6 | Prompts | Documented in AI_CONTEXT.md §13 |
