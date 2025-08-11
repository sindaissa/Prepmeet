"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Eye,
  FileText,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Target,
  ArrowLeft,
  Play,
  Sparkles,
  Trophy,
  Rocket,
} from "lucide-react"
import { useRouter } from "next/navigation"

const simulationHistory = [
  {
    id: 1,
    date: "2024-01-15",
    type: "Découverte",
    client: "MILLÉSIMAL",
    score: 85,
    duration: "12min 30s",
    status: "Terminé",
  },
  {
    id: 2,
    date: "2024-01-12",
    type: "Négociation",
    client: "ALTYN",
    score: 72,
    duration: "18min 45s",
    status: "Terminé",
  },
  {
    id: 3,
    date: "2024-01-10",
    type: "Présentation",
    client: "Bouygues Telecom",
    score: 78,
    duration: "15min 20s",
    status: "Terminé",
  },
  {
    id: 4,
    date: "2024-01-08",
    type: "Crise",
    client: "BPI France",
    score: 65,
    duration: "22min 10s",
    status: "Terminé",
  },
  {
    id: 5,
    date: "2024-01-05",
    type: "Suivi",
    client: "Distalmotion",
    score: 88,
    duration: "10min 15s",
    status: "Terminé",
  },
  {
    id: 6,
    date: "2024-01-03",
    type: "Comité Décision",
    client: "L'Oréal",
    score: 76,
    duration: "25min 30s",
    status: "Terminé",
  },
]

const progressData = [
  { date: "2024-01-03", score: 76 },
  { date: "2024-01-05", score: 88 },
  { date: "2024-01-08", score: 65 },
  { date: "2024-01-10", score: 78 },
  { date: "2024-01-12", score: 72 },
  { date: "2024-01-15", score: 85 },
]

