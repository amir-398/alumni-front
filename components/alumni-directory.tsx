"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { alumniApi } from "@/lib/api/alumni"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  ExternalLink,
  Mail,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  Eye,
  Plus,
  Linkedin,
  Loader2,
} from "lucide-react"
import { AlumniProfile } from "@/components/alumni-profile"

type SortField = "lastName" | "promoYear" | "diploma" | "status"
type SortDir = "asc" | "desc"

export function AlumniDirectory() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin" || user?.role === "super_admin"
  const [search, setSearch] = useState("")
  const [filterDiploma, setFilterDiploma] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPromo, setFilterPromo] = useState("all")
  const [sortField, setSortField] = useState<SortField>("lastName")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [selectedAlumni, setSelectedAlumni] = useState<any | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newAlumni, setNewAlumni] = useState({
    firstName: "",
    lastName: "",
    email: "",
    diploma: "",
    promoYear: new Date().getFullYear(),
    linkedinUrl: "",
    currentJob: "",
    currentCompany: "",
    city: ""
  })

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [scraping, setScraping] = useState(false)
  const [scrapeResult, setScrapeResult] = useState<{ success: number; failed: number; total: number } | null>(null)
  const [linkedinAuthStatus, setLinkedinAuthStatus] = useState<"idle" | "authenticating" | "success" | "failed">("idle")
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const refreshAlumni = async () => {
    try {
      const res = await alumniApi.getDirectory({ limit: 100 })
      const mapped = res.items.map((item: any) => ({
        id: item.user_id, // Important: Use user_id for API calls
        profile_id: item.id,
        firstName: item.first_name || "",
        lastName: item.last_name || "",
        email: item.email || "",
        linkedinUrl: item.linkedin_url || "",
        diploma: item.diploma || "",
        promoYear: item.graduation_year || new Date().getFullYear(),
        status: item.status || "up_to_date",
        currentJob: item.current_title || "",
        currentCompany: item.current_company || "",
        city: item.city || "",
        lastScrapDate: item.last_scraped_at,
        scrapeStatus: item.scrape_status,
        is_active: item.is_active ?? true,
      }))
      setData(mapped)
      return mapped
    } catch (err) {
      console.error("Failed to load alumni", err)
      return []
    } finally {
      setInitialLoading(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshAlumni()
  }, [])

  const handleCreateAlumni = async () => {
    try {
      const { adminApi } = await import("@/lib/api/admin")
      await adminApi.createAlumni({
        first_name: newAlumni.firstName,
        last_name: newAlumni.lastName,
        email: newAlumni.email,
        graduation_year: Number(newAlumni.promoYear),
        diploma: newAlumni.diploma,
        linkedin_url: newAlumni.linkedinUrl,
        current_title: newAlumni.currentJob,
        current_company: newAlumni.currentCompany,
        city: newAlumni.city,
        role: "ALUMNI"
      })
      setAddDialogOpen(false)
      refreshAlumni()
      setNewAlumni({
        firstName: "",
        lastName: "",
        email: "",
        diploma: "",
        promoYear: new Date().getFullYear(),
        linkedinUrl: "",
        currentJob: "",
        currentCompany: "",
        city: ""
      })
    } catch (err) {
      console.error("Failed to create alumni", err)
    }
  }

  const handleLinkedinReAuth = async () => {
    setLinkedinAuthStatus("authenticating")
    try {
      const res = await fetch("/api/linkedin-auth", { method: "POST" })
      if (!res.ok) throw new Error("Auth failed")
      setLinkedinAuthStatus("success")
    } catch {
      setLinkedinAuthStatus("failed")
    }
  }

  const handleScrapeAll = async () => {
    setScraping(true)
    setScrapeResult(null)
    setLinkedinAuthStatus("idle")
    try {
      const { adminApi } = await import("@/lib/api/admin")
      const result: any = await adminApi.scrapeAllAlumni()
      const successCount = result.success?.length ?? 0
      setScrapeResult({
        success: successCount,
        failed: result.failed?.length ?? 0,
        total: result.total ?? 0,
      })
      if (successCount > 0) {
        import("@/lib/sounds").then(({ playSiuuuSound }) => playSiuuuSound())
      }
      await refreshAlumni()
    } catch (err: any) {
      const isAuthError = err?.message?.includes("LINKEDIN_AUTH_REQUIRED")
      if (isAuthError) {
        import("@/lib/sounds").then(({ playFaaaaSound }) => playFaaaaSound())
        setLinkedinAuthStatus("authenticating")
        try {
          const res = await fetch("/api/linkedin-auth", { method: "POST" })
          if (!res.ok) throw new Error("Auth failed")
          setLinkedinAuthStatus("success")
        } catch {
          setLinkedinAuthStatus("failed")
        }
      } else {
        console.error("Failed to scrape alumni", err)
        setScrapeResult({ success: 0, failed: 0, total: 0 })
      }
    } finally {
      setScraping(false)
    }
  }

  const CSV_HEADERS = "email,first_name,last_name,graduation_year,diploma,linkedin_url,current_title,current_company,city"

  const handleExport = () => {
    const rows = [CSV_HEADERS]
    data.forEach((a) => {
      const escape = (v: string | number | undefined) => {
        const s = String(v ?? "")
        return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s
      }
      rows.push(
        [
          escape(a.email),
          escape(a.firstName),
          escape(a.lastName),
          escape(a.promoYear),
          escape(a.diploma),
          escape(a.linkedinUrl),
          escape(a.currentJob),
          escape(a.currentCompany),
          escape(a.city),
        ].join(",")
      )
    })
    const blob = new Blob(["\uFEFF" + rows.join("\r\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `alumni-export-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function parseCSVLine(line: string): string[] {
    const out: string[] = []
    let cur = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"'
          i++
        } else inQuotes = !inQuotes
      } else if ((c === "," && !inQuotes) || c === "\r") {
        out.push(cur.trim())
        cur = ""
      } else if (c !== "\r") cur += c
    }
    out.push(cur.trim())
    return out
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setImporting(true)
    setImportResult(null)
    const text = await file.text()
    const lines = text.split(/\n/).filter((l) => l.trim())
    if (lines.length < 2) {
      setImportResult({ success: 0, failed: 0, errors: ["Fichier vide ou sans lignes de donnees."] })
      setImporting(false)
      return
    }
    const header = parseCSVLine(lines[0].trim())
    const emailIdx = header.findIndex((h) => /email/i.test(h))
    const firstIdx = header.findIndex((h) => /first|prenom/i.test(h))
    const lastIdx = header.findIndex((h) => /last|nom/i.test(h))
    const yearIdx = header.findIndex((h) => /year|promo|annee|graduation/i.test(h))
    const diplomaIdx = header.findIndex((h) => /diploma|diplome/i.test(h))
    const linkedinIdx = header.findIndex((h) => /linkedin/i.test(h))
    const titleIdx = header.findIndex((h) => /title|poste|job/i.test(h))
    const companyIdx = header.findIndex((h) => /company|entreprise/i.test(h))
    const cityIdx = header.findIndex((h) => /city|ville/i.test(h))

    if (emailIdx === -1) {
      setImportResult({ success: 0, failed: 0, errors: ["Colonne email requise (header: email)."] })
      setImporting(false)
      return
    }

    let success = 0
    const errors: string[] = []
    const { adminApi } = await import("@/lib/api/admin")

    for (let i = 1; i < lines.length; i++) {
      const cells = parseCSVLine(lines[i])
      const email = (cells[emailIdx] ?? "").trim()
      if (!email) continue
      const first_name = (firstIdx >= 0 ? cells[firstIdx] : "").trim() || undefined
      const last_name = (lastIdx >= 0 ? cells[lastIdx] : "").trim() || undefined
      const graduation_year = yearIdx >= 0 && cells[yearIdx] ? parseInt(cells[yearIdx], 10) : undefined
      const diploma = (diplomaIdx >= 0 ? cells[diplomaIdx] : "").trim() || undefined
      const linkedin_url = (linkedinIdx >= 0 ? cells[linkedinIdx] : "").trim() || undefined
      const current_title = (titleIdx >= 0 ? cells[titleIdx] : "").trim() || undefined
      const current_company = (companyIdx >= 0 ? cells[companyIdx] : "").trim() || undefined
      const city = (cityIdx >= 0 ? cells[cityIdx] : "").trim() || undefined

      try {
        await adminApi.createAlumni({
          email,
          first_name: first_name || undefined,
          last_name: last_name || undefined,
          graduation_year: !isNaN(graduation_year!) && graduation_year! > 1900 ? graduation_year : undefined,
          diploma,
          linkedin_url,
          current_title,
          current_company,
          city,
          role: "ALUMNI",
        })
        success++
      } catch (err: any) {
        errors.push(`Ligne ${i + 1} (${email}): ${err?.message || String(err)}`)
      }
    }

    setImportResult({
      success,
      failed: errors.length,
      errors: errors.slice(0, 10),
    })
    if (success > 0) await refreshAlumni()
    setImporting(false)
  }

  const diplomas = useMemo(() => Array.from(new Set(data.map((a) => a.diploma))).filter(Boolean), [data])
  const promos = useMemo(() => Array.from(new Set(data.map((a) => a.promoYear))).filter(Boolean).sort((a: any, b: any) => b - a), [data])

  const filtered = useMemo(() => {
    let result = [...data]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.firstName.toLowerCase().includes(q) ||
          a.lastName.toLowerCase().includes(q) ||
          (a.email && a.email.toLowerCase().includes(q)) ||
          a.currentCompany.toLowerCase().includes(q) ||
          a.currentJob.toLowerCase().includes(q)
      )
    }

    if (filterDiploma !== "all") {
      result = result.filter((a) => a.diploma === filterDiploma)
    }
    if (filterStatus !== "all") {
      result = result.filter((a) => a.status === filterStatus)
    }
    if (filterPromo !== "all") {
      result = result.filter((a) => String(a.promoYear) === filterPromo)
    }

    result.sort((a, b) => {
      let cmp = 0
      if (sortField === "lastName") cmp = a.lastName.localeCompare(b.lastName)
      else if (sortField === "promoYear") cmp = a.promoYear - b.promoYear
      else if (sortField === "diploma") cmp = (a.diploma || "").localeCompare(b.diploma || "")
      else if (sortField === "status") cmp = (a.status || "").localeCompare(b.status || "")
      return sortDir === "asc" ? cmp : -cmp
    })

    return result
  }, [search, filterDiploma, filterStatus, filterPromo, sortField, sortDir, data])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 inline ml-1" />
    ) : (
      <ChevronDown className="w-3 h-3 inline ml-1" />
    )
  }

  if (initialLoading) {
    return <div className="p-8 text-center text-muted-foreground">Chargement de l'annuaire...</div>
  }

  if (selectedAlumni) {
    return (
      <AlumniProfile
        alumni={selectedAlumni}
        onBack={() => setSelectedAlumni(null)}
        onUpdate={async () => {
          // Refresh background list and update selected alumni reference
          const newData = await refreshAlumni()
          if (selectedAlumni) {
            const updated = newData.find((a: any) => a.id === selectedAlumni.id)
            if (updated) setSelectedAlumni(updated)
          }
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Annuaire Alumni</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} alumni trouves</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Ajouter un alumni</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Ajouter un alumni</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="add-firstname">Prenom</Label>
                    <Input
                      id="add-firstname"
                      placeholder="Prenom"
                      className="mt-1"
                      value={newAlumni.firstName}
                      onChange={(e) => setNewAlumni({ ...newAlumni, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-lastname">Nom</Label>
                    <Input
                      id="add-lastname"
                      placeholder="Nom"
                      className="mt-1"
                      value={newAlumni.lastName}
                      onChange={(e) => setNewAlumni({ ...newAlumni, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="add-email">Email</Label>
                  <Input
                    id="add-email"
                    type="email"
                    placeholder="email@example.com"
                    className="mt-1"
                    value={newAlumni.email}
                    onChange={(e) => setNewAlumni({ ...newAlumni, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="add-diploma">Diplome</Label>
                    <Select value={newAlumni.diploma} onValueChange={(val) => setNewAlumni({ ...newAlumni, diploma: val })}>
                      <SelectTrigger id="add-diploma" className="mt-1">
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        {diplomas.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="add-promo">Promotion</Label>
                    <Input
                      id="add-promo"
                      type="number"
                      placeholder="Annee"
                      className="mt-1"
                      value={newAlumni.promoYear}
                      onChange={(e) => setNewAlumni({ ...newAlumni, promoYear: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="add-linkedin">LinkedIn</Label>
                  <Input
                    id="add-linkedin"
                    placeholder="https://linkedin.com/in/..."
                    className="mt-1"
                    value={newAlumni.linkedinUrl}
                    onChange={(e) => setNewAlumni({ ...newAlumni, linkedinUrl: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="add-job">Poste</Label>
                    <Input
                      id="add-job"
                      placeholder="Poste actuel"
                      className="mt-1"
                      value={newAlumni.currentJob}
                      onChange={(e) => setNewAlumni({ ...newAlumni, currentJob: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-company">Entreprise</Label>
                    <Input
                      id="add-company"
                      placeholder="Entreprise"
                      className="mt-1"
                      value={newAlumni.currentCompany}
                      onChange={(e) => setNewAlumni({ ...newAlumni, currentCompany: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="add-city">Ville</Label>
                  <Input
                    id="add-city"
                    placeholder="Ville"
                    className="mt-1"
                    value={newAlumni.city}
                    onChange={(e) => setNewAlumni({ ...newAlumni, city: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleCreateAlumni} disabled={!newAlumni.email || !newAlumni.lastName}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>}
          {isAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleScrapeAll}
                disabled={scraping}
              >
                {scraping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Linkedin className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {scraping ? "Scraping en cours..." : "Scraper LinkedIn"}
                </span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleImportFile}
              />
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
              >
                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span className="hidden sm:inline">{importing ? "Import..." : "Importer CSV"}</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleExport} disabled={data.length === 0}>
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exporter</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {linkedinAuthStatus !== "idle" && (
        <Card className={`p-4 border ${linkedinAuthStatus === "failed" ? "border-destructive bg-destructive/10" : linkedinAuthStatus === "success" ? "border-accent bg-accent/10" : "border-primary bg-primary/10"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {linkedinAuthStatus === "authenticating" && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
              <p className="text-sm text-foreground font-medium">
                {linkedinAuthStatus === "authenticating"
                  ? "FAAAAAAA ! Les cookies LinkedIn ont expire. Re-authentification en cours... Un navigateur va s'ouvrir."
                  : linkedinAuthStatus === "success"
                  ? "Re-authentification LinkedIn reussie ! Vous pouvez relancer le scraping."
                  : "Echec de la re-authentification. Relancez manuellement le script d'authentification LinkedIn."}
              </p>
            </div>
            <div className="flex gap-2">
              {linkedinAuthStatus === "success" && (
                <Button size="sm" onClick={() => { setLinkedinAuthStatus("idle"); handleScrapeAll() }}>
                  Relancer le scraping
                </Button>
              )}
              {linkedinAuthStatus === "failed" && (
                <Button size="sm" variant="outline" onClick={handleLinkedinReAuth}>
                  Reessayer
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setLinkedinAuthStatus("idle")}>
                Fermer
              </Button>
            </div>
          </div>
        </Card>
      )}

      {scrapeResult && (
        <Card className="p-4 border border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground">
              Scraping termine : <strong>{scrapeResult.success}</strong> reussi(s),{" "}
              <strong>{scrapeResult.failed}</strong> echoue(s) sur{" "}
              <strong>{scrapeResult.total}</strong> alumni.
            </p>
            <Button variant="ghost" size="sm" onClick={() => setScrapeResult(null)}>
              Fermer
            </Button>
          </div>
        </Card>
      )}

      {importResult && (
        <Card className="p-4 border border-border bg-muted/30">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground font-medium">
                Import termine : <strong>{importResult.success}</strong> importe(s),{" "}
                <strong>{importResult.failed}</strong> erreur(s).
              </p>
              <Button variant="ghost" size="sm" onClick={() => setImportResult(null)}>
                Fermer
              </Button>
            </div>
            {importResult.errors.length > 0 && (
              <ul className="text-xs text-muted-foreground list-disc list-inside">
                {importResult.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
                {importResult.failed > 10 && (
                  <li>... et {importResult.failed - 10} autre(s) erreur(s)</li>
                )}
              </ul>
            )}
          </div>
        </Card>
      )}

      <Card className="p-4 border border-border">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email, entreprise..."
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
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="up_to_date">A jour</SelectItem>
              <SelectItem value="to_refresh">A rafraichir</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("lastName")}
              >
                Identite <SortIcon field="lastName" />
              </TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead
                className="hidden lg:table-cell cursor-pointer select-none"
                onClick={() => handleSort("diploma")}
              >
                Diplome <SortIcon field="diploma" />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("promoYear")}
              >
                Promo <SortIcon field="promoYear" />
              </TableHead>
              <TableHead className="hidden lg:table-cell">Poste actuel</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("status")}
              >
                Statut IA <SortIcon field="status" />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Aucun alumni trouve.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((alumni) => (
              <TableRow key={alumni.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                      {alumni.firstName[0]}{alumni.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {alumni.lastName} {alumni.firstName}
                      </p>
                      <p className="text-xs text-muted-foreground md:hidden">{alumni.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${alumni.email}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      <span className="max-w-32 truncate">{alumni.email}</span>
                    </a>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-sm text-foreground">{alumni.diploma}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">{alumni.promoYear}</Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div>
                    <p className="text-sm text-foreground">{alumni.currentJob}</p>
                    <p className="text-xs text-muted-foreground">{alumni.currentCompany}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={alumni.status === "up_to_date" ? "default" : "outline"}
                    className={
                      alumni.status === "up_to_date"
                        ? "bg-accent text-accent-foreground text-xs"
                        : "border-chart-3 text-chart-3 text-xs"
                    }
                  >
                    {alumni.status === "up_to_date" ? "A jour" : "A rafraichir"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setSelectedAlumni(alumni)}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="sr-only">Voir le profil</span>
                    </Button>
                    <a
                      href={alumni.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      <span className="sr-only">Voir LinkedIn</span>
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
