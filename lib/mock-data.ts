// ===== TYPES =====
export type AlumniStatus = "up_to_date" | "to_refresh"
export type JobType = "CDI" | "CDD" | "Freelance" | "Stage"
export type EventStatus = "upcoming" | "past"
export type LogAction = "create" | "update" | "delete"

export interface Alumni {
  id: string
  firstName: string
  lastName: string
  email: string
  linkedinUrl: string
  diploma: string
  promoYear: number
  status: AlumniStatus
  lastScrapDate: string
  currentJob: string
  currentCompany: string
  city: string
  avatarUrl: string | null
}

export interface LogEntry {
  id: string
  alumniId: string
  alumniName: string
  action: LogAction
  field: string
  oldValue: string
  newValue: string
  modifiedBy: string
  modifiedAt: string
}

export interface JobPosting {
  id: string
  type: JobType
  title: string
  company: string
  location: string
  description: string
  link: string
  postedBy: string
  postedAt: string
  suggestedPromos: number[]
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: "gala" | "afterwork" | "conference" | "workshop"
  status: EventStatus
  attendees: number
  maxAttendees: number
  imageUrl: string | null
}

export interface UpdateRequest {
  id: string
  alumniId: string
  alumniName: string
  message: string
  requestedAt: string
  resolved: boolean
}

// ===== MOCK DATA =====

export const mockAlumni: Alumni[] = [
  {
    id: "1",
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@email.com",
    linkedinUrl: "https://linkedin.com/in/sophiemartin",
    diploma: "Master Marketing Digital",
    promoYear: 2022,
    status: "up_to_date",
    lastScrapDate: "2026-02-15",
    currentJob: "Head of Growth",
    currentCompany: "Doctolib",
    city: "Paris",
    avatarUrl: null,
  },
  {
    id: "2",
    firstName: "Thomas",
    lastName: "Durand",
    email: "thomas.durand@email.com",
    linkedinUrl: "https://linkedin.com/in/thomasdurand",
    diploma: "Master Finance",
    promoYear: 2021,
    status: "up_to_date",
    lastScrapDate: "2026-02-10",
    currentJob: "Analyste M&A",
    currentCompany: "Rothschild & Co",
    city: "Paris",
    avatarUrl: null,
  },
  {
    id: "3",
    firstName: "Camille",
    lastName: "Bernard",
    email: "camille.bernard@email.com",
    linkedinUrl: "https://linkedin.com/in/camillebernard",
    diploma: "Master Data Science",
    promoYear: 2023,
    status: "to_refresh",
    lastScrapDate: "2025-11-20",
    currentJob: "Data Scientist",
    currentCompany: "BlaBlaCar",
    city: "Paris",
    avatarUrl: null,
  },
  {
    id: "4",
    firstName: "Lucas",
    lastName: "Petit",
    email: "lucas.petit@email.com",
    linkedinUrl: "https://linkedin.com/in/lucaspetit",
    diploma: "Master Management",
    promoYear: 2020,
    status: "up_to_date",
    lastScrapDate: "2026-01-30",
    currentJob: "Chef de Projet",
    currentCompany: "LVMH",
    city: "Paris",
    avatarUrl: null,
  },
  {
    id: "5",
    firstName: "Emma",
    lastName: "Leroy",
    email: "emma.leroy@email.com",
    linkedinUrl: "https://linkedin.com/in/emmaleroy",
    diploma: "Master Marketing Digital",
    promoYear: 2024,
    status: "up_to_date",
    lastScrapDate: "2026-02-18",
    currentJob: "Social Media Manager",
    currentCompany: "Sephora",
    city: "Paris",
    avatarUrl: null,
  },
  {
    id: "6",
    firstName: "Hugo",
    lastName: "Moreau",
    email: "hugo.moreau@email.com",
    linkedinUrl: "https://linkedin.com/in/hugomoreau",
    diploma: "Master Finance",
    promoYear: 2019,
    status: "to_refresh",
    lastScrapDate: "2025-09-05",
    currentJob: "Portfolio Manager",
    currentCompany: "Amundi",
    city: "Lyon",
    avatarUrl: null,
  },
  {
    id: "7",
    firstName: "Lea",
    lastName: "Simon",
    email: "lea.simon@email.com",
    linkedinUrl: "https://linkedin.com/in/leasimon",
    diploma: "Master RH",
    promoYear: 2022,
    status: "up_to_date",
    lastScrapDate: "2026-02-01",
    currentJob: "Talent Acquisition Lead",
    currentCompany: "Alan",
    city: "Paris",
    avatarUrl: null,
  },
  {
    id: "8",
    firstName: "Antoine",
    lastName: "Laurent",
    email: "antoine.laurent@email.com",
    linkedinUrl: "https://linkedin.com/in/antoinelaurent",
    diploma: "Master Entrepreneuriat",
    promoYear: 2018,
    status: "up_to_date",
    lastScrapDate: "2026-01-15",
    currentJob: "CEO & Co-founder",
    currentCompany: "TechStart SAS",
    city: "Bordeaux",
    avatarUrl: null,
  },
  {
    id: "9",
    firstName: "Julie",
    lastName: "Roux",
    email: "julie.roux@email.com",
    linkedinUrl: "https://linkedin.com/in/julieroux",
    diploma: "Master Data Science",
    promoYear: 2023,
    status: "to_refresh",
    lastScrapDate: "2025-10-12",
    currentJob: "ML Engineer",
    currentCompany: "Dataiku",
    city: "Paris",
    avatarUrl: null,
  },
  {
    id: "10",
    firstName: "Maxime",
    lastName: "Fournier",
    email: "maxime.fournier@email.com",
    linkedinUrl: "https://linkedin.com/in/maximefournier",
    diploma: "Master Management",
    promoYear: 2021,
    status: "up_to_date",
    lastScrapDate: "2026-02-12",
    currentJob: "Consultant Senior",
    currentCompany: "McKinsey",
    city: "Paris",
    avatarUrl: null,
  },
  {
    id: "11",
    firstName: "Clara",
    lastName: "Girard",
    email: "clara.girard@email.com",
    linkedinUrl: "https://linkedin.com/in/claragirard",
    diploma: "Master Marketing Digital",
    promoYear: 2025,
    status: "up_to_date",
    lastScrapDate: "2026-02-19",
    currentJob: "Stagiaire Brand Manager",
    currentCompany: "L'Oreal",
    city: "Clichy",
    avatarUrl: null,
  },
  {
    id: "12",
    firstName: "Paul",
    lastName: "Andre",
    email: "paul.andre@email.com",
    linkedinUrl: "https://linkedin.com/in/paulandre",
    diploma: "Master Finance",
    promoYear: 2020,
    status: "to_refresh",
    lastScrapDate: "2025-08-22",
    currentJob: "Risk Analyst",
    currentCompany: "BNP Paribas",
    city: "Paris",
    avatarUrl: null,
  },
]

