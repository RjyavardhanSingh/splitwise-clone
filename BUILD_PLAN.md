# BUILD_PLAN.md — Splitwise Clone (CONTRI)

## 1. Product Research

### How Splitwise Was Studied

The product was studied by:
- Using the Splitwise web app and mobile app to understand core workflows
- Reading Splitwise's help centre and blog posts about their balance calculation algorithm
- Analysing the UI structure: dashboard → group → expense → settle up
- Identifying the core value proposition: reducing social friction around shared expenses

### Key Workflows Identified

1. **Registration & Onboarding** — User signs up, lands on empty dashboard
2. **Create Group** — User names a group, adds members by email
3. **Add Expense** — User enters title, amount, who paid, who shares → split equally
4. **View Balances** — Group page shows per-member net balances
5. **Settle Up** — User records a payment to clear a debt
6. **Activity Feed** — Chronological history of all expenses and settlements

### Product Assumptions Made

- Equal split covers 80%+ of real-world use cases
- Groups of 2 handle 1:1 expenses (no separate friends model needed)
- Manual page refresh is acceptable (no real-time sync needed)
- < 100 expenses per group for demo scale (no pagination needed)
- Mobile-first is critical (users check after meals/trips on phone)
- INR single currency is sufficient for an Indian-market MVP

## 2. Final Scope

### Built (MVP)

| Area | What's Included |
|---|---|
| Auth | Email/password registration + login, JWT auth, Google OAuth, email verification, forgot/reset password |
| Groups | Create with name + member emails, list on dashboard, detail page with members |
| Expenses | Add with title/amount/payer/split among members, equal split only, delete by creator |
| Balances | Per-group net balances, dashboard net balance across all groups |
| Settlements | Record payment between two members, appears in activity feed |
| Activity Feed | Chronological list of expenses + settlements per group |
| UI | Dark/light theme, sidebar navigation, search, responsive mobile-first, expense category icons |
| Email | Via Gmail API (works on Render free tier) |
| Deployment | Vercel (frontend) + Render (backend) + Supabase (database) |

### Out of Scope

| Feature | Reason Deferred |
|---|---|
| Unequal splits | Significant UI + logic complexity; not needed for MVP |
| Edit expense | Recalculation edge cases; delete + re-add works |
| Multi-currency | Requires exchange rate API; INR only for Indian market |
| Receipt upload | Needs cloud object storage |
| Comments | Social feature; not core to balance tracking |
| Debt simplification | Complex graph algorithm; nice-to-have |
| Pagination | Unnecessary at demo scale (< 100 expenses/group) |
| Real-time updates | WebSockets add infrastructure complexity |
| Group member removal | Low priority for MVP |
| Email notifications | Nice-to-have; users can check the app |

### Why 3 Days Is Achievable

- Equal split only removes 80% of the UI/logic complexity
- No real-time, no pagination, no multi-currency dramatically reduces scope
- Prisma provides instant CRUD + schema management (saves ~1 day vs raw SQL)
- Vite + Tailwind gives rapid frontend iteration
- Bun replaces Node.js — no build config, faster installs

## 3. Architecture

### Tech Stack

```
Frontend (Vercel)          Backend (Render)         Database (Supabase)
─────────────────────     ──────────────────       ─────────────────
React 18 + Vite    ──→    Bun + Express      ──→   PostgreSQL
Tailwind CSS              Prisma ORM
React Router v6           JWT (jsonwebtoken)
Axios                     bcryptjs
                          googleapis (Gmail API)
```

### Database Schema (6 tables)

| Table | Key Columns | Purpose |
|---|---|---|
| User | id, name, email, password, createdAt | User accounts |
| Group | id, name, createdAt, createdById | Expense groups |
| GroupMember | groupId, userId, joinedAt | M:N membership (composite PK) |
| Expense | id, title, amount, isSettlement, groupId, paidById, createdById | Expenses + settlements |
| ExpenseSplit | id, amount, expenseId, userId | Per-user share of expense |
| GroupInvite | id, email, groupId, token, accepted, expiresAt | Email-based invites |

### Key API Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | No | Register |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/groups | Yes | List user's groups |
| POST | /api/groups | Yes | Create group |
| GET | /api/groups/:id | Yes | Group detail |
| GET | /api/groups/:id/expenses | Yes | Group expenses |
| POST | /api/groups/:id/expenses | Yes | Add expense |
| DELETE | /api/groups/:id/expenses/:eid | Yes | Delete expense |
| GET | /api/groups/:id/balances | Yes | Group balances |
| POST | /api/groups/:id/settle | Yes | Settle up |
| GET | /api/dashboard | Yes | Dashboard data |

