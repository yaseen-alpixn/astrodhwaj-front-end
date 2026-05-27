# Frontend Page Documentation — AstroDhwaj

This document describes the **frontend routes (URLs)**, the **roles (admin/user/astrologer)**, and for **each page**: its purpose, features, and (where visible in code) the UI inputs/outputs.

> Scope note: This repo uses Next.js App Router (`frontend/app/**`). Some pages/components were not opened during this first pass; therefore this document currently covers the parts verified via file reads, and lists remaining pages as **To-Document**.

---

## 0) Frontend Architecture Summary

### Layouts by role
- **Admin portal**
  - `frontend/app/Admin/layout.tsx` uses admin sidebar + admin footer.
- **User portal**
  - `frontend/app/User/layout.tsx` uses user sidebar + user header.
- **Astrologer portal**
  - `frontend/app/Astrologer/layout.tsx` uses astrologer sidebar + astrologer header.

### Shared auth entry selection
- `/login` renders role picker UI (component `WhoAreYou`).
- Admin login is separate at `/AdminLogin`.

---

## 1) Roles & what each role gets in UI

### Admin
- Admin pages are under `/Admin/**` and use `frontend/app/Admin/CommonComponents/DashboardSidebar.tsx`.
- Admin authentication is stored in `localStorage` via `frontend/app/Admin/api.ts`.

**Admin sidebar primary sections (URLs)**
- `/Admin/DashBoardOverview`
- `/Admin/UserManagement`
- `/Admin/AstrologerManagement`
- `/Admin/PricingAndCommition`
- `/Admin/WalletTransaction`
- `/Admin/ContentManagement`
- `/Admin/LiveSession`
- `/Admin/ReportAnalytics`
- `/Admin/SupportAndTicketSystem`
- `/Admin/RoleAndPermission`
- `/Admin/AdminSettings`

### User
- User pages are under `/user/**` and `/User/**`.
- The navigation is controlled by `frontend/app/User/DashboardSidebar.tsx`.

**User sidebar primary pages (URLs)**
- `/user/home`
- `/User/Astrologers`
- `/user/wallet`
- `/user/message`
- `/user/kundali`
- `/User/Numerology`
- `/User/TarotReading`
- `/User/ReikiHealing`
- `/User/Vastu`
- `/user/courses`
- `/User/Settings`

Notifications entry (via header)
- `/user/Notification`

### Astrologer
- Astrologer pages are under `/Astrologer/**`.
- Known routes (from file reads/search):
  - `/Astrologer/AstrologerHome`
  - `/Astrologer/Consultation`
  - `/Astrologer/LiveSessions`
  - `/Astrologer/Messages`
  - `/Astrologer/Profile`
  - `/Astrologer/Settings`
  - `/Astrologer/Wallet`

---

## 2) Auth & Session (verified)

### Admin Login
- **URL**: `/AdminLogin`
- **File**: `frontend/app/AdminLogin/page.tsx`

**Purpose**
Authenticate an admin with email/password.

**UI Features**
- Email + Password inputs
- Sign In button
- Error message on failure

**Inputs**
- `email`
- `password`

**API / Outputs**
- Calls `POST {NEXT_PUBLIC_API_BASE_URL}/auth/login`
- On success stores:
  - `admin_access_token`
  - `admin_refresh_token`
- Redirects to `/Admin/DashBoardOverview`

---

## 3) Admin Pages (verified in this pass)

### 3.1 `/Admin/DashBoardOverview`
- **File**: `frontend/app/Admin/DashBoardOverview/page.tsx`

**Purpose**
Admin overview dashboard showing KPIs, activity distribution, revenue overview, active sessions, and recent transactions.

**Features (UI sections)**
1. **Header**
   - Title: “Dashboard Overview”
   - “Last 7 Days” dropdown/button (UI-only in this file)
2. **Stats cards (5)**
   - Total Users
   - Astrologer (pending approvals shown in “change” area)
   - Live Streams (active sessions)
   - Revenue (revenue + growth)
   - Withdrawals (currently hardcoded to Pending/0 in this file)
3. **Activity chart**
   - “24-Hour Activity Distribution” with hourly bars computed from API activity.
