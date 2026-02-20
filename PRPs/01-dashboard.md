# Dashboard Structure PRP

## Goal

Implement a central management interface (Dashboard) for administrators and authorized staff to manage the alumni network based on scraped and manual data.

## Why

To provide a consolidated view of the network, allow data management, and track profile freshness, ensuring the database remains accurate and actionable.

## What

A master data table with filtering, individual profile management, data import/export capabilities, and activity logging.

### Scope

- **Master List:** Data table with sorting and filtering (Name, Contact, Degree, IA Status).
- **IA Status Indicator:** "Up to date" or "To refresh" based on the last scrap timestamp.
- **Individual Profile:** Detailed view and manual editing form for authorized users.
- **Import/Export:** CSV/Excel tools for bulk data ingestion and mailing list generation.
- **Activity Logs:** Audit trail of manual modifications (who, what, when).

### User Stories

- As an **Admin**, I want to see a list of all alumni with their contact info and LinkedIn links.
- As an **Admin**, I want to see which profiles need refreshing so I can trigger new scraping.
- As an **Intervenant**, I want to manually update an alumnus's email when they notify us of a change.
- As an **Admin**, I want to export a list of alumni for a specific promotion to send them a targeted email.
- As a **Super Admin**, I want to see the history of changes made to a profile to track data accuracy.
- As a **Staff**, I want to view the dashboard statistics but without being able to access destructive operations (import, delete).
- As an **Admin**, I want to filter the alumni list by promotion year to quickly find a specific cohort.

## Technical Context

### Files to Reference (read-only)

- `app/layout.tsx` — Global layout with `AuthProvider`.
- `app/page.tsx` — SPA entry point with tab routing logic.
- `lib/utils.ts` — Date and string formatting.
- `PRPs/00-authentication.md` — Roles and access control.

### Files to Implement/Modify

- `components/dashboard-overview.tsx` — Main dashboard view (stats + summary).
- `components/dashboard-stats.tsx` — KPI display component (total alumni, to refresh, etc.).
- `components/alumni-directory.tsx` — Data table with search, sort, and filtering.
- `components/alumni-profile.tsx` — Detailed profile view + editing form.
- `components/logs-module.tsx` — Activity logs view.
- `lib/api/admin.ts` — API client for administration operations.

### Existing Patterns to Follow

- Use **shadcn/ui** components (`Table`, `Badge`, `Button`, `Dialog`).
- Use **TanStack Table** (React Table) for complex sorting/filtering logic.
- Use **React Hook Form** + **Zod** for the profile edition form.
- Follow the **Next.js App Router** structure (dedicated dashboard layout).

## Implementation Details

### API/Endpoints (Expected)

- `GET /admin/alumni` - Fetches the list of alumni with filters.
- `PATCH /admin/alumni/{id}` - Updates alumnus data.
- `POST /admin/alumni/import` - Bulk import from CSV.
- `GET /admin/alumni/export` - Triggers CSV generation.
- `GET /admin/logs` - Fetches modification history.

### Components

- **AlumniTable**: Searchable table with columns: Identity, Contact, Degree, IA Status.
- **AlumniEditSheet**: A sliding panel or modal to edit profile details manually.
- **StatusBadge**: Color-coded badge for "Up to date" (green) vs "To refresh" (amber).
- **DashboardStats**: Cards displaying KPIs (total alumni, profiles à jour, profiles to refresh, active jobs count).
- **PromoFilter**: Dropdown or multi-select to filter by graduation year.

## Validation Criteria

### Functional Requirements

- [ ] Master list displays all key columns (Name, Email, LinkedIn, Degree, Promo).
- [ ] Email and LinkedIn links are clickable and open in new tabs.
- [ ] IA Status correctly reflects the "lastScraped" date relative to current time.
- [ ] Manual edits are persisted and visible immediately.
- [ ] CSV Export generates a file containing the current filtered view.
- [ ] Logs correctly record which user made a change and the timestamp.
- [ ] Filtering by promotion year returns only the corresponding cohort.
- [ ] Dashboard stats display correct counts (total, up to date, to refresh).

### Technical Requirements

- [ ] Responsive design (works on tablet/desktop).
- [ ] Efficient loading (pagination/virtualization if list > 1000 items).
- [ ] Secure access: only users with `ADMIN` or `STAFF` roles can access these routes.

### Testing Steps

1. Navigate to Dashboard. Search for an alumnus by name.
2. Click "Edit" on a profile, change the email, and save.
3. Verify the change is reflected in the list.
4. Check the Logs page for the entry corresponding to the edit.
5. Upload a CSV file and verify new entries appear in the list.