export default function History() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterScore, setFilterScore] = useState("all")
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/signin")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Simuler la vérification si l'utilisateur est nouveau (pas de simulations)
    // Dans un vrai cas, on ferait un appel API pour vérifier
    const userCreatedDate = new Date(parsedUser.createdAt || Date.now())
    const daysSinceCreation = (Date.now() - userCreatedDate.getTime()) / (1000 * 60 * 60 * 24)
    setIsNewUser(daysSinceCreation < 1) // Nouveau si créé il y a moins d'1 jour
  }, [router])

  const filteredHistory = simulationHistory.filter((sim) => {
    const matchesSearch =
      sim.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || sim.type === filterType
    const matchesScore =
      filterScore === "all" ||
      (filterScore === "excellent" && sim.score >= 80) ||
      (filterScore === "good" && sim.score >= 60 && sim.score < 80) ||
      (filterScore === "needs-improvement" && sim.score < 60)

    return matchesSearch && matchesType && matchesScore
  })

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "Excellent" }
    if (score >= 60) return { variant: "secondary" as const, text: "Bien" }
    return { variant: "destructive" as const, text: "À améliorer" }
  }

  const averageScore = Math.round(simulationHistory.reduce((acc, sim) => acc + sim.score, 0) / simulationHistory.length)
  const totalSimulations = simulationHistory.length
  const lastSimulation = simulationHistory[0]

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Affichage pour les nouveaux utilisateurs
  if (isNewUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b px-4 py-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Accueil</span>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Historique des simulations</h1>
                  <p className="text-gray-600">Votre parcours d'excellence commence ici</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Section pour nouveau utilisateur */}
            <div className="mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Nouveau sur SimuClient</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                🎯 Prêt à créer votre
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  empreinte digitale{" "}
                </span>
                de manager ?
              </h2>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Votre historique est encore vierge, mais c'est le moment parfait pour commencer votre transformation !
                Chaque simulation vous rapprochera de l'excellence commerciale.
              </p>
            </div>

            {/* Cards d'action */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="relative overflow-hidden border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <CardContent className="pt-8 pb-6 relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Première Simulation</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Lancez-vous avec une simulation découverte pour établir votre niveau de base
                  </p>
                  <Button
                    onClick={() => router.push("/")}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    Commencer maintenant
                  </Button>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <CardContent className="pt-8 pb-6 relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Défis Personnalisés</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Découvrez vos forces et axes d'amélioration avec notre assistant IA
                  </p>
                  <Button
                    onClick={() => router.push("/assistant")}
                    variant="outline"
                    className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    Explorer l'assistant
                  </Button>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <CardContent className="pt-8 pb-6 relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Parcours Guidé</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Suivez un parcours structuré pour maîtriser tous les types de réunions
                  </p>
                  <Button
                    onClick={() => router.push("/clients")}
                    variant="outline"
                    className="w-full border-green-300 text-green-600 hover:bg-green-50"
                  >
                    Voir les clients
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Motivation Section */}
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0">
              <CardContent className="py-8">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Votre aventure commence maintenant !</h3>
                </div>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Rejoignez plus de 500 managers Talan qui ont déjà transformé leur approche commerciale. Votre première
                  simulation vous attend !
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push("/")}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Lancer ma première simulation
                  </Button>
                  <Button onClick={() => router.push("/assistant")} variant="outline" size="lg" className="px-8">
                    Découvrir l'assistant IA
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview de ce qui les attend */}
            <div className="mt-12 text-left">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                Ce qui vous attend après votre première simulation
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                    Suivi de progression
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Graphiques d'évolution de vos scores</li>
                    <li>• Analyse détaillée de vos performances</li>
                    <li>• Identification de vos points forts</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Target className="w-5 h-5 text-purple-600 mr-2" />
                    Recommandations personnalisées
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Conseils adaptés à votre profil</li>
                    <li>• Défis progressifs et motivants</li>
                    <li>• Ressources de formation ciblées</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Affichage normal pour les utilisateurs avec historique
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Accueil</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Historique des simulations</h1>
                <p className="text-gray-600">Suivez votre progression et analysez vos performances</p>
              </div>
            </div>
            <Button onClick={() => router.push("/")} className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Nouvelle simulation</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{averageScore}</div>
                  <div className="text-sm text-gray-600">Score moyen</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{totalSimulations}</div>
                  <div className="text-sm text-gray-600">Simulations</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{lastSimulation.score}</div>
                  <div className="text-sm text-gray-600">Dernier score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">6</div>
                  <div className="text-sm text-gray-600">Types pratiqués</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Évolution des performances</span>
              </CardTitle>
              <CardDescription>Progression de vos scores au fil du temps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("fr-FR", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString("fr-FR")}
                      formatter={(value) => [`${value}%`, "Score"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filtres</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Client ou type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type de réunion</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="Découverte">Découverte</SelectItem>
                    <SelectItem value="Présentation">Présentation</SelectItem>
                    <SelectItem value="Négociation">Négociation</SelectItem>
                    <SelectItem value="Crise">Crise</SelectItem>
                    <SelectItem value="Suivi">Suivi</SelectItem>
                    <SelectItem value="Comité Décision">Comité Décision</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Score</label>
                <Select value={filterScore} onValueChange={setFilterScore}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les scores</SelectItem>
                    <SelectItem value="excellent">Excellent (80+)</SelectItem>
                    <SelectItem value="good">Bien (60-79)</SelectItem>
                    <SelectItem value="needs-improvement">À améliorer (&lt;60)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Historique détaillé</CardTitle>
            <CardDescription>
              {filteredHistory.length} simulation{filteredHistory.length > 1 ? "s" : ""} trouvée
              {filteredHistory.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Client simulé</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((simulation) => (
                  <TableRow key={simulation.id}>
                    <TableCell>{new Date(simulation.date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{simulation.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{simulation.client}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{simulation.score}</span>
                        <Badge {...getScoreBadge(simulation.score)}>{getScoreBadge(simulation.score).text}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{simulation.duration}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            (window.location.href = `/feedback?manager=Sophie Martin&type=${simulation.type}&score=${simulation.score}`)
                          }
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Feedback
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            (window.location.href = `/report?manager=Sophie Martin&type=${simulation.type}&score=${simulation.score}`)
                          }
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Rapport
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
