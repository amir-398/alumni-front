"use client"

import { useState } from "react"
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
} from "lucide-react"

interface AlumniProfileProps {
  alumni: Alumni
  onBack: () => void
}

export function AlumniProfile({ alumni, onBack }: AlumniProfileProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ ...alumni })
  const [contactOpen, setContactOpen] = useState(false)
  const [contactMessage, setContactMessage] = useState("")
  const [contactSent, setContactSent] = useState(false)

  const handleSave = () => {
    setIsEditing(false)
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
              {alumni.firstName[0]}{alumni.lastName[0]}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">
                {alumni.firstName} {alumni.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{alumni.currentJob}</p>
              <p className="text-sm font-medium text-foreground">{alumni.currentCompany}</p>
            </div>

            <Badge
              variant={alumni.status === "up_to_date" ? "default" : "outline"}
              className={
                alumni.status === "up_to_date"
                  ? "bg-accent text-accent-foreground"
                  : "border-chart-3 text-chart-3"
              }
            >
              {alumni.status === "up_to_date" ? "Profil a jour" : "A rafraichir"}
            </Badge>

            <div className="w-full flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{alumni.diploma}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">Promo {alumni.promoYear}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{alumni.city}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{alumni.currentJob}</span>
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
                  <p className="mt-1 text-foreground font-medium">{alumni.firstName}</p>
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
                  <p className="mt-1 text-foreground font-medium">{alumni.lastName}</p>
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
                  <a href={`mailto:${alumni.email}`} className="mt-1 block text-primary hover:underline">
                    <Mail className="w-3 h-3 inline mr-1" />
                    {alumni.email}
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
                  <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-primary hover:underline truncate">
                    <ExternalLink className="w-3 h-3 inline mr-1" />
                    {alumni.linkedinUrl}
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
                  <p className="mt-1 text-foreground font-medium">{alumni.currentJob}</p>
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
                  <p className="mt-1 text-foreground font-medium">{alumni.currentCompany}</p>
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
                  <p className="mt-1 text-foreground font-medium">{alumni.city}</p>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Dernier scan IA</Label>
                <p className="mt-1 text-foreground font-medium">
                  {new Date(alumni.lastScrapDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
