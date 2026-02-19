"use client"

import { useState, useMemo } from "react"
import { mockAlumni, type Alumni } from "@/lib/mock-data"
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
import {
  Search,
  ExternalLink,
  Mail,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react"
import { AlumniProfile } from "@/components/alumni-profile"

type SortField = "lastName" | "promoYear" | "diploma" | "status"
type SortDir = "asc" | "desc"

export function AlumniDirectory() {
  const [search, setSearch] = useState("")
  const [filterDiploma, setFilterDiploma] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPromo, setFilterPromo] = useState("all")
  const [sortField, setSortField] = useState<SortField>("lastName")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null)

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
          a.email.toLowerCase().includes(q) ||
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
      result = result.filter((a) => a.promoYear === parseInt(filterPromo))
    }

    result.sort((a, b) => {
      let cmp = 0
      if (sortField === "lastName") cmp = a.lastName.localeCompare(b.lastName)
      else if (sortField === "promoYear") cmp = a.promoYear - b.promoYear
      else if (sortField === "diploma") cmp = a.diploma.localeCompare(b.diploma)
      else if (sortField === "status") cmp = a.status.localeCompare(b.status)
      return sortDir === "asc" ? cmp : -cmp
    })

    return result
  }, [search, filterDiploma, filterStatus, filterPromo, sortField, sortDir])

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

  if (selectedAlumni) {
    return <AlumniProfile alumni={selectedAlumni} onBack={() => setSelectedAlumni(null)} />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Annuaire Alumni</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} alumni trouves</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Importer CSV</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
        </div>
      </div>

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
