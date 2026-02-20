# Authentication & Roles PRP

## Goal

Implement a secure authentication system and role management to control access to different sections of the Alumni Hub platform.

## Why

Authentication is the foundation of all other modules. Without reliable identification, privacy features (PRP 02), job posting (PRP 03), and event RSVPs (PRP 04) cannot function.

## What

A multi-method authentication system with management for 3 distinct roles and session persistence.

### Scope

- **Email/Password Login:** Classic authentication with server-side validation.
- **Magic Link (V2):** Send a login link via email, without a password.
- **LinkedIn OAuth (V2):** Login via LinkedIn account for alumni.
- **Role Management:** 3 access levels — `admin`, `staff`, `alumni`.
- **Session Persistence:** Stored JWT token (HttpOnly cookie or localStorage) to maintain connection across page reloads.
- **Registration:** Registration form for new alumni with email validation.

### User Stories

- As an **Alumni**, I want to log in with my email and password to access the platform.
- As an **Alumni**, I want to receive a magic link via email to log in without a password (V2).
- As an **Alumni**, I want to log in via LinkedIn to simplify access (V2).
- As an **Admin**, I want only users with the `admin` or `staff` role to be able to access the administration dashboard.
- As an **Unauthenticated User**, I want to be redirected to the login page if I try to access a protected section.
- As an **Alumni**, I want to stay logged in even if I refresh the page.

## Technical Context

### Files to Reference (read-only)

- `app/layout.tsx` — Global layout with `AuthProvider`.
- `components/app-sidebar.tsx` — Filtering navigation items by role.

### Files to Implement/Modify

- `lib/auth-context.tsx` — Authentication context (currently mock, to be connected to an API).
- `components/auth-page.tsx` — Login page (add registration, magic link).
- `lib/api/auth.ts` — API client for login, register, refresh token.
- `middleware.ts` — Next.js middleware to protect routes.

### Existing Patterns to Follow

- Use **React Context** for global auth state (already in place).
- Use **JWT** (access token + refresh token) for persistence.
- Use **shadcn/ui** components (`Card`, `Input`, `Button`) for forms.

## Implementation Details

### API/Endpoints (Expected)

- `POST /auth/login` — Email/password login. Returns JWT.
- `POST /auth/register` — New alumni registration. Sends validation email.
- `POST /auth/magic-link` — Send a magic link via email (V2).
- `POST /auth/refresh` — Refresh the JWT token.
- `GET /auth/me` — Returns the logged-in user's info.
- `POST /auth/logout` — Token invalidation.

### Roles and Permissions

| Section            | `admin` | `staff` | `alumni` |
| ------------------ | ------- | ------- | -------- |
| Dashboard          | ✅      | ✅      | ❌       |
| Directory (admin)  | ✅      | ✅      | ❌       |
| Directory (public) | ✅      | ✅      | ✅       |
| Job Board          | ✅      | ✅      | ✅       |
| Events             | ✅      | ✅      | ✅       |
| Logs               | ✅      | ✅      | ❌       |
| My Profile         | ❌      | ❌      | ✅       |

### Components

- **LoginForm**: Existing email/password form.
- **RegisterForm**: Registration form (first name, last name, email, password, promo, diploma).
- **MagicLinkForm**: Email field + "Get Link" button (V2).
- **AuthGuard**: HOC or wrapper component to protect routes.

## Validation Criteria

### Functional Requirements

- [ ] Email/password login works and returns a valid token.
- [ ] User remains logged in after a page refresh.
- [ ] Admin routes are inaccessible to alumni.
- [ ] Alumni routes are inaccessible to unauthenticated users.
- [ ] Registration creates an account with the `alumni` role by default.
- [ ] Logout clears the token and redirects to the login page.

### Technical Requirements

- [ ] Passwords are hashed server-side (bcrypt).
- [ ] JWT tokens have limited lifespan (15 min access, 7d refresh).
- [ ] Cookies are HttpOnly and Secure in production.
- [ ] CSRF protection on forms.

### Testing Steps

1. Log in with an admin account. Verify access to the dashboard.
2. Log in with an alumni account. Verify that the dashboard is inaccessible.
3. Refresh the page. Verify that the session is maintained.
4. Log out. Verify redirection to login.
5. Create a new account. Verify automatic login after registration.
