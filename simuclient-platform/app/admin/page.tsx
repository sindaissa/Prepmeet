"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Users, TrendingUp, Clock, AlertTriangle, Download, Eye, MessageSquare, Target, ArrowLeft } from "lucide-react"

const managersData = [
  {
    id: 1,
    name: "Sophie Martin",
    role: "Senior Manager",
    team: "Digital Transformation",
    averageScore: 82,
    totalSimulations: 15,
    lastActivity: "2024-01-15",
    trend: "+5",
    status: "Actif",
    needsAttention: false,
  },
  {
    id: 2,
    name: "Pierre Dubois",
    role: "Manager Commercial",
    team: "Business Development",
    averageScore: 68,
    totalSimulations: 8,
    lastActivity: "2024-01-10",
    trend: "-3",
    status: "Attention",
    needsAttention: true,
  },
  {
    id: 3,
    name: "Marie Leroy",
    role: "Manager Technique",
    team: "Engineering",
    averageScore: 75,
    totalSimulations: 12,
    lastActivity: "2024-01-12",
    trend: "+2",
    status: "Actif",
    needsAttention: false,
  },
  {
    id: 4,
    name: "Jean Moreau",
    role: "Manager Projet",
    team: "Delivery",
    averageScore: 71,
    totalSimulations: 10,
    lastActivity: "2024-01-08",
    trend: "+1",
    status: "Actif",
    needsAttention: false,
  },
  {
    id: 5,
    name: "Claire Bernard",
    role: "Manager Innovation",
    team: "R&D",
    averageScore: 58,
    totalSimulations: 5,
    lastActivity: "2024-01-05",
    trend: "-8",
    status: "Critique",
    needsAttention: true,
  },
]

const globalStats = {
  totalManagers: 25,
  averageScore: 71,
  totalSimulations: 156,
  completionRate: 78,
  activeThisWeek: 18,
}

const meetingTypesData = [
  { name: "Découverte", value: 35, color: "#3b82f6" },
  { name: "Négociation", value: 25, color: "#ef4444" },
  { name: "Présentation", value: 20, color: "#10b981" },
  { name: "Crise", value: 10, color: "#f59e0b" },
  { name: "Suivi", value: 7, color: "#8b5cf6" },
  { name: "Comité", value: 3, color: "#06b6d4" },
]

const progressData = [
  { month: "Oct", score: 65 },
  { month: "Nov", score: 68 },
  { month: "Déc", score: 71 },
  { month: "Jan", score: 74 },
]

