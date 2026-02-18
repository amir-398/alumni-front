# Authentication Feature PRP

## Goal
Implement a complete authentication system with registration, login, session management, and role-based access control (RBAC) for Alumni and Admins.

## Why
To secure the platform, ensuring only validated alumni can access contact details and features, while providing admins with tools to manage the user base.

## What
A full-stack authentication flow integrated with the existing Nuxt 4 frontend and FastAPI backend.

### Scope
- **Registration:** User sign-up form with validation (Status: `pending`).
- **Login:** Email/Password authentication (Status: `active` required for access).
- **Session Management:** Persist user state using a composable and cookies/tokens.
- **Route Protection:** Middleware to redirect unauthenticated users or unauthorized roles.
- **Logout:** functionality.
- **UI:** Login page, Registration page, and Auth layout.

### User Stories
- As a **Visitor**, I want to register so I can join the alumni network.
- As a **Pending Alumni**, I want to know my account is under review after registering.
- As an **Active Alumni**, I want to log in to access the directory.
- As an **Admin**, I want to log in to access the backoffice.

## Technical Context

### Files to Reference (read-only)
- `nuxt.config.ts` - For Nuxt modules and runtime config.
- `app/app.vue` - Main entry point.

### Files to Implement/Modify
- `app/pages/auth/login.vue` - New login page.
- `app/pages/auth/register.vue` - New registration page.
- `app/composables/useAuth.ts` - Logic for state, login, register, logout.
- `app/middleware/auth.ts` - Route protection logic.
- `app/types/auth.ts` - Type definitions for User, Session, Credentials.
- `app/layouts/auth.vue` - Layout for auth pages (centered card, no nav).

### Existing Patterns to Follow
- Use **Nuxt UI** components (`<UForm>`, `<UInput>`, `<UButton>`) for consistent design.
- Use **Zod** for schema validation in forms (standard with Nuxt UI).
- Use `useFetch` or `$fetch` for API calls.

## Implementation Details

### API/Endpoints (Expected)
- `POST /auth/login` - Validates credentials, returns JWT.
  - Payload: `{ email, password }`
  - Response: `{ token, user: { ... } }`
- `POST /alumni/register` - Creates new pending user.
  - Payload: `{ firstName, lastName, email, password, linkedinUrl, gradYear, degree }`
- `GET /auth/me` - Validates token, returns current user profile.

### Components
- **AuthLayout**: Simple layout with logo and centered container.
- **LoginForm**: Form with email/password validation.
- **RegisterForm**: Multi-step or long form for alumni details.

## Validation Criteria

### Functional Requirements
- [ ] User can register; redirection to "Pending Approval" page or message.
- [ ] Active user can log in; redirection to dashboard/directory.
- [ ] Pending/Rejected user cannot log in (backend rejection + frontend handling).
- [ ] Protected routes redirect to `/auth/login`.
- [ ] Logout clears session and redirects to home.

### Technical Requirements
- [ ] TypeScript strict mode enabled.
- [ ] Form validation using Zod.
- [ ] Error handling for API failures (e.g., "Invalid credentials").
- [ ] Token stored securely (HttpOnly cookie preferred, or secure storage).

### Testing Steps
1. Navigate to `/auth/register` and submit form. Verify API call.
2. Navigate to `/auth/login` with invalid credentials. Verify error message.
3. Login with valid credentials. Verify redirect to protected area.
4. Refresh page. Verify session persists.
5. Click logout. Verify redirection to public area.
