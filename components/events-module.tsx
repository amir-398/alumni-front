"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockEvents, type Event } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
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
  CalendarDays,
  Clock,
  MapPin,
  Users,
  PartyPopper,
  Wine,
  Mic2,
  BookOpen,
  CheckCircle,
  Plus,
  Pencil,
} from "lucide-react"

const typeConfig: Record<Event["type"], { label: string; icon: React.ElementType; color: string }> = {
  gala: { label: "Gala", icon: PartyPopper, color: "bg-chart-3/15 text-chart-3 border border-chart-3/30" },
  afterwork: { label: "Afterwork", icon: Wine, color: "bg-chart-1/15 text-chart-1 border border-chart-1/30" },
  conference: { label: "Conference", icon: Mic2, color: "bg-chart-2/15 text-chart-2 border border-chart-2/30" },
  workshop: { label: "Workshop", icon: BookOpen, color: "bg-chart-4/15 text-chart-4 border border-chart-4/30" },
}

export function EventsModule() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin" || user?.role === "super_admin"
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all")
  const [rsvpEvents, setRsvpEvents] = useState<Set<string>>(new Set())
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const filtered = mockEvents.filter((e) => {
    if (filter === "all") return true
    return e.status === filter
  })

  const handleRSVP = (eventId: string) => {
    setRsvpEvents((prev) => {
      const next = new Set(prev)
      if (next.has(eventId)) {
        next.delete(eventId)
      } else {
        next.add(eventId)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Evenements</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} evenements</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Creer un evenement</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="event-title">Titre</Label>
                    <Input id="event-title" placeholder="Nom de l'evenement" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="event-desc">Description</Label>
                    <Textarea id="event-desc" placeholder="Decrivez l'evenement..." rows={3} className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-date">Date</Label>
                      <Input id="event-date" type="date" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="event-time">Heure</Label>
                      <Input id="event-time" type="time" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="event-location">Lieu</Label>
                    <Input id="event-location" placeholder="Adresse du lieu" className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-type">Type</Label>
                      <Select defaultValue="afterwork">
                        <SelectTrigger id="event-type" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gala">Gala</SelectItem>
                          <SelectItem value="afterwork">Afterwork</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="event-max">Places max</Label>
                      <Input id="event-max" type="number" placeholder="100" className="mt-1" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Annuler</Button>
                  <Button onClick={() => setAddDialogOpen(false)}>Creer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {(["all", "upcoming", "past"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Tous" : f === "upcoming" ? "A venir" : "Passes"}
            </Button>
          ))}
        </div>
      </div>

      {/* Edit event dialog */}
      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;evenement</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="edit-event-title">Titre</Label>
                <Input id="edit-event-title" defaultValue={editingEvent.title} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="edit-event-desc">Description</Label>
                <Textarea id="edit-event-desc" defaultValue={editingEvent.description} rows={3} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-event-date">Date</Label>
                  <Input id="edit-event-date" type="date" defaultValue={editingEvent.date} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="edit-event-time">Heure</Label>
                  <Input id="edit-event-time" type="time" defaultValue={editingEvent.time} className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-event-location">Lieu</Label>
                <Input id="edit-event-location" defaultValue={editingEvent.location} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-event-type">Type</Label>
                  <Select defaultValue={editingEvent.type}>
                    <SelectTrigger id="edit-event-type" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gala">Gala</SelectItem>
                      <SelectItem value="afterwork">Afterwork</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-event-max">Places max</Label>
                  <Input id="edit-event-max" type="number" defaultValue={editingEvent.maxAttendees} className="mt-1" />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEvent(null)}>Annuler</Button>
            <Button onClick={() => setEditingEvent(null)}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((event) => {
          const config = typeConfig[event.type]
          const Icon = config.icon
          const fillPercent = Math.round((event.attendees / event.maxAttendees) * 100)
          const isRsvped = rsvpEvents.has(event.id)

          return (
            <Card
              key={event.id}
              className={`border border-border hover:shadow-md transition-shadow ${
                event.status === "past" ? "opacity-75" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={config.color}>
                        <Icon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                      {event.status === "past" && (
                        <Badge variant="secondary">Termine</Badge>
                      )}
                    </div>
                    <CardTitle className="text-base">{event.title}</CardTitle>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 shrink-0"
                      onClick={() => setEditingEvent(event)}
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(event.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {event.attendees + (isRsvped ? 1 : 0)} / {event.maxAttendees} inscrits
                    </span>
                    <span>{fillPercent}%</span>
                  </div>
                  <Progress value={fillPercent} className="h-1.5" />
                </div>

                {event.status === "upcoming" && (
                  <Button
                    variant={isRsvped ? "outline" : "default"}
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => handleRSVP(event.id)}
                  >
                    {isRsvped ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Inscrit
                      </>
                    ) : (
                      "Je participe"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
