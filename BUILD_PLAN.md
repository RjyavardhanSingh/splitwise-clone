# BUILD_PLAN.md — Splitwise Clone (3-Day Internship Assignment)

---

## 1. Product Research

### How I Studied Splitwise

- Used the Splitwise web app and mobile app as an end user across multiple sessions
- Mapped every screen, modal, and state transition manually
- Studied the public Splitwise API documentation to understand data shapes
- Read user reviews on the App Store and Play Store to understand pain points and core value
- Identified the "jobs to be done": track who owes what, reduce awkward money conversations, settle up easily

### What I Learned

Splitwise's core value proposition is **reducing social friction around shared money**. The product is not really about math — it's about trust, transparency, and making it easy to ask a friend for money without it feeling like a demand.

Key observations:
- The app revolves around **groups** (trips, apartments, households) and **friendships** (1:1 expenses)
- Every expense is either split equally, by exact amounts, by percentages, or by shares — but **equal split covers ~80% of real-world use cases**
- Balances are shown as net amounts (you owe X, or X owes you), not raw transactions
- Settlement ("Settle Up") is a separate flow from adding expenses
- The activity feed is crucial — it creates accountability without confrontation
- Email notifications replace the need for users to be simultaneously online
- Currency, recurring expenses, receipts, and integrations are power features, not core

### Workflows Identified

1. **User Registration & Login** → Create account, log in, stay authenticated
2. **Create a Group** → Name it, add members by email
3. **Add an Expense to a Group** → Title, amount, paid by whom, split among whom
4. **View Group Balances** → See who owes what in a group
5. **View Overall Dashboard** → Net balance across all groups and friends
6. **Settle Up** → Record that one person paid another to zero out a balance
7. **Activity Feed** → Chronological list of all expenses and settlements
8. **Add a Friend (1:1)** → Track expenses outside of a group

### Product Assumptions Made

- Users are identified by email address
- A "group" is the primary unit of shared expenses; 1:1 expenses are treated as a group of 2
- Default split is always equal among selected participants
- One currency (INR / ₹) — no multi-currency support in v1
- No recurring expenses
- No receipt scanning
- Balances are calculated in real-time from expense records (no separate ledger table)
- Settling up creates a special expense record tagged as a settlement
- No social features (comments, emoji reactions) in v1

---

## 2. Final Scope

### What I Chose to Build (MVP)

| Feature | Included |
|---|---|
| User registration & login (email + password) | ✅ |
| JWT-based auth with protected routes | ✅ |
| Create groups, add members by email | ✅ |
| Add expense to group (equal split only) | ✅ |
| View group detail with member balances | ✅ |
| Dashboard showing net balance across groups | ✅ |
| Settle up (record a payment between two users) | ✅ |
| Activity feed per group | ✅ |
| Responsive UI (mobile-first) | ✅ |

### What I Chose NOT to Build

| Feature | Reason Excluded |
|---|---|
| Unequal splits (by %, exact, shares) | Adds significant UI + logic complexity; equal split covers 80% of cases |
| Email notifications | Requires email service (SendGrid etc.); out of scope for 3-day deploy |
| Multi-currency | High complexity, low immediate value |
| Receipt upload/scanning | Requires file storage (S3); deferred |
| Friend list outside of groups | Groups cover the core use case; 1:1 as a 2-person group is sufficient |
| Real-time updates (WebSockets) | Polling or manual refresh acceptable for MVP |
| Recurring expenses | Low priority for demo |
| Mobile app (React Native) | Web app with responsive design is sufficient |
| OAuth (Google/Facebook login) | Email/password is sufficient for evaluation |
| Admin roles within groups | All members are equal in v1 |

### Why This Is Achievable in 3 Days

- Day 1: Auth system, database schema, backend API skeleton (users, groups, expenses endpoints)
- Day 2: Frontend scaffolding, all screens connected to API, balance calculation logic
- Day 3: Settle up flow, activity feed, UI polish, deployment, documentation

The scope is deliberately constrained to a **read/write CRUD app with one non-trivial calculation** (net balance). No real-time, no file storage, no third-party integrations. This is a well-understood problem with a well-understood solution that can be built confidently in the timeframe.

---

## 3. Architecture

### Tech Stack

| Layer | Choice | Rationale |
|---|---|---|---|
| Frontend | React + Vite | Fast setup, component model suits the UI, wide ecosystem |
| Styling | Tailwind CSS | Rapid UI development, no context-switching to CSS files |
| State Management | React Context + useState | Sufficient for this scale; Redux is overkill |
| Backend | Bun + Express | Bun replaces Node.js for faster runtime; user has Bun installed |
| Database | PostgreSQL (via Supabase) | Relational model fits expenses/groups; Supabase gives free hosted DB + auth option |
| ORM | Prisma | Type-safe queries, auto-generated migrations, great DX |
| Authentication | JWT (jsonwebtoken) + bcrypt | Stateless, no session store needed |
| Deployment — Frontend | Vercel | Free tier, zero-config for React/Vite |
| Deployment — Backend | Railway | Free tier, simple Express deploy, env var management |
| Version Control | GitHub | Required by assignment |

