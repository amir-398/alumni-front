"use client"

import { useState, useMemo } from "react"
import { mockAlumni, type Alumni } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  ExternalLink,
  Send,
  MapPin,
  Briefcase,
  GraduationCap,
} from "lucide-react"

export function AlumniSearch() {
  const [search, setSearch] = useState("")
  const [filterDiploma, setFilterDiploma] = useState("all")
  const [filterPromo, setFilterPromo] = useState("all")
  const [contactAlumni, setContactAlumni] = useState<Alumni | null>(null)
  const [contactMessage, setContactMessage] = useState("")
  const [contactSent, setContactSent] = useState(false)

  const diplomas = useMemo(() => [...new Set(mockAlumni.map((a) => a.diploma))], [])
  const promos = useMemo(() => [...new Set(mockAlumni.map((a) => a.promoYear))].sort((a, b) => b - a), [])

  const filtered = useMemo(() => {
    let result = [...mockAlumni]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.firstName.toLowerCase().includes(q) ||
          a.lastName.toLowerCase().includes(q) ||
          a.currentCompany.toLowerCase().includes(q) ||
          a.currentJob.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q)
      )
    }
    if (filterDiploma !== "all") result = result.filter((a) => a.diploma === filterDiploma)
    if (filterPromo !== "all") result = result.filter((a) => a.promoYear === parseInt(filterPromo))
    return result
  }, [search, filterDiploma, filterPromo])

  const handleSendContact = () => {
    setContactSent(true)
    setTimeout(() => {
      setContactSent(false)
      setContactAlumni(null)
      setContactMessage("")
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Rechercher un alumni</h2>
        <p className="text-sm text-muted-foreground">{filtered.length} alumni trouves</p>
      </div>

      {/* Filters */}
      <Card className="p-4 border border-border">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, poste, entreprise, ville..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterDiploma} onValueChange={setFilterDiploma}>
            <SelectTrigger className="w-full md:w-52">
              <SelectValue placeholder="Diplome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les diplomes</SelectItem>
              {diplomas.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterPromo} onValueChange={setFilterPromo}>
            <SelectTrigger className="w-full md:w-36">
              <SelectValue placeholder="Promo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes promos</SelectItem>
              {promos.map((p) => (
                <SelectItem key={p} value={p.toString()}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((alumni) => (
          <Card key={alumni.id} className="border border-border hover:shadow-md transition-shadow">
            <CardContent className="pt-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {alumni.firstName[0]}{alumni.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {alumni.firstName} {alumni.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {alumni.currentJob}
                  </p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {alumni.currentCompany}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  {alumni.promoYear}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {alumni.city}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {alumni.diploma}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => setContactAlumni(alumni)}
                >
                  <Send className="w-3 h-3" />
                  Contacter
                </Button>
                {alumni.linkedinUrl && (
                  <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <ExternalLink className="w-3 h-3" />
                      LinkedIn
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact dialog */}
      <Dialog
        open={!!contactAlumni}
        onOpenChange={(open) => { if (!open) { setContactAlumni(null); setContactMessage(""); setContactSent(false) } }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Contacter {contactAlumni?.firstName} {contactAlumni?.lastName}
            </DialogTitle>
            <DialogDescription>
              Votre message sera envoye de maniere securisee. L&apos;alumni recevra votre nom et votre message.
            </DialogDescription>
          </DialogHeader>
          {contactSent ? (
            <div className="py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Send className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-foreground">Message envoye !</p>
              <p className="text-sm text-muted-foreground">
                {contactAlumni?.firstName} recevra votre demande de contact.
              </p>
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="alumni-contact-msg">Votre message</Label>
                <Textarea
                  id="alumni-contact-msg"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Bonjour, je souhaiterais echanger avec vous au sujet de..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setContactAlumni(null)}>Annuler</Button>
                <Button onClick={handleSendContact} disabled={!contactMessage.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
