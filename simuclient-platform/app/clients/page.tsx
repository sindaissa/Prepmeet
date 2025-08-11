"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Building, Users, TrendingUp, Plus, Eye, Edit, ArrowLeft } from "lucide-react"

const clientsDatabase = [
  {
    id: 1,
    name: "BPI France",
    sector: "Services financiers publics",
    size: "Grande entreprise",
    relationship: "Client stratégique depuis 5 ans",
    challenges: ["Transformation digitale", "Modernisation SI", "Accompagnement startups"],
    personality: "Institutionnel et rigoureux",
    decisionMaker: "DSI - Catherine Moreau",
    budget: "Très élevé (>2M€)",
    timeline: "Long terme (12-18 mois)",
    lastInteraction: "2024-01-15",
    status: "Actif",
  },
  {
    id: 2,
    name: "ALTYN",
    sector: "Technologie & Innovation",
    size: "PME",
    relationship: "Partenaire technologique",
    challenges: ["Scalabilité produit", "Architecture cloud", "Sécurité données"],
    personality: "Innovateur et agile",
    decisionMaker: "CTO - Alexandre Dubois",
    budget: "Élevé (500K-1M€)",
    timeline: "Moyen terme (6-9 mois)",
    lastInteraction: "2024-01-12",
    status: "Partenaire",
  },
  {
    id: 3,
    name: "MILLÉSIMAL",
    sector: "Fintech & Services financiers",
    size: "Startup",
    relationship: "Client en croissance",
    challenges: ["Conformité réglementaire", "Croissance rapide", "Optimisation coûts"],
    personality: "Dynamique et exigeant",
    decisionMaker: "CEO - Marie Lefevre",
    budget: "Moyen (200-500K€)",
    timeline: "Court terme (3-6 mois)",
    lastInteraction: "2024-01-10",
    status: "Actif",
  },
  {
    id: 4,
    name: "L'Oréal",
    sector: "Cosmétiques & Luxe",
    size: "Multinationale",
    relationship: "Client premium depuis 8 ans",
    challenges: ["E-commerce global", "Personnalisation IA", "Sustainability tech"],
    personality: "Perfectionniste et innovant",
    decisionMaker: "Chief Digital Officer - Sophie Martin",
    budget: "Très élevé (>3M€)",
    timeline: "Long terme (18-24 mois)",
    lastInteraction: "2024-01-18",
    status: "Actif",
  },
  {
    id: 5,
    name: "Bouygues Telecom",
    sector: "Télécommunications",
    size: "Grande entreprise",
    relationship: "Partenaire stratégique",
    challenges: ["5G deployment", "Network optimization", "Customer experience"],
    personality: "Technique et méthodique",
    decisionMaker: "Directeur Technique - Pierre Rousseau",
    budget: "Très élevé (>2M€)",
    timeline: "Long terme (12-15 mois)",
    lastInteraction: "2024-01-14",
    status: "Partenaire",
  },
  {
    id: 6,
    name: "Distalmotion",
    sector: "Medtech & Robotique",
    size: "PME innovante",
    relationship: "Client spécialisé",
    challenges: ["Robotique médicale", "Certification FDA", "Expansion internationale"],
    personality: "Précis et visionnaire",
    decisionMaker: "R&D Director - Dr. Laurent Benoit",
    budget: "Élevé (800K-1.5M€)",
    timeline: "Moyen terme (9-12 mois)",
    lastInteraction: "2024-01-08",
    status: "Actif",
  },
]