export const mockLogs: LogEntry[] = [
  {
    id: "l1",
    alumniId: "1",
    alumniName: "Sophie Martin",
    action: "update",
    field: "email",
    oldValue: "s.martin@old.com",
    newValue: "sophie.martin@email.com",
    modifiedBy: "Admin",
    modifiedAt: "2026-02-15T10:30:00",
  },
  {
    id: "l2",
    alumniId: "4",
    alumniName: "Lucas Petit",
    action: "update",
    field: "currentJob",
    oldValue: "Assistant Chef de Projet",
    newValue: "Chef de Projet",
    modifiedBy: "Admin",
    modifiedAt: "2026-02-14T14:00:00",
  },
  {
    id: "l3",
    alumniId: "11",
    alumniName: "Clara Girard",
    action: "create",
    field: "profil",
    oldValue: "",
    newValue: "Nouveau profil",
    modifiedBy: "Scraper IA",
    modifiedAt: "2026-02-13T09:15:00",
  },
  {
    id: "l4",
    alumniId: "6",
    alumniName: "Hugo Moreau",
    action: "update",
    field: "currentCompany",
    oldValue: "Natixis",
    newValue: "Amundi",
    modifiedBy: "Scraper IA",
    modifiedAt: "2026-02-12T16:45:00",
  },
  {
    id: "l5",
    alumniId: "8",
    alumniName: "Antoine Laurent",
    action: "update",
    field: "linkedinUrl",
    oldValue: "https://linkedin.com/in/alaurent",
    newValue: "https://linkedin.com/in/antoinelaurent",
    modifiedBy: "Admin",
    modifiedAt: "2026-02-11T11:20:00",
  },
]

export const mockJobs: JobPosting[] = [
  {
    id: "j1",
    type: "CDI",
    title: "Growth Marketing Manager",
    company: "Qonto",
    location: "Paris",
    description: "Rejoignez l'equipe Growth de Qonto pour piloter les campagnes d'acquisition B2B. Vous serez en charge de la strategie paid media et de l'optimisation des funnels de conversion.",
    link: "https://jobs.qonto.com/growth",
    postedBy: "Sophie Martin",
    postedAt: "2026-02-18",
    suggestedPromos: [2023, 2024],
  },
  {
    id: "j2",
    type: "CDI",
    title: "Analyste Junior M&A",
    company: "Lazard",
    location: "Paris",
    description: "Poste d'analyste junior au sein de l'equipe M&A. Modelisation financiere, due diligence et preparation de pitch books pour des operations de fusions-acquisitions.",
    link: "https://lazard.com/careers",
    postedBy: "Thomas Durand",
    postedAt: "2026-02-16",
    suggestedPromos: [2025, 2024],
  },
  {
    id: "j3",
    type: "Freelance",
    title: "Data Engineer - Mission 6 mois",
    company: "Veolia",
    location: "Lyon",
    description: "Mission de 6 mois pour construire un pipeline de donnees ETL sur GCP. Experience avec BigQuery, Airflow et dbt requise.",
    link: "https://veolia.com/freelance",
    postedBy: "Julie Roux",
    postedAt: "2026-02-14",
    suggestedPromos: [2021, 2022, 2023],
  },
  {
    id: "j4",
    type: "Stage",
    title: "Stagiaire Consultant Strategy",
    company: "BCG",
    location: "Paris",
    description: "Stage de 6 mois au sein de l'equipe Strategy. Vous participerez aux missions de conseil en strategie pour des clients du CAC 40.",
    link: "https://bcg.com/careers",
    postedBy: "Maxime Fournier",
    postedAt: "2026-02-10",
    suggestedPromos: [2025, 2026],
  },
  {
    id: "j5",
    type: "CDD",
    title: "Chef de Produit Digital - CDD 12 mois",
    company: "Decathlon",
    location: "Lille",
    description: "CDD pour remplacement conge maternite. Pilotage de la roadmap produit de l'app mobile Decathlon.",
    link: "https://decathlon.com/jobs",
    postedBy: "Emma Leroy",
    postedAt: "2026-02-08",
    suggestedPromos: [2022, 2023],
  },
]

