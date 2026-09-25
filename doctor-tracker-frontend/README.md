# Doctor Tracker — Frontend Client (Next.js)

Production-ready Next.js client for the Doctor Tracker healthcare management platform. Consumes the backend REST API over HTTP with TanStack Query, Axios, Tailwind CSS, and TypeScript.

---

## 1. Tech Stack

- **Framework:** Next.js (App Router, v16.x)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **State & Data Fetching:** TanStack Query (React Query v5) + React Context
- **HTTP Client:** Axios (configured with credentials and 401 redirect interceptors)
- **Forms & Validation:** React Hook Form + Zod
- **Icons & Visuals:** Lucide React
- **Data Visualization:** Recharts

---

## 2. Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local` and set your backend API URL:
```bash
cp .env.local.example .env.local
```

Default contents:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### 3. Run the Development Server
```bash
npm run dev
```

The application runs on `http://localhost:3000`.

---

## 3. Architecture & Folder Structure

```
src/
├── app/
│   ├── (auth)/login/page.tsx        # Login authentication view
│   ├── (dashboard)/                 # Protected shell with shared Sidebar and Navbar
│   │   ├── dashboard/page.tsx       # Analytics & metric charts
│   │   ├── doctors/                 # Doctor directory & detail views
│   │   └── patients/                # Patient directory & records
│   └── layout.tsx                   # Root layout with QueryProvider & global fonts
├── components/
│   ├── common/                      # Reusable UI primitives (Pagination, Spinners, Dialogs)
│   ├── layout/                      # Sidebar, Navbar, ProtectedRoute
│   ├── doctors/                     # Doctor tables, cards, filters, and forms
│   ├── patients/                    # Patient tables, filters, and forms
│   └── dashboard/                   # Metric summary cards & charts
├── lib/
│   ├── api/                         # Axios client & individual API endpoints (auth, doctors, patients, dashboard)
│   ├── hooks/                       # React Query query/mutation hooks
│   ├── context/                     # AuthContext provider
│   └── utils/                       # Query string builders & date formatters
├── providers/
│   └── QueryProvider.tsx            # TanStack Query client provider
└── types/                           # TypeScript interfaces matching backend responses
```
