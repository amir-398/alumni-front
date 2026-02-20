# Notifications & Messaging PRP

## Goal

Inform alumni in real-time about relevant activities (targeted jobs, events, messages) and provide a secure internal communication channel.

## Why

Notifications are the link between existing modules: they make the Job Board (PRP 03) proactive, Events (PRP 04) visible, and mediated contact (PRP 02) functional. Without them, alumni must manually check each section.

## What

An in-app notification system with a sidebar badge, a notification center, and internal messaging linked to the directory contact form.

### Scope

- **In-app Notifications:** Sidebar badge + notification center (dropdown or dedicated page).
- **Notification Types:** New targeted job, new event, message received via contact form, event reminder.
- **Email Notifications:** Email copies for important notifications (configurable).
- **Internal Messaging:** Extension of the mediated contact form into simple conversations.
- **Preferences:** User chooses which notification types they receive (in-app, email) and the frequency.

### User Stories

- As an **Alumni**, I want to see a red badge when I have unread notifications.
- As an **Alumni**, I want to receive a notification when a job offer matches my profile.
- As an **Alumni**, I want to be notified when a new event is created in my city.
- As an **Alumni**, I want to receive a reminder 24h before an event I registered for.
- As an **Alumni**, I want to see when someone contacts me via the directory and be able to reply.
- As an **Alumni**, I want to configure my notification preferences to avoid spam.
- As an **Admin**, I want to send a notification to all alumni of a specific promotion.

## Technical Context

### Files to Reference (read-only)

- `PRPs/02-networking.md` — Mediated contact system.
- `PRPs/03-job-board.md` — AI job tagging.
- `PRPs/04-events.md` — RSVP and events.
- `components/app-sidebar.tsx` — Main navigation (badge addition).

### Files to Implement/Modify

- `components/notifications/NotificationBell.tsx` — Bell icon with count badge.
- `components/notifications/NotificationCenter.tsx` — Dropdown or page listing notifications.
- `components/notifications/NotificationItem.tsx` — Unit component for a notification.
- `components/notifications/NotificationPreferences.tsx` — Preference settings page.
- `components/messaging/MessageThread.tsx` — Conversation view for internal messaging.
- `components/messaging/MessageComposer.tsx` — Message input area.
- `lib/api/notifications.ts` — API client for notifications.
- `lib/api/messages.ts` — API client for messaging.
- `components/app-sidebar.tsx` — Addition of notification icon in the sidebar.

### Existing Patterns to Follow

- Use **shadcn/ui** (`Popover`, `ScrollArea`, `Badge`, `Switch`).
- Use **WebSocket** or **SSE** for real-time notifications (or polling in V1).
- Use **date-fns** for relative timestamp display ("5 min ago").

## Implementation Details

### API/Endpoints (Expected)

- `GET /notifications` — List of user notifications (paginated).
- `PATCH /notifications/{id}/read` — Mark a notification as read.
- `POST /notifications/read-all` — Mark all notifications as read.
- `GET /notifications/unread-count` — Unread count (for the badge).
- `GET /notifications/preferences` — User notification preferences.
- `PATCH /notifications/preferences` — Preference update.
- `GET /messages/threads` — Conversation list.
- `GET /messages/threads/{id}` — Messages in a conversation.
- `POST /messages/threads/{id}` — Send a message in a conversation.

### Notification Types (enum)

| Type               | Trigger                       | Default Channel |
| ------------------ | ----------------------------- | --------------- |
| `JOB_MATCH`        | New job matching profile      | In-app + Email  |
| `EVENT_NEW`        | New event in alumni's city    | In-app          |
| `EVENT_REMINDER`   | 24h before RSVPed event       | In-app + Email  |
| `MESSAGE_RECEIVED` | New message via contact form  | In-app + Email  |
| `ADMIN_BROADCAST`  | Notification sent by an admin | In-app + Email  |

### Components

- **NotificationBell**: `Bell` icon from lucide-react + `Badge` with count. Click opens a `Popover`.
- **NotificationCenter**: `ScrollArea` with `NotificationItem` list, "Mark all as read" button.
- **NotificationItem**: Contextual icon + title + message + relative timestamp. Unread = highlighted background.
- **NotificationPreferences**: List of switches per notification type × channel (in-app / email).

## Validation Criteria

### Functional Requirements

- [ ] Badge displays correct unread notification count.
- [ ] Clicking the bell opens the notification list.
- [ ] Clicking a notification marks it as read and navigates to the relevant content.
- [ ] "Mark all as read" resets the counter to zero.
- [ ] Notification preferences are saved and respected.
- [ ] Messaging displays conversations and allows replying.

### Technical Requirements

- [ ] Polling every 30s in V1, WebSocket in V2.
- [ ] Notification pagination (20 per page).
- [ ] Notifications expire after 90 days (server-side cleanup).
- [ ] Rate limiting on message sending (max 10/hour).

### Testing Steps

1. Log in as an alumni. Verify notification badge.
2. Open notification center. Verify the list.
3. Click a job notification. Verify navigation to the job offer.
4. Mark all as read. Verify that badge disappears.
5. Modify preferences (disable emails). Verify persistence.
6. Send a message via contact. Verify receipt by recipient.
