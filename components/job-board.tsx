"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { jobsApi } from "@/lib/api/jobs"
import { type JobType } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Briefcase,
  MapPin,
  ExternalLink,
  Plus,
  Clock,
  Users,
  Search,
  Pencil,
} from "lucide-react"

const typeColors: Record<JobType, string> = {
  CDI: "bg-accent text-accent-foreground",
  CDD: "bg-chart-3/15 text-chart-3 border border-chart-3/30",
  Freelance: "bg-chart-1/15 text-chart-1 border border-chart-1/30",
  Stage: "bg-chart-4/15 text-chart-4 border border-chart-4/30",
}

export function JobBoard() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin" || user?.role === "super_admin"
  const [filterType, setFilterType] = useState("all")
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<any | null>(null)
  const [editForm, setEditForm] = useState<any>(null)

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [newJob, setNewJob] = useState({
    title: "",
    company_name: "",
    location: "",
    type: "CDI",
    description: "",
    external_link: "",
  })

  const refreshJobs = () => {
    setLoading(true)
    jobsApi.getJobs({ limit: 100 }).then(res => {
      const mapped = res.items.map((job: any) => ({
        id: job.id,
        type: job.type as JobType,
        title: job.title,
        company_name: job.company_name, // Match backend
        location: job.location,
        description: job.description,
        external_link: job.external_link, // Match backend
        postedBy: job.author_info ? `${job.author_info.first_name} ${job.author_info.last_name}` : "Inconnu",
        postedAt: job.created_at || new Date().toISOString(),
        suggestedPromos: job.suggestedPromos || [],
        status: job.status,
        author_id: job.author_id,
      }))
      setData(mapped)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => {
    refreshJobs()
  }, [])

  const handleCreateJob = async () => {
    try {
      await jobsApi.createJob(newJob)
      setDialogOpen(false)
      setNewJob({
        title: "",
        company_name: "",
        location: "",
        type: "CDI",
        description: "",
        external_link: "",
      })
      alert("L'offre a été publiée avec succès.")
      refreshJobs()
    } catch (err: any) {
      console.error("Failed to create job", err)
      alert(err.message || "Erreur lors de la création de l'offre.")
    }
  }

  const handleDeleteJob = async (id: string | number) => {
    if (confirm("Etes-vous sur de vouloir supprimer cette offre ?")) {
      try {
        await jobsApi.deleteJob(id)
        refreshJobs()
      } catch (err) {
        console.error("Failed to delete job", err)
      }
    }
  }

  const handleUpdateJob = async () => {
    if (!editForm) return
    try {
      await jobsApi.updateJob(editForm.id, {
        title: editForm.title,
        company_name: editForm.company_name,
        location: editForm.location,
        type: editForm.type,
        description: editForm.description,
        external_link: editForm.external_link,
      })
      setEditingJob(null)
      setEditForm(null)
      refreshJobs()
    } catch (err) {
      console.error("Failed to update job", err)
    }
  }

  const handleModerateJob = async (id: string | number, status: "APPROVED" | "REJECTED") => {
    try {
      const { adminApi } = await import("@/lib/api/admin")
      await adminApi.moderateJob(id, status)
      refreshJobs()
    } catch (err) {
      console.error("Failed to moderate job", err)
    }
  }

  const filtered = data.filter((job) => {
    if (filterType !== "all" && job.type !== filterType) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        job.title.toLowerCase().includes(q) ||
        job.company_name.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      )
    }
    return true
  })

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Chargement des offres...</div>
  }

  if (data.length === 0 && !loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Aucune offre d'emploi disponible pour le moment.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Annonces & Offres</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} offres disponibles</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {isAdmin && (
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Publier une offre
            </Button>
          </DialogTrigger>
        )}
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Publier une offre</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="job-type">Type de contrat</Label>
                  <Select
                    value={newJob.type}
                    onValueChange={(val) => setNewJob({ ...newJob, type: val })}
                  >
                    <SelectTrigger id="job-type" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CDI">CDI</SelectItem>
                      <SelectItem value="CDD">CDD</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Stage">Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="job-location">Lieu</Label>
                  <Input
                    id="job-location"
                    placeholder="Paris"
                    className="mt-1"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="job-title">Titre du poste</Label>
                <Input
                  id="job-title"
                  placeholder="Ex: Growth Marketing Manager"
                  className="mt-1"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="job-company">Entreprise</Label>
                <Input
                  id="job-company"
                  placeholder="Ex: Qonto"
                  className="mt-1"
                  value={newJob.company_name}
                  onChange={(e) => setNewJob({ ...newJob, company_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="job-desc">Description</Label>
                <Textarea
                  id="job-desc"
                  placeholder="Decrivez le poste..."
                  rows={3}
                  className="mt-1"
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="job-link">Lien de l&apos;offre</Label>
                <Input
                  id="job-link"
                  placeholder="https://..."
                  className="mt-1"
                  value={newJob.external_link}
                  onChange={(e) => setNewJob({ ...newJob, external_link: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleCreateJob} disabled={!newJob.title || !newJob.company_name}>Publier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Job Dialog */}
      <Dialog open={!!editingJob} onOpenChange={(open) => !open && setEditingJob(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;offre</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-job-type">Type de contrat</Label>
                  <Select
                    value={editForm.type}
                    onValueChange={(val) => setEditForm({ ...editForm, type: val })}
                  >
                    <SelectTrigger id="edit-job-type" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CDI">CDI</SelectItem>
                      <SelectItem value="CDD">CDD</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Stage">Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-job-location">Lieu</Label>
                  <Input
                    id="edit-job-location"
                    value={editForm.location}
                    className="mt-1"
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-job-title">Titre du poste</Label>
                <Input
                  id="edit-job-title"
                  value={editForm.title}
                  className="mt-1"
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-job-company">Entreprise</Label>
                <Input
                  id="edit-job-company"
                  value={editForm.company_name}
                  className="mt-1"
                  onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-job-desc">Description</Label>
                <Textarea
                  id="edit-job-desc"
                  value={editForm.description}
                  rows={3}
                  className="mt-1"
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-job-link">Lien de l&apos;offre</Label>
                <Input
                  id="edit-job-link"
                  value={editForm.external_link}
                  className="mt-1"
                  onChange={(e) => setEditForm({ ...editForm, external_link: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingJob(null); setEditForm(null); }}>Annuler</Button>
            <Button onClick={handleUpdateJob}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="p-4 border border-border">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par titre, entreprise, lieu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous types</SelectItem>
              <SelectItem value="CDI">CDI</SelectItem>
              <SelectItem value="CDD">CDD</SelectItem>
              <SelectItem value="Freelance">Freelance</SelectItem>
              <SelectItem value="Stage">Stage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((job) => (
          <Card key={job.id} className="border border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={typeColors[job.type as JobType]}>{job.type}</Badge>
                    {isAdmin && (
                      <Badge variant={job.status === "APPROVED" ? "outline" : "secondary"}>
                        {job.status === "APPROVED" ? "Publie" : "En attente"}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base">{job.title}</CardTitle>
                  <p className="text-sm font-medium text-muted-foreground mt-1">{job.company_name}</p>
                </div>
                {isAdmin && (
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setEditingJob(job)
                        setEditForm({ ...job })
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      <Plus className="w-4 h-4 rotate-45" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(job.postedAt).toLocaleDateString("fr-FR")}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  Par {job.postedBy}
                </span>
              </div>

              <div className="flex items-center justify-between">
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    {job.status !== "APPROVED" && (
                      <div className="flex gap-1 mr-2 border-r border-border pr-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-accent hover:text-accent hover:bg-accent/10"
                          onClick={() => handleModerateJob(job.id, "APPROVED")}
                        >
                          Approuver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleModerateJob(job.id, "REJECTED")}
                        >
                          Rejeter
                        </Button>
                      </div>
                    )}
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Promos cibles : {job.suggestedPromos.join(", ")}
                    </span>
                  </div>
                )}
                {!isAdmin && <div />}
                <a href={job.external_link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ExternalLink className="w-3 h-3" />
                    Voir l&apos;offre
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