4. **Revenue + Growth cards**
   - Revenue Overview: last 7 days list with progress bars
   - User Growth: monthly bars (6 months implied by UI text)
5. **Bottom cards**
   - Active Sessions list
   - Recent Transactions list

**Inputs (data dependencies / API outputs)**
- `GET /admin/dashboard` → populates `dashboard.stats`, `dashboard.charts.revenue_trend`, `dashboard.recent_transactions`
- `GET /admin/dashboard/activity` → populates `activity[]` (hourly sessions/viewers)
- `GET /admin/dashboard/active-sessions` → populates `sessions[]`
- `GET /admin/dashboard/user-growth` → populates `growth[]`

**Outputs**
- Rendered KPIs, charts (bar heights/progress widths), and lists.
- Navigation links created from UI:
  - Revenue/View All → `/Admin/WalletTransaction`
  - Manage Users → `/Admin/UserManagement`
  - Active Sessions/View All → `/Admin/LiveSession`

---

### 3.2 `/Admin/UserManagement`
- **File**: `frontend/app/Admin/UserManagement/page.tsx`

**Purpose**
Manage and monitor registered users.

**Features**
- Stats cards:
  - Total Users
  - Active Users
  - Blocked Users
  - Total Revenue
- Search bar: search users
- Status filter tabs: `All`, `Active`, `Blocked`, `Inactive`
- Users table with pagination
- Row actions:
  - View user details popup page: `/Admin/UserManagement/UserPopUp`
  - Block/unblock via PATCH action based on current status
- Export support via `ExportButton` component

**Inputs (UI controls)**
- Search text: `search`
- Status: `status`
- Pagination: `page`

**API calls (data dependencies)**
- `GET /admin/users/stats` → `statsData`
- `GET /admin/users?page={page}&limit=9&search={search}&status={status}` →
  - `users[]`
  - `meta` (page/total_pages)

**Outputs**
- Table rows show:
  - user id (masked tail via `slice(-6)`)
  - name/email/phone
  - wallet balance (formatted currency)
  - sessions/spent
  - status badge
  - join date
- Block/unblock updates local `users` list state after PATCH succeeds.

---

### 3.3 `/Admin/AstrologerManagement`
- **File**: `frontend/app/Admin/AstrologerManagement/page.tsx`

**Purpose**
Approve/reject astrologers and manage their listing.

**Features**
- Stats section showing counts for:
  - total
  - approved
  - pending
  - rejected (as inferred by `stats` state)
- Search + status filtering
- Table component `UserTable` displays astrologers and action buttons
- Row actions:
  - approve astrologer
  - reject astrologer
- Pagination

**Inputs**
- Search term: `search`
- Status: `status`
- Pagination: `page`

**API calls**
- `GET /admin/astrologers/stats` → sets `stats`
- `GET /admin/astrologers?page={page}&limit=9&search={search}&status={status}` → sets `items[]` + `meta`
- Action endpoints:
  - `PATCH /admin/astrologers/{id}/approve`
  - `PATCH /admin/astrologers/{id}/reject`

**Outputs**
- Renders astrologer list and updates local `approval_status` on action click.

---

## 4) Admin Pages (now expanded / checked)

During the repo scan, all Admin route shells were found, and the following pages were re-read to extract features/inputs/outputs.

### 4.1 `/Admin/PricingAndCommition`
- **File**: `frontend/app/Admin/PricingAndCommition/page.tsx`

**Purpose**
Admin commission / pricing analytics view.

**Features (UI blocks)**
- Header component: `Header` (`frontend/app/Admin/PricingAndCommition/Header.tsx`)
- Commission rates section: `CommissionRates`
- Revenue distribution: `RevenueDistribution`
- Revenue trend: `RevenueTrend`
- Top astrologers: `TopAstrologers`
- Projected revenue: `ProjectedRevenue`

**Inputs**
Not defined in this page file (the subcomponents typically load data).

**Outputs**
Rendered analytics blocks.

---

### 4.2 `/Admin/WalletTransaction`
- **File**: `frontend/app/Admin/WalletTransaction/page.tsx`

**Purpose**
Admin list/search of wallet and payment transactions.

**Features**
- Top header: `WalletHeader`
- Stats cards: `WalletStatsCards`
- Filters bar: `WalletFilters`
  - Search box
  - Type tabs
