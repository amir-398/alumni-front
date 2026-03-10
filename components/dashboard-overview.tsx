"use client"

import { useState, useEffect } from "react"
import { DashboardStats } from "@/components/dashboard-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/api/admin"
import { eventsApi } from "@/lib/api/events"
import {
  Users,
  Briefcase,
  CalendarDays,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  Plus,
  Mail,
  UserCircle,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function DashboardOverview() {
  const [data, setData] = useState<any>({
    recentAlumni: [],
    recentJobs: [],
    upcomingEvents: [],
    recentLogs: [],
    updateRequests: [],
    stats: {
      totalAlumni: 0,
      profilesUpToDate: 0,
      profilesToRefresh: 0,
      activeJobPostings: 0,
      upcomingEvents: 0,
    }
  })
  const [loading, setLoading] = useState(true)
  const [admins, setAdmins] = useState<any[]>([])
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteData, setInviteData] = useState({ email: "", firstName: "", lastName: "" })
  const [invited, setInvited] = useState(false)
  const { user } = useAuth()
  const isSuperAdmin = user?.role === "super_admin"

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [alumniRes, jobsRes, eventsRes, logsRes, correctionsRes] = await Promise.all<any>([
          adminApi.getAlumni({ limit: 5 }),
          adminApi.getJobs({ limit: 3 }),
          eventsApi.getEvents({ limit: 50 }),
          adminApi.getAuditLogs({ limit: 4 }),
          adminApi.getCorrections({}),
        ])

        setData({
          recentAlumni: alumniRes.items || [],
          recentJobs: jobsRes.items || [],
          upcomingEvents: (eventsRes.items || []).filter((e: any) => e.status === "upcoming").slice(0, 3),
          recentLogs: logsRes.items || [],
          updateRequests: correctionsRes.items || [],
          stats: {
            totalAlumni: alumniRes.total || (alumniRes.items || []).length,
            profilesUpToDate: (alumniRes.items || []).filter((a: any) => a.profile?.status === "up_to_date").length,
            profilesToRefresh: (alumniRes.items || []).filter((a: any) => a.profile?.status !== "up_to_date").length,
            activeJobPostings: jobsRes.total || (jobsRes.items || []).length,
            upcomingEvents: eventsRes.total || (eventsRes.items || []).length,
          }
        })

        if (isSuperAdmin) {
          const allUsers = await adminApi.getAlumni({ limit: 100 }) as any
          setAdmins(allUsers.items.filter((u: any) => u.role === "ADMIN"))
        }
      } catch (err) {
        console.error("Dashboard loaded failed", err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  const { recentAlumni, recentJobs, upcomingEvents, recentLogs, updateRequests } = data

  const handleCorrection = async (id: string | number, action: "approve" | "reject") => {
    try {
      if (action === "approve") {
        await adminApi.approveCorrection(id)
      } else {
        await adminApi.rejectCorrection(id)
      }
      // Refresh dashboard
      window.location.reload()
    } catch (err) {
      console.error(`Failed to ${action} correction`, err)
    }
  }

  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await adminApi.createAlumni({
        ...inviteData,
        role: "ADMIN"
      })
      setInvited(true)
      // Refresh admin list
      const allUsers = await adminApi.getAlumni({ limit: 100 }) as any
      setAdmins(allUsers.items.filter((u: any) => u.role === "ADMIN"))
      
      setTimeout(() => {
        setInviteDialogOpen(false)
        setInvited(false)
        setInviteData({ email: "", firstName: "", lastName: "" })
      }, 1500)
    } catch (err) {
      console.error("Failed to invite admin", err)
      alert("Erreur lors de l'invitation de l'administrateur.")
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Chargement du tableau de bord...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Tableau de bord</h2>
        <p className="text-sm text-muted-foreground">Vue d&apos;ensemble du reseau alumni</p>
      </div>

      <DashboardStats {...data.stats} />

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
              {recentAlumni.map((alumni: any) => (
                <div key={alumni.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {(alumni.profile?.first_name?.[0] || alumni.email?.[0] || "?").toUpperCase()}
                      {(alumni.profile?.last_name?.[0] || "").toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {alumni.profile?.first_name || ""} {alumni.profile?.last_name || alumni.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alumni.profile?.current_title || "Alumni"} {alumni.profile?.current_company ? `- ${alumni.profile.current_company}` : ""}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {alumni.profile?.graduation_year || "N/A"}
                  </Badge>
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
              {recentJobs.map((job: any) => (
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
              {upcomingEvents.map((event: any) => (
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
                {updateRequests.filter((r: any) => r.status === "pending").length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {updateRequests
                .filter((r: any) => r.status === "pending")
                .map((req: any) => (
                  <div key={req.id} className="flex items-start gap-3 p-3 rounded-lg bg-chart-3/5 border border-chart-3/20">
                    <AlertTriangle className="w-4 h-4 text-chart-3 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">Alumni #{req.alumni_user_id}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">Correction: {req.field} ➔ {req.proposed_value}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2 text-accent hover:text-accent hover:bg-accent/10"
                            onClick={() => handleCorrection(req.id, "approve")}
                          >
                            Accepter
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleCorrection(req.id, "reject")}
                          >
                            Refuser
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(req.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              {updateRequests.filter((r: any) => r.status !== "pending").length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <CheckCircle className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs text-muted-foreground">
                    {updateRequests.filter((r: any) => r.status !== "pending").length} demande(s) traitee(s)
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
              {recentLogs.map((log: any) => (
                <div key={log.id} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">User #{log.actor_user_id}</span>
                      {" "}a effectue l&apos;action{" "}
                      <span className="font-medium">{log.action}</span>
                      {" "}sur{" "}
                      <span className="font-medium">{log.target_type}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString("fr-FR", {
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

        {/* SUPER ADMIN ONLY: Admin Management Quick Access */}
        {isSuperAdmin && (
          <Card className="border border-border lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sidebar-primary" />
                Gestion des Administrateurs
              </CardTitle>
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90">
                    <Plus className="w-4 h-4" />
                    Ajouter un Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Inviter un administrateur</DialogTitle>
                  </DialogHeader>
                  {!invited ? (
                    <form onSubmit={handleInviteAdmin} className="flex flex-col gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="admin-email">Email</Label>
                        <Input 
                          id="admin-email" 
                          type="email" 
                          required 
                          value={inviteData.email}
                          onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="admin-first">Prenom</Label>
                          <Input 
                            id="admin-first" 
                            value={inviteData.firstName}
                            onChange={(e) => setInviteData({...inviteData, firstName: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="admin-last">Nom</Label>
                          <Input 
                            id="admin-last" 
                            value={inviteData.lastName}
                            onChange={(e) => setInviteData({...inviteData, lastName: e.target.value})}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Envoyer l&apos;invitation
                        </Button>
                      </DialogFooter>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                      <CheckCircle className="w-12 h-12 text-accent" />
                      <p className="font-medium">Invitation envoyee !</p>
                      <p className="text-sm text-muted-foreground">L&apos;administrateur sera ajoute a la liste.</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {admins.map((admin: any) => (
                  <div key={admin.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <div className="w-10 h-10 rounded-full bg-sidebar-primary/10 flex items-center justify-center text-xs font-semibold text-sidebar-primary">
                      {admin.profile?.first_name?.[0] || <UserCircle className="w-5 h-5 text-muted-foreground" />}
                      {admin.profile?.last_name?.[0] || ""}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {admin.profile?.first_name || ""} {admin.profile?.last_name || admin.email}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant={admin.is_verified ? "secondary" : "outline"} className="text-[10px] h-4 px-1.5">
                          {admin.is_verified ? "Vérifié" : "Invité"}
                        </Badge>
                        <p className="text-[10px] text-muted-foreground truncate">{admin.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
