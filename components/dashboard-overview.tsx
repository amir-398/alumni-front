"use client"

import { DashboardStats } from "@/components/dashboard-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockAlumni, mockJobs, mockEvents, mockLogs, mockUpdateRequests } from "@/lib/mock-data"
import {
  Users,
  Briefcase,
  CalendarDays,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

export function DashboardOverview() {
  const recentAlumni = mockAlumni.slice(0, 5)
  const recentJobs = mockJobs.slice(0, 3)
  const upcomingEvents = mockEvents.filter((e) => e.status === "upcoming").slice(0, 3)
  const recentLogs = mockLogs.slice(0, 4)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Tableau de bord</h2>
        <p className="text-sm text-muted-foreground">Vue d&apos;ensemble du reseau alumni</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alumni */}
        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Derniers profils mis a jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentAlumni.map((alumni) => (
                <div key={alumni.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {alumni.firstName[0]}{alumni.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {alumni.firstName} {alumni.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alumni.currentJob} - {alumni.currentCompany}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">{alumni.promoYear}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Dernieres offres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge
                        className={
                          job.type === "CDI"
                            ? "bg-accent text-accent-foreground text-xs"
                            : "bg-chart-1/15 text-chart-1 border border-chart-1/30 text-xs"
                        }
                      >
                        {job.type}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.company} - {job.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              Prochains evenements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(event.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                      <span>-</span>
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {event.attendees}/{event.maxAttendees}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Update Requests from Alumni */}
        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-chart-3" />
              Demandes de mise a jour
              <Badge variant="secondary" className="ml-1 text-xs">
                {mockUpdateRequests.filter((r) => !r.resolved).length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {mockUpdateRequests
                .filter((r) => !r.resolved)
                .map((req) => (
                  <div key={req.id} className="flex items-start gap-3 p-3 rounded-lg bg-chart-3/5 border border-chart-3/20">
                    <AlertTriangle className="w-4 h-4 text-chart-3 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{req.alumniName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{req.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(req.requestedAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              {mockUpdateRequests.filter((r) => r.resolved).length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <CheckCircle className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs text-muted-foreground">
                    {mockUpdateRequests.filter((r) => r.resolved).length} demande(s) traitee(s)
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Activite recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{log.modifiedBy}</span>
                      {" "}a modifie{" "}
                      <span className="font-medium">{log.field}</span>
                      {" "}de{" "}
                      <span className="font-medium">{log.alumniName}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.modifiedAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
