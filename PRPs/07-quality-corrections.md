# Quality & Corrections PRP (07)

## Goal

Give the alumni the ability to Signal information that is no longer correct and give the admin tools to verify its updates.

## Why

Even if the information is updated automatically, there are mistakes. This ensures a clean database with direct user feedback.

## What

A specific signal/feedback system in "My Profile" for alumni and a "Corrections" management board for administrators.

### Scope

- **Alumni Signaling:** A "Signaler une mise à jour" button in the alumni's profile.
- **Form/Feedback:** A simple text input for corrections (name, email, job, city).
- **Admin Inbox:** A specific tab in the dashboard (Admin Corrections) to see and manage requests.
- **Admin Action:** Option to mark as "Resolved", "Ignored", or to directly "Update profile" from the request.

### User Stories

- As an **Alumni**, I want to tell the admin that the machine wrongly updated my job.
- As an **Alumni**, I want to receive a confirmation when my profile was corrected by an admin.
- As a **Super Admin**, I want to filter the corrections by "Pending" or "Resolved".
- As a **Staff**, I want to see which alumnus is requesting a profile update to take action.

## Technical Context

### Files to Reference

- `components/alumni-my-profile.tsx` — Signaling button and state.
- `lib/api/admin.ts` — `createCorrection` and `getCorrections` endpoints.
- `lib/types.ts` — `CorrectionRequest` type.

### Existing Patterns to Follow

- **Shadcn** `Dialog` for the feedback form.
- **Shadcn** `Badge` for correction status (pending, resolved).

## Implementation Details

### API/Endpoints

- `POST /alumni/corrections` — Submit a correction request.
- `GET /admin/corrections` — Returns list of all requests for admins.
- `PATCH /admin/corrections/{id}` — Updates status (resolved/ignored).

### Validation Criteria

- [ ] Submit correction form: text must be sent and received in the admin board.
- [ ] Non-resolved corrections are clearly visible (unread badge or priority list).
- [ ] Admin can't modify a request, only resolve it.
- [ ] Alumni can only see their own correction status or receive a message.

### Testing Steps

1. Log in as an alumni and go to your profile.
2. Click "Signaler une mise à jour", write a message and send.
3. Log in as an admin.
4. Go to the "Corrections" section and verify the message is there.
5. Click "Resolved" and verify the status is updated.
