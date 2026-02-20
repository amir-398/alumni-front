"use client"

import { mockLogs } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit3, Plus, Trash2, ArrowRight } from "lucide-react"

const actionConfig = {
  create: {
    label: "Creation",
    icon: Plus,
    color: "bg-accent text-accent-foreground",
  },
  update: {
    label: "Modification",
    icon: Edit3,
    color: "bg-chart-1/15 text-chart-1 border border-chart-1/30",
  },
  delete: {
    label: "Suppression",
    icon: Trash2,
    color: "bg-destructive/15 text-destructive border border-destructive/30",
  },
}

export function LogsModule() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Historique des modifications</h2>
        <p className="text-sm text-muted-foreground">
          Suivi de toutes les modifications effectuees sur les profils
        </p>
      </div>

      <Card className="border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Alumni</TableHead>
              <TableHead className="hidden md:table-cell">Champ</TableHead>
              <TableHead className="hidden lg:table-cell">Modification</TableHead>
              <TableHead>Par</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLogs.map((log) => {
              const config = actionConfig[log.action]
              const Icon = config.icon
              return (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(log.modifiedAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                    <br />
                    <span className="text-xs">
                      {new Date(log.modifiedAt).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={config.color}>
                      <Icon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {log.alumniName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground capitalize">
                    {log.field}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {log.action === "create" ? (
                      <span className="text-sm text-accent">{log.newValue}</span>
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground line-through max-w-24 truncate">
                          {log.oldValue}
                        </span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="text-foreground max-w-24 truncate">{log.newValue}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {log.modifiedBy}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
