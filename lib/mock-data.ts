// ===== TYPES =====
export type AlumniStatus = "up_to_date" | "to_refresh";
export type JobType = "CDI" | "CDD" | "Freelance" | "Stage";
export type EventStatus = "upcoming" | "past";
export type LogAction = "create" | "update" | "delete";

export interface Alumni {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedinUrl: string;
  diploma: string;
  promoYear: number;
  status: AlumniStatus;
  lastScrapDate: string;
  currentJob: string;
  currentCompany: string;
  city: string;
  avatarUrl: string | null;
}

export interface LogEntry {
  id: string;
  alumniId: string;
  alumniName: string;
  action: LogAction;
  field: string;
  oldValue: string;
  newValue: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface JobPosting {
  id: string;
  type: JobType;
  title: string;
  company: string;
  location: string;
  description: string;
  link: string;
  postedBy: string;
  postedAt: string;
  suggestedPromos: number[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "gala" | "afterwork" | "conference" | "workshop";
  status: EventStatus;
  attendees: number;
  maxAttendees: number;
  imageUrl: string | null;
}

export interface UpdateRequest {
  id: string;
  alumniId: string;
  alumniName: string;
  message: string;
  requestedAt: string;
  resolved: boolean;
}

// ===== MOCK DATA (REMOVED) =====

export const mockAlumni: Alumni[] = [];
export const mockLogs: LogEntry[] = [];
export const mockJobs: JobPosting[] = [];
export const mockEvents: Event[] = [];
export const mockUpdateRequests: UpdateRequest[] = [];

// ===== STATS =====
export const dashboardStats = {
  totalAlumni: 0,
  profilesUpToDate: 0,
  profilesToRefresh: 0,
  activeJobPostings: 0,
  upcomingEvents: 0,
  pendingUpdateRequests: 0,
};
