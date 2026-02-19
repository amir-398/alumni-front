# Access & Confidentiality (Networking) PRP

## Goal

Open the platform to alumni while strictly protecting personal data and preventing mass scraping or spam.

## Why

To encourage networking and peer-to-peer engagement without compromising the security of the alumni database or violating privacy expectations.

## What

A "Curtain" privacy model where directory data is tiered based on authentication and contact is mediated through secured internal tools.

### Scope

- **Secure Authentication:** "Magic Link" via email or LinkedIn OAuth for easy yet verified access.
- **The "Curtain" Display:** Authenticated alumni see professional summaries (Name, Job, Promo) but cannot see raw emails or phone numbers.
- **Mediated Contact System:** A "Contact" button that opens an internal messaging form. The recipient receives an email notification with the message and the sender's info.
- **LinkedIn Integration:** Direct links to LinkedIn profiles to shift detailed networking to a controlled third-party platform.

### User Stories

- As an **Alumni**, I want to log in quickly without remembering a password using a magic link sent to my school email.
- As an **Alumni**, I want to browse the directory to find peers from my graduation year.
- As an **Alumni**, I want to contact a peer without exposing my personal email address until I choose to reply.
- As an **Admin**, I want to prevent automated scripts from harvesting the entire email database.

## Technical Context

### Files to Reference (read-only)

- `PRPs/00-authentication.md` - For authentication base logic.
- `app/api/auth/[...nextauth]/route.ts` - If using NextAuth.js for OAuth/Magic Links.

### Files to Implement/Modify

- `app/(app)/directory/page.tsx` - Public/Alumni directory list.
- `app/(app)/directory/[id]/page.tsx` - Profile view with the contact form.
- `components/networking/ContactForm.tsx` - Internal messaging component.
- `components/networking/PrivacyCurtain.tsx` - Component to mask/unmask data based on auth state.
- `lib/api/messages.ts` - Logic for sending mediated contact emails.

### Existing Patterns to Follow

- Use **NextAuth.js** (or similar) for Magic Links and LinkedIn OAuth provider.
- Use **NodeMailer** or an email service (Resend, SendGrid) for contact notifications.
- Mask sensitive strings on the frontend while ensuring they aren't even sent in the API response for non-admins.

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
- [ ] Rate limiting on the "Contact" form to prevent internal spam (e.g., max 5 contacts/day).
- [ ] GDPR compliance: clear opt-out for internal messaging in profile settings.

### Testing Steps

1. Log in as a standard Alumni.
2. Navigate to the directory. Verify no emails are visible.
3. Inspect the browser "Network" tab for the directory API call. Verify no emails are in the JSON body.
4. Use the "Contact" button to send a message to a test account.
5. Verify the test account receives the email with the correct message content.