### Database Schema

```sql
-- Users
users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,           -- bcrypt hash
  created_at  TIMESTAMPTZ DEFAULT NOW()
)

-- Groups
groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
)

-- Group Members (many-to-many)
group_members (
  group_id    UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
)

-- Expenses
expenses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id     UUID REFERENCES groups(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  amount       DECIMAL(10,2) NOT NULL,
  paid_by      UUID REFERENCES users(id),
  is_settlement BOOLEAN DEFAULT FALSE,
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW()
)

-- Expense Splits
expense_splits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id  UUID REFERENCES expenses(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id),
  amount      DECIMAL(10,2) NOT NULL    -- amount this user owes for this expense
)
```

**Balance Calculation Logic:**
For a given group, for each pair of users (A, B):
- Net = SUM(splits where user=B AND paid_by=A) - SUM(splits where user=A AND paid_by=B)
- If Net > 0: B owes A that amount
- Settlements are stored as expenses with `is_settlement=TRUE` and a single split

### API Design

**Auth**
```
POST /api/auth/register    { name, email, password }  → { token, user }
POST /api/auth/login       { email, password }         → { token, user }
GET  /api/auth/me          (Bearer token)              → { user }
```

**Groups**
```
GET  /api/groups                     → list groups for current user
POST /api/groups                     { name, memberEmails[] } → group
GET  /api/groups/:id                 → group detail + members
POST /api/groups/:id/members         { email } → added member
```

**Expenses**
```
GET  /api/groups/:groupId/expenses          → list expenses + splits
POST /api/groups/:groupId/expenses          { title, amount, paidBy, splitAmong[] } → expense
DELETE /api/groups/:groupId/expenses/:id   → soft delete (or hard delete for MVP)
```

**Settlements**
```
POST /api/groups/:groupId/settle     { payerId, payeeId, amount } → settlement expense
```

**Balances**
```
GET  /api/groups/:groupId/balances   → [{ userId, name, netBalance }]
GET  /api/dashboard/balances         → overall net balance for current user
```

All endpoints except `/auth/register` and `/auth/login` require `Authorization: Bearer <token>` header.

### Frontend Structure

```
src/
├── main.jsx
├── App.jsx                    # Router setup
├── context/
│   └── AuthContext.jsx        # User state, login/logout
├── api/
│   ├── client.js              # Axios instance with auth interceptor
│   ├── auth.api.js            # register(), login(), getMe()
│   ├── groups.api.js          # getGroups(), getGroup(), createGroup()
│   ├── expenses.api.js        # getExpenses(), addExpense(), deleteExpense()
│   ├── balances.api.js        # getGroupBalances(), getDashboard()
│   └── settlements.api.js     # settleUp()
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx          # Net balance + groups list
│   ├── GroupDetail.jsx        # Expenses + balances for one group
│   └── CreateGroup.jsx
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── PageWrapper.jsx
│   ├── auth/
│   │   └── ProtectedRoute.jsx
│   ├── dashboard/
│   │   ├── BalanceBanner.jsx
│   │   └── GroupCard.jsx
│   ├── group/
│   │   ├── MemberList.jsx
│   │   ├── BalanceSummary.jsx
│   │   ├── ActivityFeed.jsx
│   │   └── ExpenseItem.jsx
│   └── modals/
│       ├── AddExpenseModal.jsx
│       └── SettleUpModal.jsx
└── utils/
    ├── formatCurrency.js
    └── formatDate.js
```

**Routing:**
```
/               → redirect to /dashboard if logged in, else /login
/login          → Login page
/register       → Register page
/dashboard      → Main dashboard (protected)
/groups/new     → Create group (protected)
/groups/:id     → Group detail (protected)
```

### Deployment Approach

1. **Backend** → Push to GitHub → Connect to Railway → Set env vars (`DATABASE_URL`, `JWT_SECRET`) → Auto-deploy on push to `main`
2. **Frontend** → Push to GitHub → Connect to Vercel → Set `VITE_API_URL` env var → Auto-deploy on push to `main`
3. **Database** → Supabase free tier PostgreSQL → Run Prisma migrations via `prisma migrate deploy`
4. **CORS** → Express configured to allow Vercel domain
5. **Health check** → `GET /api/health` returns `{ status: "ok" }`

---

## 4. AI Collaboration Process

### How I Instructed the AI

I used the required initial prompt from the assignment verbatim, positioning the AI as a **junior engineer who should not assume requirements**. I explicitly told it:
- Do not jump to implementation
- Ask questions first across all listed domains
- Update `AI_CONTEXT.md` after each answer
- Produce a build plan only after sufficient questioning

I treated the AI like a new hire on their first week — capable, but needing direction and context before they can execute.

### Questions the AI Asked