const coachingSuggestions = [
  {
    manager: "Pierre Dubois",
    suggestion: "Formation approfondie sur les techniques de négociation",
    priority: "Haute",
    reason: "Score en baisse sur les simulations de négociation",
  },
  {
    manager: "Claire Bernard",
    suggestion: "Session de coaching individuel sur la gestion du stress",
    priority: "Critique",
    reason: "Scores faibles et peu d'activité récente",
  },
  {
    manager: "Marie Leroy",
    suggestion: "Perfectionnement en communication client",
    priority: "Moyenne",
    reason: "Bons résultats techniques, amélioration possible côté relationnel",
  },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedTeam, setSelectedTeam] = useState("all")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Actif":
        return <Badge className="bg-green-500">Actif</Badge>
      case "Attention":
        return <Badge className="bg-yellow-500">Attention</Badge>
      case "Critique":
        return <Badge className="bg-red-500">Critique</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critique":
        return "text-red-600"
      case "Haute":
        return "text-orange-600"
      case "Moyenne":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const exportData = () => {
    // Simulate CSV export
    const csvContent = managersData
      .map((manager) => `${manager.name},${manager.averageScore},${manager.totalSimulations},${manager.lastActivity}`)
      .join("\n")

    const element = document.createElement("a")
    element.href =
      "data:text/csv;charset=utf-8," +
      encodeURIComponent("Nom,Score Moyen,Simulations,Dernière Activité\n" + csvContent)
    element.download = "managers-performance.csv"
    element.click()
  }

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
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Dashboard RH</h1>
                <p className="text-gray-600">Suivi des performances et coaching des managers</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportData} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="managers">Managers</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
            <TabsTrigger value="coaching">Coaching</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Global Stats */}
            <div className="grid md:grid-cols-5 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">{globalStats.totalManagers}</div>
                      <div className="text-sm text-gray-600">Managers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">{globalStats.averageScore}</div>
                      <div className="text-sm text-gray-600">Score moyen</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold">{globalStats.totalSimulations}</div>
                      <div className="text-sm text-gray-600">Simulations</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="text-2xl font-bold">{globalStats.completionRate}%</div>
                      <div className="text-sm text-gray-600">Taux de complétion</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="text-2xl font-bold">{globalStats.activeThisWeek}</div>
                      <div className="text-sm text-gray-600">Actifs cette semaine</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des performances</CardTitle>
                  <CardDescription>Score moyen global par mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[60, 80]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Meeting Types Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des types de réunions</CardTitle>
                  <CardDescription>Distribution des simulations par type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={meetingTypesData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {meetingTypesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Managers Tab */}
          <TabsContent value="managers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Liste des managers</CardTitle>
                    <CardDescription>Performance et activité de chaque manager</CardDescription>
                  </div>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Toutes les équipes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les équipes</SelectItem>
                      <SelectItem value="Digital Transformation">Digital Transformation</SelectItem>
                      <SelectItem value="Business Development">Business Development</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Delivery">Delivery</SelectItem>
                      <SelectItem value="R&D">R&D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Manager</TableHead>
                      <TableHead>Équipe</TableHead>
                      <TableHead>Score moyen</TableHead>
                      <TableHead>Simulations</TableHead>
                      <TableHead>Tendance</TableHead>
                      <TableHead>Dernière activité</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {managersData.map((manager) => (
                      <TableRow key={manager.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {manager.needsAttention && <AlertTriangle className="w-4 h-4 text-red-500" />}
                            <div>
                              <div className="font-medium">{manager.name}</div>
                              <div className="text-sm text-gray-600">{manager.role}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{manager.team}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{manager.averageScore}</span>
                            <div
                              className={`text-sm ${manager.averageScore >= 80 ? "text-green-600" : manager.averageScore >= 60 ? "text-yellow-600" : "text-red-600"}`}
                            >
                              /100
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{manager.totalSimulations}</TableCell>
                        <TableCell>
                          <span
                            className={`text-sm ${manager.trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                          >
                            {manager.trend}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(manager.lastActivity).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>{getStatusBadge(manager.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance par équipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { team: "Digital", score: 82 },
                          { team: "Business", score: 68 },
                          { team: "Engineering", score: 75 },
                          { team: "Delivery", score: 71 },
                          { team: "R&D", score: 58 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="team" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Managers à surveiller</CardTitle>
                  <CardDescription>Managers nécessitant une attention particulière</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {managersData
                      .filter((m) => m.needsAttention)
                      .map((manager) => (
                        <div key={manager.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <div>
                              <div className="font-medium">{manager.name}</div>
                              <div className="text-sm text-gray-600">
                                Score: {manager.averageScore} | Tendance: {manager.trend}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Voir détails
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Coaching Tab */}
          <TabsContent value="coaching" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suggestions de coaching IA</CardTitle>
                <CardDescription>Recommandations personnalisées basées sur les performances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coachingSuggestions.map((suggestion, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{suggestion.manager}</h4>
                          <Badge className={getPriorityColor(suggestion.priority)}>{suggestion.priority}</Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          Planifier
                        </Button>
                      </div>
                      <p className="text-sm mb-2">{suggestion.suggestion}</p>
                      <p className="text-xs text-gray-600">
                        <strong>Raison:</strong> {suggestion.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
