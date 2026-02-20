"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockAlumni } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ExternalLink,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Mail,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

export function AlumniMyProfile() {
  const { user } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const alumniData = mockAlumni.find(
    (a) => a.email.toLowerCase() === user?.email?.toLowerCase()
  ) || {
    id: user?.id || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    linkedinUrl: "",
    diploma: user?.diploma || "Non renseigne",
    promoYear: user?.promoYear || 0,
    status: "to_refresh" as const,
    lastScrapDate: "",
    currentJob: "Non renseigne",
    currentCompany: "Non renseigne",
    city: "Non renseigne",
    avatarUrl: null,
  }

  const handleSubmitSignal = () => {
    setSubmitted(true)
    setMessage("")
    setTimeout(() => {
      setDialogOpen(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Mon profil</h2>
          <p className="text-sm text-muted-foreground">Vos informations personnelles (lecture seule)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setSubmitted(false); setMessage("") } }}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 border-chart-3 text-chart-3 hover:bg-chart-3/10">
              <AlertTriangle className="w-4 h-4" />
              Signaler une mise a jour
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Signaler des informations obsoletes</DialogTitle>
            </DialogHeader>
            {!submitted ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Indiquez quelles informations ne sont plus a jour. Un administrateur mettra votre profil a jour.
                </p>
                <Textarea
                  placeholder="Ex: J'ai change d'entreprise, je suis maintenant chez..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleSubmitSignal} disabled={!message.trim()}>
                    Envoyer le signalement
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle className="w-12 h-12 text-accent" />
                <p className="text-foreground font-medium">Signalement envoye</p>
                <p className="text-sm text-muted-foreground text-center">
                  Un administrateur prendra en charge la mise a jour de votre profil.
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 border border-border">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {alumniData.firstName[0]}{alumniData.lastName[0]}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground">
                {alumniData.firstName} {alumniData.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{alumniData.currentJob}</p>
              <p className="text-sm font-medium text-foreground">{alumniData.currentCompany}</p>
            </div>

            <Badge
              variant={alumniData.status === "up_to_date" ? "default" : "outline"}
              className={
                alumniData.status === "up_to_date"
                  ? "bg-accent text-accent-foreground"
                  : "border-chart-3 text-chart-3"
              }
            >
              {alumniData.status === "up_to_date" ? "Profil a jour" : "A completer"}
            </Badge>

            <div className="w-full flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{alumniData.diploma}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">Promo {alumniData.promoYear}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{alumniData.city}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{alumniData.currentJob}</span>
              </div>
            </div>

            {alumniData.linkedinUrl && (
              <a
                href={alumniData.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Voir mon LinkedIn
                </Button>
              </a>
            )}
          </CardContent>
        </Card>

        {/* Read-only Details */}
        <Card className="lg:col-span-2 border border-border">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Mes informations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Prenom</Label>
                <p className="mt-1 text-foreground font-medium">{alumniData.firstName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Nom</Label>
                <p className="mt-1 text-foreground font-medium">{alumniData.lastName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Email</Label>
                <div className="mt-1 flex items-center gap-1 text-foreground">
                  <Mail className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium">{alumniData.email}</span>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">LinkedIn</Label>
                {alumniData.linkedinUrl ? (
                  <a href={alumniData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-primary hover:underline truncate">
                    <ExternalLink className="w-3 h-3 inline mr-1" />
                    {alumniData.linkedinUrl}
                  </a>
                ) : (
                  <p className="mt-1 text-muted-foreground text-sm">Non renseigne</p>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Poste actuel</Label>
                <p className="mt-1 text-foreground font-medium">{alumniData.currentJob}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Entreprise</Label>
                <p className="mt-1 text-foreground font-medium">{alumniData.currentCompany}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Ville</Label>
                <p className="mt-1 text-foreground font-medium">{alumniData.city}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Diplome</Label>
                <p className="mt-1 text-foreground font-medium">{alumniData.diploma}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
