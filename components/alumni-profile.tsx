"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Alumni } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Mail,
  ExternalLink,
  Edit3,
  Save,
  X,
  Send,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Loader2,
} from "lucide-react"

interface AlumniProfileProps {
  alumni: Alumni
  onBack: () => void
  onUpdate?: () => void
}

export function AlumniProfile({ alumni, onBack, onUpdate }: AlumniProfileProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin" || user?.role === "super_admin"
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ ...alumni })
  const [contactSent, setContactSent] = useState(false)
  const [isEnriching, setIsEnriching] = useState(false)
  const [isStatusChanging, setIsStatusChanging] = useState(false)
  const [localData, setLocalData] = useState({ ...alumni })
  const [contactOpen, setContactOpen] = useState(false)
  const [contactMessage, setContactMessage] = useState("")

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "Pas encore de scan"
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return "Pas encore de scan"
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Sync with prop if it changes
  useEffect(() => {
    setLocalData({ ...alumni })
    setEditData({ ...alumni })
  }, [alumni])

  const handleSave = async () => {
    try {
      const { adminApi } = await import("@/lib/api/admin")

      // Filter payload to avoid sending empty strings for optional/strict fields (like email)
      const payload: any = {}
      if (editData.firstName?.trim()) payload.first_name = editData.firstName
      if (editData.lastName?.trim()) payload.last_name = editData.lastName
      if (editData.email?.trim()) payload.email = editData.email
      if (editData.linkedinUrl?.trim()) payload.linkedin_url = editData.linkedinUrl
      if (editData.currentJob?.trim()) payload.current_title = editData.currentJob
      if (editData.currentCompany?.trim()) payload.current_company = editData.currentCompany
      if (editData.city?.trim()) payload.city = editData.city
      if (editData.promoYear) {
        const year = Number(editData.promoYear)
        if (!isNaN(year) && year > 1900) payload.graduation_year = year
      }
      if (editData.diploma?.trim()) payload.diploma = editData.diploma

      await adminApi.updateAlumni(alumni.id, payload)
      // Update local view immediately
      setLocalData({ ...editData })
      setIsEditing(false)
      if (onUpdate) onUpdate()
    } catch (err) {
      console.error("Failed to update alumni", err)
    }
  }

  const handleTriggerEnrichment = async () => {
    setIsEnriching(true)
    try {
      const { adminApi } = await import("@/lib/api/admin")
      await adminApi.triggerEnrichment(alumni.id)

      // Artificial delay for better UX (as requested "fake the rescan")
      await new Promise(r => setTimeout(r, 2000))

      // Update local status to show it's "Done"
      setLocalData(prev => ({
        ...prev,
        lastScrapDate: new Date().toISOString(),
        scrapeStatus: "SUCCEEDED",
        status: "up_to_date"
      }))

      // We don't onUpdate here to avoid the background refresh 
      // overwriting our "fake" successful scan with stale data from DB
      // if (onUpdate) onUpdate()
    } catch (err) {
      console.error("Failed to trigger enrichment", err)
    } finally {
      setIsEnriching(false)
    }
  }

  const handleToggleStatus = async () => {
    setIsStatusChanging(true)
    try {
      const { adminApi } = await import("@/lib/api/admin")
      const newStatus = !localData.is_active

      // We can use updateAlumni to set is_active
      await adminApi.updateAlumni(alumni.id, { is_active: newStatus })

      setLocalData(prev => ({ ...prev, is_active: newStatus }))
      if (onUpdate) onUpdate()
    } catch (err) {
      console.error("Failed to toggle account status", err)
    } finally {
      setIsStatusChanging(false)
    }
  }

  const handleSendContact = () => {
    setContactSent(true)
    setTimeout(() => {
      setContactSent(false)
      setContactOpen(false)
      setContactMessage("")
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 border border-border">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {localData.firstName?.[0] || ""}{localData.lastName?.[0] || ""}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">
                {localData.firstName} {localData.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{localData.currentJob}</p>
              <p className="text-sm font-medium text-foreground">{localData.currentCompany}</p>
            </div>

            <Badge
              variant={(localData.status === "up_to_date" || localData.scrapeStatus === "SUCCEEDED") ? "default" : "outline"}
              className={
                (localData.status === "up_to_date" || localData.scrapeStatus === "SUCCEEDED")
                  ? "bg-accent text-accent-foreground"
                  : (localData.scrapeStatus === "RUNNING" || isEnriching) ? "bg-primary/20 text-primary border-primary/30" : "border-chart-3 text-chart-3"
              }
            >
              {(isEnriching || localData.scrapeStatus === "RUNNING") ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Scan en cours...
                </>
              ) : (localData.status === "up_to_date" || localData.scrapeStatus === "SUCCEEDED") ? "Profil à jour" : "À rafraîchir"}
            </Badge>

            {!localData.is_active && (
              <Badge variant="destructive" className="mt-1">
                Compte désactivé
              </Badge>
            )}

            <div className="w-full flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{localData.diploma}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">Promo {localData.promoYear}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{localData.city}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{localData.currentJob}</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2 pt-4">
              <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2">
                    <Send className="w-4 h-4" />
                    Contacter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contacter {alumni.firstName} {alumni.lastName}</DialogTitle>
                    <DialogDescription>
                      Votre message sera envoye par email. L&apos;alumni recevra votre nom et votre message.
                    </DialogDescription>
                  </DialogHeader>
                  {contactSent ? (
                    <div className="py-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                        <Send className="w-6 h-6 text-accent" />
                      </div>
                      <p className="font-semibold text-foreground">Message envoye !</p>
                      <p className="text-sm text-muted-foreground">
                        {alumni.firstName} recevra votre demande de contact.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-4">
                        <div>
                          <Label htmlFor="contact-msg">Votre message</Label>
                          <Textarea
                            id="contact-msg"
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder="Bonjour, je souhaiterais echanger avec vous au sujet de..."
                            rows={4}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setContactOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleSendContact} disabled={!contactMessage.trim()}>
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>

              <a
                href={alumni.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Voir LinkedIn
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Detail Card */}
        <Card className="lg:col-span-2 border border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Informations detaillees</CardTitle>
            {isAdmin && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                <Edit3 className="w-4 h-4" />
                Modifier
              </Button>
            )}
            {isAdmin && isEditing && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setIsEditing(false); setEditData({ ...alumni }) }} className="gap-2">
                  <X className="w-4 h-4" />
                  Annuler
                </Button>
                <Button size="sm" onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Prenom</Label>
                {isEditing ? (
                  <Input
                    value={editData.firstName}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-foreground font-medium">{localData.firstName}</p>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Nom</Label>
                {isEditing ? (
                  <Input
                    value={editData.lastName}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-foreground font-medium">{localData.lastName}</p>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Email</Label>
                {isEditing ? (
                  <Input
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <a href={`mailto:${localData.email}`} className="mt-1 block text-primary hover:underline">
                    <Mail className="w-3 h-3 inline mr-1" />
                    {localData.email}
                  </a>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">LinkedIn</Label>
                {isEditing ? (
                  <Input
                    value={editData.linkedinUrl}
                    onChange={(e) => setEditData({ ...editData, linkedinUrl: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <a href={localData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-primary hover:underline truncate">
                    <ExternalLink className="w-3 h-3 inline mr-1" />
                    {localData.linkedinUrl}
                  </a>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Poste actuel</Label>
                {isEditing ? (
                  <Input
                    value={editData.currentJob}
                    onChange={(e) => setEditData({ ...editData, currentJob: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-foreground font-medium">{localData.currentJob}</p>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Entreprise</Label>
                {isEditing ? (
                  <Input
                    value={editData.currentCompany}
                    onChange={(e) => setEditData({ ...editData, currentCompany: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-foreground font-medium">{localData.currentCompany}</p>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Ville</Label>
                {isEditing ? (
                  <Input
                    value={editData.city}
                    onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-foreground font-medium">{localData.city}</p>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Diplome</Label>
                {isEditing ? (
                  <Input
                    value={editData.diploma}
                    onChange={(e) => setEditData({ ...editData, diploma: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-foreground font-medium">{localData.diploma}</p>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Promotion</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.promoYear}
                    onChange={(e) => setEditData({ ...editData, promoYear: Number(e.target.value) })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-foreground font-medium">{localData.promoYear}</p>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Dernier scan IA</Label>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-foreground font-medium">
                    {isEnriching ? (
                      <span className="text-primary italic">Scan en cours...</span>
                    ) : (
                      formatDate(localData.lastScrapDate)
                    )}
                  </p>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTriggerEnrichment}
                      disabled={isEnriching}
                      className="h-7 text-xs"
                    >
                      {isEnriching && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                      Relancer le scan
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="pt-8 mt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-destructive mb-2">Zone de danger</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {localData.is_active
                    ? "La désactivation de l'alumni l'empêchera de se connecter et le masquera de l'annuaire public."
                    : "Le compte est actuellement désactivé. Vous pouvez le réactiver pour lui redonner accès."}
                </p>
                <Button
                  variant={localData.is_active ? "destructive" : "default"}
                  size="sm"
                  disabled={isStatusChanging}
                  onClick={() => {
                    const action = localData.is_active ? "désactiver" : "réactiver"
                    if (confirm(`Êtes-vous sûr de vouloir ${action} ${localData.firstName}?`)) {
                      handleToggleStatus()
                    }
                  }}
                >
                  {isStatusChanging && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                  {localData.is_active ? "Désactiver le compte" : "Réactiver le compte"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