- Transaction table: `WalletTransactions`
- Pagination: `WalletPagination`

**Inputs (UI controls)**
- `search` (string)
- `type` (string) default `All`
- `page` (number)

**API calls (from `WalletTransactions.tsx`)**
- `GET /admin/transactions?page={page}&limit=9&search={search}&transaction_type={...}`
  - `typeMap` mapping:
    - `Recharge` → `recharge`
    - `Consultations` → `consultation`
    - `Withdrawals` → `withdrawal`
  - `All` passes through as-is.

**Outputs (table columns)**
- Order ID
- User/Details (from `metadata.user_name` or `metadata.details`)
- Amount
- Method
- Type (badge)
- Status (badge)
- Date & Time
- Actions (eye / more icons)

---

### 4.3 `/Admin/ContentManagement`
- **File**: `frontend/app/Admin/ContentManagement/page.tsx`

**Purpose**
Admin CRUD/read interface for content.

**Features**
- Content header: `ContentHeader`
- Filters + search: `ContentStatAndFilters`
  - search term
  - status filter
- Table: `ContentTable`
- Pagination: `ContentPagination`

**Inputs (UI controls)**
- `search` (string)
- `status` (string, default `All`)
- `page` (number)

**Outputs**
Content rows shown in `ContentTable`.

---

### 4.4 `/Admin/LiveSession`
- **File**: `frontend/app/Admin/LiveSession/page.tsx`

**Purpose**
Admin view for live sessions.

**Features**
- Header: `LiveSessionHeader`
- Stats: `LiveSessionStatsCards`
- Filters: `LiveSessionFilters`
- Live session list: `LiveSessionsList`
- Pagination: `LiveSessionPagination`

**Inputs / Outputs**
Not extracted at subcomponent level yet.

---

### 4.5 `/Admin/ReportAnalytics`
- **File**: `frontend/app/Admin/ReportAnalytics/page.tsx`

**Purpose**
Admin report analytics dashboard.

**Features**
- Header: `ReportAnalyticsHeader`
- Stats cards: `ReportAnalyticsStatsCards`
- Trend section: `ReportAnalyticsTrendSection`
- Category breakdown: `ReportAnalyticsCategory`
- Pagination: `ReportAnalyticsPagination`

**Inputs / Outputs**
Not extracted at subcomponent level yet.

---

### 4.6 `/Admin/SupportAndTicketSystem`
- **File**: `frontend/app/Admin/SupportAndTicketSystem/page.tsx`

**Purpose**
Admin ticket dashboard.

**Features**
- Header: `SupportAndTicketSystemHeader`
- Ticket stats: `SupportAndTicketSystemStatsCard`
- Ticket table: `SupportAndTicketSystemTicketTable`
- Ticket details modal exists at `SupportAndTicketSystem/TicketPopUp/*`

**Inputs / Outputs**
Not extracted at subcomponent level yet.

---

### 4.7 `/Admin/RoleAndPermission`
- **File**: `frontend/app/Admin/RoleAndPermission/page.tsx`

**Purpose**
Create/edit roles and manage permissions matrix.

**Features**
- Role header + add/edit entry UI: `RoleAndPermissionHeader`
- Role list: `RoleCards`
- Permission matrix: `PermissionMatrix`
- Role editor modal in this page file

**Inputs (UI controls)**
- Role fields (modal):
  - `name`
  - `slug`
  - `hierarchy_level`
  - `permissions[]` via checkboxes
- Permission matrix filter:
  - search by module/role

**API calls**
- `GET /admin/roles`
- `GET /admin/permissions` (expects `matrix: Record<module, string[]>`)
- Save role:
  - `POST /admin/roles` (create)
  - `PATCH /admin/roles/{id}` (update)
- Delete role:
  - `DELETE /admin/roles/{id}`
- Permission matrix loads itself via:
  - `GET /admin/permissions`

**Outputs**
- Roles rendered as cards
- Permission matrix table with:
  - module name
  - Super Admin Enabled/View
  - Finance Admin Enabled/View
  - Support Admin Enabled/View

---

### 4.8 `/Admin/AdminSettings`
- **File**: `frontend/app/Admin/AdminSettings/page.tsx`

**Purpose**
Admin platform settings.

