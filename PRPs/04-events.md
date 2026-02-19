# Events Module PRP

## Goal

Manage and promote the social life of the alumni network through a centralized event calendar and engagement tracking.

## Why

To maintain the bond between the school, the BDE (Student Union), and alumni, fostering long-term engagement and networking.

## What

A social hub listing upcoming events, managing RSVPs, and hosting memories of past gatherings.

### Scope

- **Event Feed:** A chronological list of upcoming events (Gala, Afterwork, Professional Conference, Alumni Dinner).
- **RSVP System:** "I'm participating" button to help organizers plan logistics (drinks, badges, seating).
- **Archives & Gallery:** A section for past events containing photo galleries and summaries to build nostalgia.
- **Event Details:** Date, location, map integration, and description.

### User Stories

- As an **Alumni**, I want to see upcoming afterworks in my city so I can meet old friends.
- As a **BDE Member**, I want to know how many alumni are coming to the Gala to order the right amount of catering.
- As an **Alumni**, I want to browse photos of the 2023 Graduation Ceremony to reminisce about my time at school.
- As an **Admin**, I want to create a new "Career Talk" event and notify the relevant promotions.

## Technical Context

### Files to Reference (read-only)

- `app/layout.tsx` - For global navigation.
- `public/images/events/` - Folder for event assets/photos.

### Files to Implement/Modify

- `app/(app)/events/page.tsx` - Central event feed.
- `app/(app)/events/[id]/page.tsx` - Detailed view + RSVP button.
- `app/(app)/events/archive/page.tsx` - Past events and photo galleries.
- `components/events/EventCard.tsx` - Summary card for the feed.
- `components/events/RsvpButton.tsx` - Interactive attendance toggle.
- `components/events/PhotoGallery.tsx` - Grid/Carousel for archived event photos.
- `lib/api/events.ts` - Logic for fetching events and updating RSVP status.

### Existing Patterns to Follow

- Use **date-fns** for date formatting and comparison (Check for `Upcoming` vs `Past`).
- Use **shadcn/ui** `AspectRatio` for event cover images and `Dialog` for gallery previews.
- Implement an "Optimistic UI" for the RSVP button (UI updates immediately before the API response).

## Implementation Details

### API/Endpoints (Expected)

- `GET /events` - Fetches all events (can be filtered by upcoming/past).
- `GET /events/{id}` - Fetches specific event details and attendee list.
- `POST /events/{id}/rsvp` - Toggles the current user's participation.
- `GET /events/{id}/photos` - Fetches the gallery assets for a past event.

### Components

- **AttendeeAvatarGroup**: Shows small avatars of people who are attending.
- **CountdownTimer**: (Optional) For big events like the Gala.
- **EventMap**: Integrated map (Google/Leaflet) for the physical location.

## Validation Criteria

### Functional Requirements

- [ ] Users can see a list of upcoming events.
- [ ] Clicking "I'm participating" updates the count and shows the user as an attendee.
- [ ] Past events are automatically moved to the "Archives" section.
- [ ] Photo gallery allows full-screen viewing of event photos.

### Technical Requirements

- [ ] Images are optimized (WebP, lazy loading) to handle large photo galleries.
- [ ] RSVP state is persisted in the database and synced across devices.
- [ ] Role-based creation: Only `ADMIN` or specific `ORGANIZER` roles can post new events.

### Testing Steps

1. Navigate to `/events`. Verify upcoming events are listed first.
2. Click "I'm participating" on an event. Refresh the page and verify the state is saved.
3. Check the "Archives" page. Verify events with dates in the past appear there.
4. Open a past event and click on a photo. Verify it opens in a lightbox/modal.
