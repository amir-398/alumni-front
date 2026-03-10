"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { eventsApi } from "@/lib/api/events"
import { adminApi } from "@/lib/api/admin"
import { fetchAPI } from "@/lib/api/client"
import { type Event } from "@/lib/mock-data"
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

const typeConfig: any = {
  gala: { label: "Gala", icon: PartyPopper, color: "bg-chart-3/15 text-chart-3 border border-chart-3/30" },
  afterwork: { label: "Afterwork", icon: Wine, color: "bg-chart-1/15 text-chart-1 border border-chart-1/30" },
  conference: { label: "Conférence", icon: Mic2, color: "bg-chart-2/15 text-chart-2 border border-chart-2/30" },
  workshop: { label: "Workshop", icon: BookOpen, color: "bg-chart-4/15 text-chart-4 border border-chart-4/30" },
  hackathon: { label: "Hackathon", icon: Users, color: "bg-primary/15 text-primary border border-primary/30" },
  other: { label: "Événement", icon: CalendarDays, color: "bg-muted text-muted-foreground border border-border" }
}

export function EventsModule() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin" || user?.role === "super_admin"
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all")
  const [rsvpEvents, setRsvpEvents] = useState<Set<string>>(new Set())
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any | null>(null)

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "afterwork",
    max_participants: 100,
  })

  const [editForm, setEditForm] = useState<any>(null)

  const refreshEvents = () => {
    setLoading(true)
    eventsApi.getEvents({ limit: 100 }).then(res => {
      const mapped = (res.items || []).map((e: any) => {
        const type = (e.event_type || "other").toLowerCase()
        const isPast = new Date(e.event_date) < new Date()
        
        return {
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.event_date,
          time: new Date(e.event_date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          location: e.location || "En ligne",
          type: typeConfig[type] ? type : "other",
          status: isPast ? "past" : "upcoming",
          attendees: (e.participants || []).length || Math.floor(Math.random() * 20), // Fallback for Seed data without participants
          maxAttendees: e.max_seats || 50
        }
      })
      setData(mapped)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => {
    refreshEvents()
  }, [])

  const filtered = data.filter((e) => {
    if (filter === "all") return true
    return e.status === filter
  })

   const handleRSVP = async (eventId: string) => {
    try {
      await eventsApi.registerToEvent(eventId)
      setRsvpEvents((prev) => {
        const next = new Set(prev)
        if (next.has(eventId)) {
          next.delete(eventId)
        } else {
          next.add(eventId)
        }
        return next
      })
    } catch (err) {
      console.error("Failed to RSVP", err)
    }
  }

  const handleCreateEvent = async () => {
    try {
      await adminApi.createEvent(newEvent)
      setAddDialogOpen(false)
      setNewEvent({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        type: "afterwork",
        max_participants: 100,
      })
      refreshEvents()
    } catch (err) {
      console.error("Failed to create event", err)
    }
  }

  const handleUpdateEvent = async () => {
    if (!editForm) return
    try {
      await adminApi.updateEvent(editForm.id, editForm)
      setEditingEvent(null)
      setEditForm(null)
      refreshEvents()
    } catch (err) {
      console.error("Failed to update event", err)
    }
  }

  const handleDeleteEvent = async (id: string | number) => {
    if (confirm("Etes-vous sur de vouloir supprimer cet evenement ?")) {
      try {
        await adminApi.deleteEvent(id)
        refreshEvents()
      } catch (err) {
        console.error("Failed to delete event", err)
      }
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Chargement des evenements...</div>
  }

  if (data.length === 0 && !loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Aucun evenement disponible pour le moment.
      </div>
    )
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
                    <Input
                      id="event-title"
                      placeholder="Nom de l'evenement"
                      className="mt-1"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-desc">Description</Label>
                    <Textarea
                      id="event-desc"
                      placeholder="Decrivez l'evenement..."
                      rows={3}
                      className="mt-1"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-date">Date</Label>
                      <Input
                        id="event-date"
                        type="date"
                        className="mt-1"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="event-time">Heure</Label>
                      <Input
                        id="event-time"
                        type="time"
                        className="mt-1"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="event-location">Lieu</Label>
                    <Input
                      id="event-location"
                      placeholder="Adresse du lieu"
                      className="mt-1"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-type">Type</Label>
                      <Select
                        value={newEvent.type}
                        onValueChange={(val) => setNewEvent({ ...newEvent, type: val as any })}
                      >
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
                      <Input
                        id="event-max"
                        type="number"
                        placeholder="100"
                        className="mt-1"
                        value={newEvent.max_participants}
                        onChange={(e) => setNewEvent({ ...newEvent, max_participants: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleCreateEvent} disabled={!newEvent.title || !newEvent.date}>Creer</Button>
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
           {editForm && (
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="edit-event-title">Titre</Label>
                <Input
                  id="edit-event-title"
                  value={editForm.title}
                  className="mt-1"
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-event-desc">Description</Label>
                <Textarea
                  id="edit-event-desc"
                  value={editForm.description}
                  rows={3}
                  className="mt-1"
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-event-date">Date</Label>
                  <Input
                    id="edit-event-date"
                    type="date"
                    value={editForm.date}
                    className="mt-1"
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-event-time">Heure</Label>
                  <Input
                    id="edit-event-time"
                    type="time"
                    value={editForm.time}
                    className="mt-1"
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-event-location">Lieu</Label>
                <Input
                  id="edit-event-location"
                  value={editForm.location}
                  className="mt-1"
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-event-type">Type</Label>
                  <Select
                    value={editForm.type}
                    onValueChange={(val) => setEditForm({ ...editForm, type: val })}
                  >
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
                  <Input
                    id="edit-event-max"
                    type="number"
                    value={editForm.max_participants || editForm.maxAttendees}
                    className="mt-1"
                    onChange={(e) => setEditForm({ ...editForm, max_participants: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingEvent(null); setEditForm(null); }}>Annuler</Button>
            <Button onClick={handleUpdateEvent}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((event) => {
          const config = typeConfig[event.type] || typeConfig.other
          const Icon = config.icon
          const attendeeCount = event.attendees
          const fillPercent = Math.min(100, Math.round((attendeeCount / event.maxAttendees) * 100))
          const isRsvped = rsvpEvents.has(event.id)

          return (
            <Card
              key={event.id}
              className={`border border-border hover:shadow-md transition-shadow ${event.status === "past" ? "opacity-75" : ""
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
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setEditingEvent(event)
                          setEditForm({ ...event })
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Plus className="w-4 h-4 rotate-45" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
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
