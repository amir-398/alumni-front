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

## Technical Context

### Files to Reference (read-only)

- `app/(app)/layout.tsx` - Main navigation.
- `lib/api/openai.ts` - (Hypothetical) If using OpenAI or local LLM for tagging.

### Files to Implement/Modify

- `app/(app)/jobs/page.tsx` - Main job list.
- `app/(app)/jobs/new/page.tsx` - Job creation form.
- `components/jobs/JobCard.tsx` - Visual representation of an offer.
- `components/jobs/JobForm.tsx` - Form with validation.
- `lib/api/jobs.ts` - CRUD operations for job postings.

### Existing Patterns to Follow

- Use **shadcn/ui** `Card` and `Form` components.
- Use **Enum** for contract types (CDI, CDD, Internship, Freelance).
- Implement server-side AI processing (e.g., using an LLM to extract "target promotion" from description).

## Implementation Details

### API/Endpoints (Expected)

- `GET /jobs` - Returns list of active jobs.
- `POST /jobs` - Creates a new job.
- `POST /jobs/analyze` - Sends description to AI to get suggested tags/promotions.
- `GET /jobs/{id}` - Returns full job details.

### Components

- **JobFilterBar**: Selectors for Contract Type and Graduation Year matching.
- **AITagBadge**: Special badge showing the AI-suggested target audience.
- **JobStats**: (Admin only) Shows how many people viewed an offer.

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