export const mockEvents: Event[] = [
  {
    id: "e1",
    title: "Gala Annuel 2026",
    description: "Le grand rendez-vous de l'annee ! Soiree de gala au Pavillon Gabriel avec diner, remise de prix et DJ set. Dress code : cocktail chic.",
    date: "2026-04-15",
    time: "19:30",
    location: "Pavillon Gabriel, Paris",
    type: "gala",
    status: "upcoming",
    attendees: 187,
    maxAttendees: 300,
    imageUrl: null,
  },
  {
    id: "e2",
    title: "Afterwork Tech & Data",
    description: "Soiree networking entre alumni du secteur tech et data. Presentations de 10 minutes par 3 alumni + drinks offerts.",
    date: "2026-03-20",
    time: "19:00",
    location: "Station F, Paris",
    type: "afterwork",
    status: "upcoming",
    attendees: 42,
    maxAttendees: 80,
    imageUrl: null,
  },
  {
    id: "e3",
    title: "Conference IA & Business",
    description: "Table ronde sur l'impact de l'IA dans les metiers du conseil et de la finance. Intervenants : 4 alumni + 1 expert invite.",
    date: "2026-03-05",
    time: "18:00",
    location: "Campus Ecole, Amphi A",
    type: "conference",
    status: "upcoming",
    attendees: 95,
    maxAttendees: 150,
    imageUrl: null,
  },
  {
    id: "e4",
    title: "Workshop CV & LinkedIn",
    description: "Atelier pratique pour optimiser votre CV et votre profil LinkedIn. Anime par Lea Simon, Talent Acquisition Lead chez Alan.",
    date: "2026-02-28",
    time: "14:00",
    location: "Campus Ecole, Salle 302",
    type: "workshop",
    status: "upcoming",
    attendees: 28,
    maxAttendees: 30,
    imageUrl: null,
  },
  {
    id: "e5",
    title: "Afterwork Finance & Conseil",
    description: "Soiree de networking entre alumni travaillant dans la finance et le conseil. Lieu mythique avec vue sur les toits de Paris.",
    date: "2026-01-25",
    time: "19:00",
    location: "Le Perchoir, Paris",
    type: "afterwork",
    status: "past",
    attendees: 65,
    maxAttendees: 70,
    imageUrl: null,
  },
  {
    id: "e6",
    title: "Ceremonie de Remise des Diplomes 2025",
    description: "Ceremonie officielle pour la promotion 2025. Discours du directeur, remise des diplomes et cocktail.",
    date: "2025-12-14",
    time: "15:00",
    location: "Palais des Congres, Paris",
    type: "gala",
    status: "past",
    attendees: 320,
    maxAttendees: 350,
    imageUrl: null,
  },
]

export const mockUpdateRequests: UpdateRequest[] = [
  {
    id: "ur1",
    alumniId: "6",
    alumniName: "Hugo Moreau",
    message: "J'ai change d'entreprise, je suis maintenant chez Amundi et non plus chez Natixis.",
    requestedAt: "2026-02-17T09:30:00",
    resolved: false,
  },
  {
    id: "ur2",
    alumniId: "9",
    alumniName: "Julie Roux",
    message: "Mon poste actuel est Senior ML Engineer, et j'ai demenage a Lyon.",
    requestedAt: "2026-02-15T14:20:00",
    resolved: false,
  },
  {
    id: "ur3",
    alumniId: "12",
    alumniName: "Paul Andre",
    message: "Je ne suis plus chez BNP Paribas, j'ai rejoint Societe Generale.",
    requestedAt: "2026-02-10T11:00:00",
    resolved: true,
  },
]

// ===== STATS =====
export const dashboardStats = {
  totalAlumni: 1247,
  profilesUpToDate: 892,
  profilesToRefresh: 355,
  activeJobPostings: 23,
  upcomingEvents: 4,
  pendingUpdateRequests: 2,
}
