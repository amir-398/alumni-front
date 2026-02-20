# Alumni Profile PRP

## Goal

Allow alumni to view, modify, and enrich their personal profile on the platform.

## Why

A complete and up-to-date profile is essential for directory quality, peer-to-peer networking, and relevant job and event matching.

## What

A "My Profile" page with personal info display, inline editing, and directory visibility management.

### Scope

- **Profile Display:** Read-only view of information (name, email, diploma, job, company, city, LinkedIn).
- **Profile Editing:** Form to modify editable fields.
- **Profile Photo:** Upload and cropping of a photo (avatar).
- **Privacy Preferences:** Choice of directory visibility (visible / hidden profile).
- **Activity History:** Summary of RSVPed events and posted jobs.

### User Stories

- As an **Alumni**, I want to see my personal information as it appears in the directory.
- As an **Alumni**, I want to modify my current job and company when I change jobs.
- As an **Alumni**, I want to add or modify my LinkedIn link.
- As an **Alumni**, I want to upload a profile photo to be recognized by my former classmates.
- As an **Alumni**, I want to choose whether my profile is visible in the directory or not.
- As an **Alumni**, I want to see the events I registered for.
- As an **Alumni**, I want to see the job offers I posted.

## Technical Context

### Files to Reference (read-only)

- `PRPs/00-authentication.md` — Authentication system and roles.
- `lib/auth-context.tsx` — Retrieval of the connected user.
- `lib/mock-data.ts` — `Alumni` data structure.

### Files to Implement/Modify

- `components/alumni-my-profile.tsx` — Existing read-only component, to be enriched with editing.
- `components/profile/ProfileEditForm.tsx` — Profile editing form.
- `components/profile/AvatarUpload.tsx` — Profile photo upload component.
- `components/profile/PrivacySettings.tsx` — Directory visibility toggle.
- `components/profile/ActivityHistory.tsx` — Event / Jobs history.
- `lib/api/profile.ts` — API client for profile operations.

### Existing Patterns to Follow

- Use **React Hook Form** + **Zod** for profile editing form validation.
- Use **shadcn/ui** (`Card`, `Input`, `Label`, `Switch`, `Avatar`).
- Optimistic UI for profile saving.

## Implementation Details

### API/Endpoints (Expected)

- `GET /profile/me` — Returns the full profile of the connected user.
- `PATCH /profile/me` — Updates modified profile fields.
- `POST /profile/me/avatar` — Profile photo upload (multipart/form-data).
- `DELETE /profile/me/avatar` — Profile photo deletion.
- `PATCH /profile/me/privacy` — Updates privacy preferences.
- `GET /profile/me/activity` — Returns activity history (RSVPed events, posted jobs).

### Components

- **ProfileHeader**: Avatar, full name, job + company, profile status badge.
- **ProfileEditForm**: Form with fields: job, company, city, LinkedIn, diploma.
- **AvatarUpload**: Drag & drop zone or button to upload a photo, with preview and cropping.
- **PrivacyToggle**: "Visible in directory" switch with explanation of consequences.
- **ActivityTimeline**: Chronological list of latest actions (RSVP, offers, etc.).

## Validation Criteria

### Functional Requirements

- [ ] Profile displays all information of the connected alumnus.
- [ ] Modifications are saved and visible immediately.
- [ ] Photo upload works and preview updates.
- [ ] Privacy toggle hides/shows the profile in the directory.
- [ ] Activity history lists recent events and job posts.

### Technical Requirements

- [ ] Images are resized server-side (max 400x400px, WebP).
- [ ] Zod validation on client-side before sending to server.
- [ ] Max upload size: 5 MB.
- [ ] Sensitive fields (email) are not directly modifiable (requires verification).

### Testing Steps

1. Log in as an alumni. Verify that "My Profile" displays the correct info.
2. Modify the current job and save. Verify persistence after refresh.
3. Upload a photo. Verify preview and save.
4. Toggle visibility on/off. Verify that the profile appears/disappears from the directory.
5. Verify that activity history lists the latest actions.
