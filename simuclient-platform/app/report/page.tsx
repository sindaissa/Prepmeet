"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Clock, User, Target, ArrowLeft, Home } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

export default function Report() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const manager = searchParams?.get("manager") || "Manager"
  const meetingType = searchParams?.get("type") || "Découverte"
  const score = Number.parseInt(searchParams?.get("score") || "78")

  const timelineData = [
    { time: "00:30", confidence: 85, stress: 20, engagement: 90 },
    { time: "01:00", confidence: 80, stress: 25, engagement: 85 },
    { time: "01:30", confidence: 75, stress: 40, engagement: 80 },
    { time: "02:00", confidence: 70, stress: 55, engagement: 75 },
    { time: "02:30", confidence: 78, stress: 45, engagement: 82 },
    { time: "03:00", confidence: 82, stress: 35, engagement: 88 },
    { time: "03:30", confidence: 85, stress: 30, engagement: 90 },
  ]

  const skillsData = [
    { skill: "Écoute active", score: 85 },
    { skill: "Argumentation", score: 72 },
    { skill: "Gestion objections", score: 68 },
    { skill: "Closing", score: 75 },
    { skill: "Relationnel", score: 82 },
  ]

  const agentsTriggered = [
    { agent: "Agent Découverte", triggers: 8, description: "Questions ouvertes et exploration des besoins" },
    { agent: "Agent Objection", triggers: 5, description: "Gestion des résistances et objections prix" },
    { agent: "Agent Technique", triggers: 3, description: "Approfondissement des aspects techniques" },
    { agent: "Agent Closing", triggers: 2, description: "Techniques de conclusion et next steps" },
  ]

  const recommendations = [
    {
      category: "Découverte client",
      items: [
        "Utiliser la technique SPIN (Situation, Problem, Implication, Need-payoff)",
        "Poser plus de questions sur les enjeux business",
        "Creuser les impacts financiers des problématiques",
      ],
    },
    {
      category: "Gestion des objections",
      items: [
        "Reformuler l'objection avant de répondre",
        "Utiliser des preuves sociales (cas clients similaires)",
        "Proposer des alternatives plutôt que de justifier",
      ],
    },
    {
      category: "Communication non-verbale",
      items: [
        "Maintenir un contact visuel régulier",
        "Utiliser des gestes ouverts et confiants",
        "Adapter le débit de parole aux moments clés",
      ],
    },
  ]

  const handleDownloadPDF = () => {
    // Simulate PDF download
    const element = document.createElement("a")
    element.href = "data:text/plain;charset=utf-8,Rapport de simulation SimuClient"
    element.download = `rapport-simulation-${manager.split(" ")[0]}-${meetingType}-${new Date().toISOString().split("T")[0]}.pdf`
    element.click()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4 print:hidden">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </Button>
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Rapport de simulation</h1>
                <p className="text-gray-600">Analyse complète et recommandations</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleDownloadPDF} className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Télécharger PDF</span>
              </Button>
              <Button variant="outline" onClick={() => router.push("/")} className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Accueil</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 print:px-0 print:py-4">
        {/* Report Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Rapport de Performance</CardTitle>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{manager}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{meetingType}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{score}/100</div>
                <Badge variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}>
                  {score >= 80 ? "Excellent" : score >= 60 ? "Bien" : "À améliorer"}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des émotions pendant la simulation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="confidence"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="engagement"
                      stackId="2"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="stress"
                      stackId="3"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Confiance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Engagement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Stress</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse par compétence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="skill" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Agents Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Résumé des agents IA déclenchés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {agentsTriggered.map((agent, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{agent.agent}</h4>
                    <Badge variant="outline">{agent.triggers} fois</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{agent.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommandations personnalisées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recommendations.map((category, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-lg mb-3 text-blue-700">{category.category}</h4>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 print:mt-4">
          <p>Rapport généré par SimuClient - Plateforme de formation Talan</p>
          <p>Pour plus d'informations, contactez l'équipe formation</p>
        </div>
      </div>
    </div>
  )
}
