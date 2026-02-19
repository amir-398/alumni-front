"use client"

import { Card, CardContent } from "@/components/ui/card"
import { dashboardStats } from "@/lib/mock-data"
import {
  Users,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  CalendarDays,
  Mail,
} from "lucide-react"

const stats = [
  {
    label: "Total Alumni",
    value: dashboardStats.totalAlumni.toLocaleString("fr-FR"),
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Profils a jour",
    value: dashboardStats.profilesUpToDate.toLocaleString("fr-FR"),
    icon: CheckCircle,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    label: "A rafraichir",
    value: dashboardStats.profilesToRefresh.toLocaleString("fr-FR"),
    icon: AlertTriangle,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    label: "Offres actives",
    value: dashboardStats.activeJobPostings.toString(),
    icon: Briefcase,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    label: "Evenements a venir",
    value: dashboardStats.upcomingEvents.toString(),
    icon: CalendarDays,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    label: "Demandes contact / mois",
    value: dashboardStats.contactRequestsThisMonth.toString(),
    icon: Mail,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border border-border">
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