export default function Clients() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSector, setFilterSector] = useState("all")
  const [filterSize, setFilterSize] = useState("all")
  const [selectedClient, setSelectedClient] = useState<(typeof clientsDatabase)[0] | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const filteredClients = clientsDatabase.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.sector.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSector = filterSector === "all" || client.sector === filterSector
    const matchesSize = filterSize === "all" || client.size === filterSize

    return matchesSearch && matchesSector && matchesSize
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-500"
      case "Prospect":
        return "bg-blue-500"
      case "Nouveau":
        return "bg-purple-500"
      case "Partenaire":
        return "bg-orange-500"
      case "Complexe":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const sectors = [...new Set(clientsDatabase.map((client) => client.sector))]
  const sizes = [...new Set(clientsDatabase.map((client) => client.size))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Accueil</span>
              </Button>
              <Building className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Base de données clients</h1>
                <p className="text-gray-600">Profils des clients simulés pour vos formations</p>
              </div>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un client</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau client fictif</DialogTitle>
                  <DialogDescription>Créez un profil client personnalisé pour vos simulations</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom de l'entreprise</Label>
                      <Input id="name" placeholder="Ex: TechCorp Solutions" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sector">Secteur</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">Technologie</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Santé</SelectItem>
                          <SelectItem value="retail">Commerce</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="challenges">Enjeux stratégiques</Label>
                    <Textarea
                      id="challenges"
                      placeholder="Décrivez les principaux défis de cette entreprise..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personality">Personnalité du décideur</Label>
                    <Input id="personality" placeholder="Ex: Analytique et méthodique" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => setShowAddDialog(false)}>Créer le client</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{clientsDatabase.length}</div>
                  <div className="text-sm text-gray-600">Clients simulés</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{sectors.length}</div>
                  <div className="text-sm text-gray-600">Secteurs couverts</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">85%</div>
                  <div className="text-sm text-gray-600">Taux de réalisme</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-gray-600">Nouveaux ce mois</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom ou secteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tous les secteurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les secteurs</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterSize} onValueChange={setFilterSize}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Toutes les tailles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les tailles</SelectItem>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Clients Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription>{client.sector}</CardDescription>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(client.status)}`}></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{client.size}</Badge>
                  <Badge variant="secondary">{client.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Relation</h4>
                  <p className="text-sm text-gray-600">{client.relationship}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Enjeux principaux</h4>
                  <div className="flex flex-wrap gap-1">
                    {client.challenges.slice(0, 2).map((challenge, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {challenge}
                      </Badge>
                    ))}
                    {client.challenges.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{client.challenges.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Décideur</h4>
                  <p className="text-sm text-gray-600">{client.decisionMaker}</p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => setSelectedClient(client)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Détails
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Client Detail Modal */}
        <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedClient && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-3">
                    <span>{selectedClient.name}</span>
                    <Badge variant="secondary">{selectedClient.status}</Badge>
                  </DialogTitle>
                  <DialogDescription>Profil client détaillé pour simulation</DialogDescription>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Informations générales</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Secteur:</strong> {selectedClient.sector}
                        </div>
                        <div>
                          <strong>Taille:</strong> {selectedClient.size}
                        </div>
                        <div>
                          <strong>Relation:</strong> {selectedClient.relationship}
                        </div>
                        <div>
                          <strong>Budget:</strong> {selectedClient.budget}
                        </div>
                        <div>
                          <strong>Timeline:</strong> {selectedClient.timeline}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Décideur</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Contact:</strong> {selectedClient.decisionMaker}
                        </div>
                        <div>
                          <strong>Personnalité:</strong> {selectedClient.personality}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Enjeux stratégiques</h4>
                      <div className="space-y-2">
                        {selectedClient.challenges.map((challenge, index) => (
                          <Badge key={index} variant="outline" className="mr-2 mb-2">
                            {challenge}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Historique Talan</h4>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm">
                        <p>
                          <strong>Dernière interaction:</strong>{" "}
                          {new Date(selectedClient.lastInteraction).toLocaleDateString("fr-FR")}
                        </p>
                        <p className="mt-2">
                          Relation établie depuis plusieurs années avec des projets de transformation digitale réussis.
                          Client exigeant mais fidèle, valorise l'expertise technique et la réactivité.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedClient(null)}>
                    Fermer
                  </Button>
                  <Button>Lancer une simulation</Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