**Features**
- Settings header: `AdminSettingsHeader`
- Platform settings component: `PlatformSettings`

**Inputs / Outputs**
Not extracted at subcomponent level yet.


---

## 5) User Pages (verified in this pass)

### 5.1 `/dashboard`
- **File**: `frontend/app/dashboard/page.tsx`

**Purpose**
Redirect `/dashboard` → `/user/home`.

**Inputs**
None.

**Outputs**
Browser redirect.

### 5.2 `/user/home`
- **File**: `frontend/app/User/home/page.tsx`

**Purpose**
User home dashboard with sections.

**Features (top-level composition)**
- `HoroscopeSection`
- `UserLiveSessions`
- `FeaturedAstrologer`
- Reiki/Vastu/services/trending modules (imported subcomponents in that file)

**Inputs/Outputs**
Not expanded yet (subcomponents not fully read in this pass).

---

### 5.3 `/user/Notification`
- Exists via header link.

**Status**
Not read in this pass; needs per-page documentation.

---

### 5.4 `/user/message`
- Page wrapper exists (`frontend/app/User/message/**`), and astrologer message page reuses it.

**Status**
Not read in this pass; needs per-page documentation.

---

## 6) User Pages (To-Document)

From `DashboardSidebar.tsx`, the following user routes exist but were not individually opened:
- `/User/Astrologers`
- `/user/wallet`
- `/user/kundali`
- `/User/Numerology`
- `/User/TarotReading`
- `/User/ReikiHealing`
- `/User/Vastu`
- `/user/courses`
- `/User/Settings`

Also:
- `/user/Notification`

---

## 7) Astrologer Pages (verified in this pass)

### 7.1 `/Astrologer`
- **File**: `frontend/app/Astrologer/page.tsx`

**Purpose**
Redirect `/Astrologer` → `Astrologer/AstrologerHome`.

---

### 7.2 `/Astrologer/AstrologerHome`
- **File**: `frontend/app/Astrologer/AstrologerHome/page.tsx`

**Purpose**
Astrologer landing/dashboard.

**Features**
- `AstrologerHeroSection`
- `ConsultationList`
- `EarningsBars`

**Inputs/Outputs**
Not expanded yet (subcomponents not fully read in this pass).

---

### 7.3 `/Astrologer/Messages`
- **File**: `frontend/app/Astrologer/Messages/page.tsx`

**Purpose**
Astrologer messaging page.

**Features**
- Reuses `@/app/User/message/MessagePageContent`

---

## 8) Astrologer Pages (To-Document)

These routes exist but were not individually opened in this first pass:
- `/Astrologer/Consultation`
- `/Astrologer/LiveSessions`
- `/Astrologer/Profile`
- `/Astrologer/Settings`
- `/Astrologer/Wallet`

---

## 9) What to do next to finish “each and every page”

To fully satisfy your requirement, the next iteration must:
1. Open every `page.tsx` under:
   - `frontend/app/Admin/**/page.tsx`
   - `frontend/app/User/**/page.tsx`
   - `frontend/app/Astrologer/**/page.tsx`
2. For each page, extract:
   - Features UI blocks
   - Filters/search/pagination controls
   - API endpoints hit (from `adminApi` or fetch)
   - Inputs (forms/fields)
   - Outputs (data rendering expectations)
3. Update this file (or split into multiple files) with complete coverage.

This first pass created the documentation skeleton and fully documented:
- AdminLogin
- Admin Dashboard Overview
- Admin User Management
- Admin Astrologer Management
- `/dashboard` redirect
- `/user/home` composition
- `/Astrologer` redirect
- `/Astrologer/AstrologerHome` composition
- `/Astrologer/Messages` reuse

---

## 10) Admin API Helper (verified reference)

Admin API helper is in `frontend/app/Admin/api.ts`.

**Exports used by pages**
- `adminApi(path, options?, retry?)`
  - adds `Authorization: Bearer <admin_access_token>`
  - auto-refreshes on 401 using `/auth/refresh`
  - clears session + redirects to `/AdminLogin` on persistent 401
- `setAdminSession`, `clearAdminSession`
- formatting helpers: `formatCurrency`, `formatDate`, `titleCase`

---

End of first documentation pass.

