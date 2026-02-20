"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockJobs, type JobType } from "@/lib/mock-data"
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

  const filtered = mockJobs.filter((job) => {
    if (filterType !== "all" && job.type !== filterType) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      )
    }
    return true
  })

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
                  <Select defaultValue="CDI">
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
                  <Input id="job-location" placeholder="Paris" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="job-title">Titre du poste</Label>
                <Input id="job-title" placeholder="Ex: Growth Marketing Manager" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="job-company">Entreprise</Label>
                <Input id="job-company" placeholder="Ex: Qonto" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="job-desc">Description</Label>
                <Textarea id="job-desc" placeholder="Decrivez le poste..." rows={3} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="job-link">Lien de l&apos;offre</Label>
                <Input id="job-link" placeholder="https://..." className="mt-1" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button onClick={() => setDialogOpen(false)}>Publier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
                    <Badge className={typeColors[job.type]}>{job.type}</Badge>
                  </div>
                  <CardTitle className="text-base">{job.title}</CardTitle>
                  <p className="text-sm font-medium text-muted-foreground mt-1">{job.company}</p>
                </div>
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
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Promos cibles : {job.suggestedPromos.join(", ")}
                    </span>
                  </div>
                )}
                {!isAdmin && <div />}
                <a href={job.link} target="_blank" rel="noopener noreferrer">
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
