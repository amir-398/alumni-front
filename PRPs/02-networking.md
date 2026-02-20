# Access & Confidentiality (Networking) PRP

## Goal

Open the platform to alumni while strictly protecting personal data and preventing mass scraping or spam.

## Why

To encourage networking and peer-to-peer engagement without compromising the security of the alumni database or violating privacy expectations.

## What

A "Curtain" privacy model where directory data is tiered based on authentication and contact is mediated through secured internal tools.

### Scope

- **Secure Authentication:** Email/password (V1), then "Magic Link" and LinkedIn OAuth (V2). See `PRPs/00-authentication.md` for details.
- **The "Curtain" Display:** Authenticated alumni see professional summaries (Name, Job, Promo) but cannot see raw emails or phone numbers.
- **Mediated Contact System:** A "Contact" button that opens an internal messaging form. The recipient receives an email notification with the message and the sender's info. See also `PRPs/06-notifications.md` for internal messaging extension.
- **LinkedIn Integration:** Direct links to LinkedIn profiles to shift detailed networking to a controlled third-party platform.

### User Stories

- As an **Alumni**, I want to log in quickly without remembering a password using a magic link sent to my school email.
- As an **Alumni**, I want to browse the directory to find peers from my graduation year.
- As an **Alumni**, I want to contact a peer without exposing my personal email address until I choose to reply.
- As an **Admin**, I want to prevent automated scripts from harvesting the entire email database.

## Technical Context

### Files to Reference (read-only)

- `PRPs/00-authentication.md` — Authentication system and roles.
- `PRPs/06-notifications.md` — Internal messaging extension.
- `lib/auth-context.tsx` — Authentication context (roles, logged-in state).

### Files to Implement/Modify

- `components/alumni-directory.tsx` — Existing table (admin/staff). Add an alumni mode with the privacy curtain.
- `components/alumni-profile.tsx` — Profile view. Add masking of sensitive data for alumni.
- `components/networking/ContactForm.tsx` — Mediated contact form.
- `components/networking/PrivacyCurtain.tsx` — Component that masks/unmasks data based on role.
- `lib/api/messages.ts` — Mediated message sending logic.

### Existing Patterns to Follow

- Use the authentication system described in `PRPs/00-authentication.md` (Email/password V1, NextAuth V2).
- Use **NodeMailer** or an email service (Resend, SendGrid) for contact notifications.
- Mask sensitive data on the frontend **AND** ensure it is not included in the API response for non-admins. Filtering must happen server-side.

## Implementation Details

### API/Endpoints (Expected)

- `POST /auth/magic-link` - Sends registration/login email.
- `GET /directory` - Returns limited profile data (names, promo, job title).
- `POST /directory/{id}/contact` - Sends a mediated message to the alumnus.
  - Payload: `{ senderId, message }`
  - Backend sends email: `From: Platform <contact@alumni.com> | Reply-To: sender@email.com`

### Components

- **AlumniCard**: Displays professional summary + "Contact" + "LinkedIn" buttons.
- **ContactModal**: Simple form with a textarea for the message.
- **AuthGate**: HOC or wrapper to restrict access to the directory to verified alumni.

## Validation Criteria

### Functional Requirements

- [ ] Users can log in via Magic Link/LinkedIn.
- [ ] Directory view hides email addresses from the UI and the Network tab (API payloads).
- [ ] "Contact" form successfully triggers an email to the target alumnus.
- [ ] LinkedIn button opens the correct profile in a new tab.

### Technical Requirements

- [ ] Sensitive data (Email/Phone) is **never** included in the `/directory` API response for standard alumni users.
- [ ] Server-side rate limiting (middleware) on contact form: max 5 messages/day per user. Return HTTP 429 if exceeded.
- [ ] Client-side rate limiting: disable "Send" button and show a waiting message if limit is reached.
- [ ] GDPR compliance: clear opt-out for internal messaging in profile settings (see `PRPs/05-profil-alumni.md`).

### Testing Steps

1. Log in as a standard Alumni.
2. Navigate to the directory. Verify no emails are visible.
3. Inspect the browser "Network" tab for the directory API call. Verify no emails are in the JSON body.
4. Use the "Contact" button to send a message to a test account.
5. Verify the test account receives the email with the correct message content.
