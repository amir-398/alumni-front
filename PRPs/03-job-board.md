# Job Board Module PRP

## Goal

Create a dedicated space for alumni and partners to share career opportunities and boost network employability.

## Why

To centralize professional opportunities within the community and use AI to match offers with the most relevant alumni profiles.

## What

A job listing platform with simplified posting, AI-powered targeting, and restricted visibility.

### Scope

- **Job Posting Form:** Fields for Job Type (CDI, CDD, Freelance), Title, Company, Link, and Description.
- **AI Tagging & Suggestions:** The system analyzes the job description to suggest which graduation years or degrees should be notified.
- **Filtering:** Browse by contract type, company, or date.
- **Access Control:** Job details are visible only to authenticated alumni members.

### User Stories

- As an **Alumni**, I want to share a job opening in my company with the network.
- As a **Job Seeker**, I want to see offers specifically shared by alumni because they might act as referrals.
- As an **Admin**, I want the system to tell me: "This 'Junior Developer' role is perfect for last year's graduates" so I can send a notification.
- As a **Visitor**, I want to see that a job board exists, but I must log in to see the details.
- As an **Alumni**, I want to edit a job posting I published to correct a mistake.
- As an **Alumni**, I want to delete a job posting I published when the position is filled.
- As an **Alumni**, I want to receive a notification when a new job matches my profile (see `PRPs/06-notifications.md`).

## Technical Context

### Files to Reference (read-only)

- `app/page.tsx` — SPA entry point, "jobs" tab.
- `PRPs/00-authentication.md` — Access control.
- `PRPs/06-notifications.md` — Targeted job notifications.

### Files to Implement/Modify

- `components/job-board.tsx` — Existing main component (list + form).
- `components/jobs/JobCard.tsx` — Summary card for an offer.
- `components/jobs/JobForm.tsx` — Creation/editing form with validation.
- `components/jobs/JobDetailSheet.tsx` — Panel or modal with full offer details.
- `lib/api/jobs.ts` — API client for CRUD operations on job offers.

### Existing Patterns to Follow

- Use **shadcn/ui** `Card` and `Form` components.
- Use **Enum** for contract types (CDI, CDD, Internship, Freelance).
- Implement server-side AI processing (e.g., using an LLM to extract "target promotion" from description).

## Implementation Details

### API/Endpoints (Expected)

- `GET /jobs` — Returns list of active jobs (with pagination and filters).
- `POST /jobs` — Creates a new job.
- `GET /jobs/{id}` — Returns full job details.
- `PATCH /jobs/{id}` — Updates an existing job (author or admin only).
- `DELETE /jobs/{id}` — Deletes a job (author or admin only).
- `POST /jobs/analyze` — Sends description to AI to get suggested tags/promotions.

### Components

- **JobFilterBar**: Selectors for Contract Type and Graduation Year matching.
- **AITagBadge**: Special badge showing the AI-suggested target audience.
- **JobDetailSheet**: Sliding panel with full description, company info, external link, and edit/delete actions.
- **JobStats**: (Admin only) Shows how many people viewed an offer.
- **JobAuthorBadge**: Shows the alumni who posted the offer (with link to profile).

## Validation Criteria

### Functional Requirements

- [ ] Users can submit the job posting form with all required fields.
- [ ] Description is sent to the AI service, and it returns relevant promotion tags.
- [ ] Authenticated users can see the full job description and external links.
- [ ] Non-authenticated users are redirected to the login page when clicking on a job.

### Technical Requirements

- [ ] Job descriptions are sanitized to prevent XSS.
- [ ] AI analysis is asynchronous or handled with a loading state to prevent UI blocking.
- [ ] Automatic expiration: Jobs older than 60 days are archived/hidden.

### Testing Steps

1. Navigate to `/jobs/new`.
2. Fill out a "Junior React Developer" job description.
3. Verify that the AI suggests recent graduation years (e.g., 2024, 2025).
4. Save the job and verify it appears at the top of the `/jobs` list.
5. Log out and attempt to access `/jobs`. Verify redirection to login.