### Frontend Structure (9 pages, ~15 components)

```
Pages:
  Landing, Login, Register, ForgotPassword, ResetPassword, VerifyEmail
  Dashboard, CreateGroup, GroupDetail
  GroupsPage, TransactionsPage, SettlementsPage, AnalyticsPage

Components:
  Layout: AppLayout, Sidebar, Navbar, Footer
  Group: MemberList, BalanceSummary, ActivityFeed, ExpenseItem, GroupCard, BalanceBanner
  Modals: AddExpenseModal, SettleUpModal, SettingsModal
```

### Deployment Approach

- **Frontend:** Vercel — Git push auto-deploys; SPA rewrites via `vercel.json`
- **Backend:** Render — Git push auto-deploys; `bun start`
- **Database:** Supabase PostgreSQL with connection pooler
- **CI:** None — manual push + auto-deploy on Render/Vercel

## 4. AI Collaboration Process

### How the AI Was Instructed

The initial prompt instructed the AI to:
1. Not assume requirements — ask detailed questions first
2. Maintain AI_CONTEXT.md as the source of truth throughout the build
3. Produce a build plan only after all questions were answered
4. Update AI_CONTEXT.md for every change during implementation

### Key Questions the AI Asked

| Category | Question | Decision |
|---|---|---|
| Scope | Split types? | Equal only |
| Scope | Edit/delete? | Hard delete, no edit |
| Data | Balances stored or derived? | Derived at query time |
| Data | Settlements as separate table or flagged? | Flagged expense (`is_settlement`) |
| Auth | OAuth or email/password? | Both (added Google OAuth later) |
| Auth | Refresh tokens? | No. 7-day JWT |
| UI | Screens needed? | Login, Register, Dashboard, GroupDetail, CreateGroup |
| Engineering | REST or GraphQL? | REST |
| Engineering | Monorepo or separate? | Monorepo (`/client`, `/server`) |
| Deployment | Hosting? | Vercel + Render + Supabase |

### How the Plan Evolved

- Started with bare MVP (5 pages, equal split, no email)
- Added Google OAuth, email verification, forgot/reset password during build
- Added sidebar navigation, dark/light theme, search after core functionality was solid
- Expanded from 5 pages to 13 pages with additional views (Groups, Transactions, Settlements, Analytics)
- Redesigned GroupDetail with professional layout after user feedback
- Migrated from nodemailer/SMTP → Resend → SendGrid → Gmail API (Render blocks SMTP)

### AI_CONTEXT.md Maintenance

AI_CONTEXT.md was continuously updated:
- Before code: product understanding, scope, user stories, decisions
- During code: schema changes, API changes, design decisions
- After code: deployment details, bugs fixed, known limitations
- It now contains ~1200 lines covering the entire build process

## 5. Tradeoffs

### What Was Simplified

| Simplification | Impact |
|---|---|
| Equal split only | Cannot handle percentage/exact splits; covers ~80% of cases |
| No debt simplification | Shows pairwise debts instead of optimized chain |
| Hard deletes (no soft) | No audit trail, no recovery |
| No pagination | Degrades beyond 100 expenses |
| No rate limiting | Vulnerable to abuse at scale |
| JWT in localStorage | Vulnerable to XSS; httpOnly cookie is safer |

### What Was Hardcoded

| Value | Where | Ideal |
|---|---|---|
| Currency symbol ₹ | formatCurrency.js | User-preference or per-group |
| JWT expiry 7 days | auth service | Configurable |
| Equal split | expense service | Multiple split algorithms |
| Connection timeout 5s | Gmail API | Configurable per environment |

### What Was Avoided

| Feature | Reason |
|---|---|
| Optimistic UI updates | Would need React Query; significant setup |
| WebSockets | Infrastructure complexity; polling fine for demo |
| SMTP email | Blocked on Render free tier; switched to Gmail API |
| CSS framework (shadcn, MUI) | Tailwind alone keeps bundle small; custom design is unique |
| State management (Redux, Zustand) | React context + local state sufficient for this scale |

### What Would Improve With More Time

1. **Unequal splits** — percentage/exact amount split UI
2. **Edit/delete expense** — with full recalculation
3. **Debt simplification** — minimum-transaction settlement algorithm
4. **Group member removal** — with balance settlement check
5. **Pagination** — for groups with 100+ expenses
6. **Email notifications** — via background job queue
7. **React Query** — proper loading states, caching, optimistic updates
8. **Rate limiting** — express-rate-limit or similar
9. **httpOnly cookies** — instead of localStorage for JWT
10. **Unit tests** — for balance calculation and API endpoints
