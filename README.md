# 💸 Xpense — Full-Stack Expense Tracker

A production-ready expense tracker with **React.js** frontend, **Node.js + Express** backend, and **MongoDB** database.

---

## 🚀 Features

| Feature | Details |
|---------|---------|
| **Auth** | JWT register/login, bcrypt hashing, token refresh, change password |
| **CRUD** | Add, edit, delete expenses with full form validation |
| **Dashboard** | Total spend, monthly stats, month-over-month %, top category |
| **Charts** | Donut (by category) + Bar (monthly trend) via Chart.js |
| **Search** | Full-text search on title + note |
| **Filter** | Filter by category, date range, sort by date/amount/title |
| **History** | Grouped by month with running totals |
| **Pagination** | Server-side, configurable page size |
| **CSV Export** | One-click export of all expenses |
| **Profile** | Edit name/currency, change password |
| **Dark Mode** | Toggle, persisted to localStorage |
| **Responsive** | Desktop + mobile sidebar |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6, Chart.js, Axios, react-hot-toast |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose (ODM) |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Validation** | express-validator (backend), custom hooks (frontend) |
| **Styling** | Pure CSS with CSS variables — no UI framework |

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** 18+
- **MongoDB** — local install or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)

---

### 1 — Clone

```bash
git clone <your-repo>
cd xpense
```

---

### 2 — Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit **`.env`**:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/xpense
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

> **Atlas example:**
> `MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/xpense?retryWrites=true&w=majority`

```bash
# Start dev server (auto-restarts on save)
npm run dev

# Seed demo data (optional)
npm run seed
# → Login: demo@xpense.app / demo1234
```

API runs at **http://localhost:5000**

---

### 3 — Frontend

```bash
cd ../frontend
npm install
cp .env.example .env   # REACT_APP_API_URL=http://localhost:5000/api
npm start
```

App opens at **http://localhost:3000**

---

## 📡 REST API Reference

### Auth  (`/api/auth`)

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/register` | — | `{name, email, password}` | Register |
| POST | `/login` | — | `{email, password}` | Login → JWT |
| GET | `/me` | ✅ | — | Get current user |
| PUT | `/profile` | ✅ | `{name, currency}` | Update profile |
| PUT | `/change-password` | ✅ | `{currentPassword, newPassword}` | Change password |

### Expenses  (`/api/expenses`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List with filters & pagination |
| GET | `/:id` | Get single expense |
| POST | `/` | Create expense |
| PUT | `/:id` | Update expense |
| DELETE | `/:id` | Delete expense |
| DELETE | `/bulk` | Bulk delete `{ids:[]}` |
| GET | `/export/csv` | Download CSV |

**Query params for `GET /`:**

| Param | Type | Example |
|-------|------|---------|
| `search` | string | `coffee` |
| `category` | string | `Food & Dining` |
| `startDate` | YYYY-MM-DD | `2024-01-01` |
| `endDate` | YYYY-MM-DD | `2024-12-31` |
| `sortBy` | `date\|amount\|title` | `amount` |
| `order` | `asc\|desc` | `desc` |
| `page` | number | `1` |
| `limit` | number (max 100) | `20` |

### Dashboard  (`/api/dashboard`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/summary` | All stats, charts data, recent + top expenses |

---

## 📁 Project Structure

```
xpense/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  ← MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js      ← register, login, profile, change-password
│   │   │   ├── expenseController.js   ← CRUD, bulk delete, CSV export
│   │   │   └── dashboardController.js ← aggregation pipeline
│   │   ├── middleware/
│   │   │   ├── auth.js                ← JWT protect middleware
│   │   │   └── validate.js            ← express-validator errors
│   │   ├── models/
│   │   │   ├── User.js                ← Mongoose schema, bcrypt hooks
│   │   │   └── Expense.js             ← Schema, indexes, text search
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── expenses.js
│   │   │   └── dashboard.js
│   │   ├── scripts/
│   │   │   └── seed.js                ← Demo data seeder
│   │   └── index.js                   ← Express app entry
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   └── AuthPage.jsx        ← Login / Register
    │   │   ├── charts/
    │   │   │   └── Charts.jsx          ← Donut + Bar charts
    │   │   ├── dashboard/
    │   │   │   └── DashboardPage.jsx   ← Stats + charts + recent
    │   │   ├── expenses/
    │   │   │   ├── ExpenseForm.jsx     ← Add/edit form with validation
    │   │   │   ├── ExpenseRow.jsx      ← Single row card
    │   │   │   ├── ExpensesPage.jsx    ← CRUD list + filters + pagination
    │   │   │   └── HistoryPage.jsx     ← Month-grouped history
    │   │   ├── layout/
    │   │   │   ├── AppLayout.jsx
    │   │   │   └── Sidebar.jsx
    │   │   ├── profile/
    │   │   │   └── ProfilePage.jsx     ← Edit profile + change password
    │   │   └── ui/
    │   │       └── Modal.jsx
    │   ├── context/
    │   │   ├── AuthContext.js          ← JWT auth state
    │   │   └── ThemeContext.js         ← Dark/light toggle
    │   ├── hooks/
    │   │   ├── useDashboard.js
    │   │   └── useExpenses.js          ← Includes CSV export
    │   ├── utils/
    │   │   ├── api.js                  ← Axios instance + interceptors
    │   │   └── helpers.js
    │   ├── App.js                      ← Routes
    │   ├── index.css                   ← All styles (CSS variables)
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## 🌐 Deployment

### Backend → Railway / Render

1. Set env vars: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=<frontend-url>`
2. Build: `npm install`
3. Start: `node src/index.js`

### Frontend → Vercel / Netlify

1. Set env: `REACT_APP_API_URL=https://your-backend.railway.app/api`
2. Build: `npm run build`
3. Output: `build/`

---

## 🧪 Demo Credentials

After running `npm run seed` in the backend:

```
Email:    demo@xpense.app
Password: demo1234
```

---

## 📄 License
MIT — free to use, modify, and deploy.