The AI conducted a structured interview covering:

**Product & Scope:**
- What is the core user pain point you want to solve?
- Should groups support recurring members or are they ad-hoc?
- Do you need a friends list separate from groups, or are groups sufficient?
- What split types do you need beyond equal split?
- How should deleting an expense work — soft delete or hard?
- Should users be able to edit expenses after creation?

**Data Model:**
- Should balances be pre-computed (stored) or derived from expense records at query time?
- How should settlements be modeled — as a special expense or a separate table?
- What is the source of truth for "who is in a group"?

**Authentication:**
- Email/password or OAuth?
- Should JWT tokens expire? If so, how long?
- Do you need a "forgot password" flow?

**Engineering:**
- Monorepo or separate repos for frontend/backend?
- REST or GraphQL?
- Which database — relational or NoSQL?
- Do you need real-time balance updates?

**Deployment:**
- Any preference on hosting platform?
- Do you have existing accounts on Vercel/Railway/Heroku?
- Is a free-tier deployment acceptable?

### How I Answered

I answered each question with clear, scoped decisions:
- Equal split only for MVP
- No edit/delete of expenses in v1 (simplifies undo logic)
- Balances derived at query time (no cache table needed at this scale)
- Settlements as a flagged expense row (reuses the same table and calculation logic)
- JWT with 7-day expiry; no refresh tokens for MVP
- No forgot-password flow
- Separate repos or monorepo with `/client` and `/server` folders
- REST over GraphQL (simpler for this scale, faster to build)
- PostgreSQL (relational model is a natural fit)
- No real-time; manual refresh is fine for MVP
- Vercel + Railway for deployment; free tier is fine

### How the Plan Evolved

- Initially considered including unequal splits — removed after estimating the additional UI complexity (3 different split modes × validation × edge cases) would consume most of Day 2
- Initially planned a separate `friends` table — simplified to "groups with 2 members" to reduce schema complexity
- Initially planned `soft delete` for expenses — moved to hard delete to avoid filtering complexity in balance calculations
- Initially planned Node.js — switched to Bun at implementation time (user had Bun installed; faster runtime, built-in `--watch` replaces nodemon)

### How AI_CONTEXT.md Was Maintained

- After each Q&A session, I prompted the AI to append the new decisions to `AI_CONTEXT.md`
- After each implementation phase (auth complete, groups complete, etc.), I prompted: *"Update AI_CONTEXT.md to reflect what was built, any deviations from the plan, and the current state of the app"*
- Before each new coding session, I pasted `AI_CONTEXT.md` into the AI context window to restore full project state
- The file served as a **living spec** — not a one-time document

---

## 5. Tradeoffs

### What I Simplified

| Decision | Simplification | Impact |
|---|---|---|
| Split types | Equal only | Can't do "Alice pays 60%, Bob pays 40%" — covers 80% of real use |
| Balance calculation | Derived at query time | Slightly slower at large scale, but no sync issues |
| Settlements | Stored as expense rows | Reuses existing logic; slightly less semantically clean |
| Auth | JWT only, no refresh token | Token expires after 7 days; user must re-login |
| Groups | No roles/permissions | Any member can add expenses; no "admin" concept |

### What I Hardcoded

- Currency set to INR (₹) — no currency selection UI
- Split is always equal among all selected participants — no custom amount input
- JWT expiry set to 7 days — not configurable
- Maximum group members: no enforced limit (trusting DB to handle it)

### What I Avoided

- File uploads (receipt photos) — requires object storage setup
- Email notifications — requires email service API key and template management
- WebSocket / real-time sync — adds infrastructure complexity
- Multi-currency conversion — requires exchange rate API
- Audit log / expense history — useful but not core
- Mobile app — responsive web covers the demo use case
- Pagination on expense lists — assumed < 100 expenses per group for MVP

### What I Would Improve With More Time

1. **Unequal splits** — Add split-by-percentage and split-by-exact-amount modes; this is the most important missing feature for real-world use
2. **Edit & delete expenses** — With soft delete and recalculation; important for correcting mistakes
3. **Email notifications** — "You were added to a group", "New expense added" nudges
4. **Optimistic UI updates** — Refresh-on-action feels sluggish; React Query + optimistic mutations would fix this
5. **Simplify debt (debt minimization)** — Splitwise's key algorithm that consolidates multiple debts into minimum transactions
6. **Mobile app** — React Native sharing API logic with the existing backend
7. **Recurring expenses** — Monthly rent, subscriptions
8. **Export to CSV** — Simple but highly requested by users

---

## Final Note

This build is deliberately scoped to demonstrate **product thinking, architectural clarity, and AI-directed development** — not feature completeness. Every cut was intentional and documented. The goal was a working, deployed app that a real user could use to split a dinner bill, not a Splitwise feature-for-feature clone.

The AI_CONTEXT.md file that accompanied this build is detailed enough that another developer — or the same AI in a fresh session — could read it and produce a functionally equivalent application.
