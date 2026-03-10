"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import {
  Users,
  CheckCircle,
  Briefcase,
  CalendarDays,
  AlertTriangle,
} from "lucide-react"

interface StatItem {
  label: string
  value: string | number
  icon: typeof Users
  color: string
  bgColor: string
  hideForStaff?: boolean
}

interface DashboardStatsProps {
  totalAlumni?: number
  profilesUpToDate?: number
  profilesToRefresh?: number
  activeJobPostings?: number
  upcomingEvents?: number
}

export function DashboardStats({
  totalAlumni = 0,
  profilesUpToDate = 0,
  profilesToRefresh = 0,
  activeJobPostings = 0,
  upcomingEvents = 0
}: DashboardStatsProps) {
  const { user } = useAuth()
  const isStaff = user?.role === "staff"

  const allStats: StatItem[] = [
    {
      label: "Total Alumni",
      value: totalAlumni.toLocaleString("fr-FR"),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Profils a jour",
      value: profilesUpToDate.toLocaleString("fr-FR"),
      icon: CheckCircle,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "A rafraichir",
      value: profilesToRefresh.toLocaleString("fr-FR"),
      icon: AlertTriangle,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      hideForStaff: true,
    },
    {
      label: "Offres actives",
      value: activeJobPostings.toString(),
      icon: Briefcase,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "Evenements a venir",
      value: upcomingEvents.toString(),
      icon: CalendarDays,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  const visibleStats = isStaff ? allStats.filter((s) => !s.hideForStaff) : allStats

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {visibleStats.map((stat) => (
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
