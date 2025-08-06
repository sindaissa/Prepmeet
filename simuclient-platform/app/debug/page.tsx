"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Code, Clock, Brain, Zap, CheckCircle, Activity, Database, ArrowLeft } from "lucide-react"

const simulationTimeline = [
  {
    timestamp: "00:00:15",
    event: "Simulation Started",
    agent: "System",
    prompt: "Initialize simulation with client profile: TechCorp Solutions",
    response: "Simulation environment loaded successfully",
    confidence: 95,
    processingTime: 120,
  },
  {
    timestamp: "00:00:30",
    event: "Agent Discovery Activated",
    agent: "Discovery Agent",
    prompt: "Generate opening question for discovery meeting with tech client",
    response: "Bonjour ! Je suis ravi de vous rencontrer. Pouvez-vous commencer par vous présenter ?",
    confidence: 88,
    processingTime: 450,
  },
  {
    timestamp: "00:01:45",
    event: "User Response Analyzed",
    agent: "Analysis Agent",
    prompt: 'Analyze user response: "Bonjour, je suis Sophie Martin, Senior Manager chez Talan..."',
    response: "Professional introduction detected. Confidence level: high. Proceed with business context.",
    confidence: 92,
    processingTime: 280,
  },
  {
    timestamp: "00:02:10",
    event: "Follow-up Question Generated",
    agent: "Discovery Agent",
    prompt: "Generate follow-up question based on professional introduction",
    response: "Parfait Sophie. Pouvez-vous me parler des principaux défis que rencontre TechCorp actuellement ?",
    confidence: 85,
    processingTime: 380,
  },
  {
    timestamp: "00:03:20",
    event: "Objection Agent Triggered",
    agent: "Objection Agent",
    prompt: "User mentioned budget constraints. Generate appropriate objection.",
    response: "C'est intéressant, mais nos budgets sont très serrés cette année...",
    confidence: 78,
    processingTime: 520,
  },
  {
    timestamp: "00:04:15",
    event: "Emotion Analysis",
    agent: "Emotion Agent",
    prompt: "Analyze user emotional state from voice patterns",
    response: "Stress level: 35%, Confidence: 72%, Engagement: 88%",
    confidence: 91,
    processingTime: 180,
  },
]

const agentStats = [
  {
    name: "Discovery Agent",
    activations: 8,
    avgConfidence: 87,
    avgResponseTime: 420,
    status: "active",
    description: "Génère des questions de découverte et d'exploration des besoins",
  },
  {
    name: "Objection Agent",
    activations: 5,
    avgConfidence: 76,
    avgResponseTime: 580,
    status: "active",
    description: "Simule les objections et résistances client",
  },
  {
    name: "Technical Agent",
    activations: 3,
    avgConfidence: 94,
    avgResponseTime: 320,
    status: "standby",
    description: "Fournit des réponses techniques approfondies",
  },
  {
    name: "Emotion Agent",
    activations: 12,
    avgConfidence: 89,
    avgResponseTime: 150,
    status: "active",
    description: "Analyse les émotions et le stress de l'utilisateur",
  },
  {
    name: "Closing Agent",
    activations: 2,
    avgConfidence: 82,
    avgResponseTime: 450,
    status: "standby",
    description: "Aide à la conclusion et aux next steps",
  },
]

const systemMetrics = {
  totalPrompts: 28,
  avgResponseTime: 385,
  successRate: 94,
  errorRate: 2,
  cacheHitRate: 67,
  activeAgents: 4,
}

export default function DebugAgent() {
  const router = useRouter()
  const [selectedAgent, setSelectedAgent] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("current")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "standby":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredTimeline =
    selectedAgent === "all"
      ? simulationTimeline
      : simulationTimeline.filter((event) => event.agent.toLowerCase().includes(selectedAgent.toLowerCase()))

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
              <Code className="w-6 h-6 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold">Debug Agent IA</h1>
                <p className="text-gray-600">Analyse technique des échanges et performance des agents</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Activity className="w-3 h-3" />
                <span>Simulation Active</span>
              </Badge>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Session actuelle</SelectItem>
                  <SelectItem value="last">Dernière session</SelectItem>
                  <SelectItem value="all">Toutes les sessions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="metrics">Métriques</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Timeline de la simulation</span>
                    </CardTitle>
                    <CardDescription>Chronologie détaillée des interactions IA</CardDescription>
                  </div>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrer par agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les agents</SelectItem>
                      <SelectItem value="discovery">Discovery Agent</SelectItem>
                      <SelectItem value="objection">Objection Agent</SelectItem>
                      <SelectItem value="technical">Technical Agent</SelectItem>
                      <SelectItem value="emotion">Emotion Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {filteredTimeline.map((event, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline">{event.timestamp}</Badge>
                            <Badge className={getStatusColor("active")}>{event.agent}</Badge>
                            <span className="font-medium">{event.event}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${getConfidenceColor(event.confidence)}`}>
                              {event.confidence}%
                            </span>
                            <Badge variant="secondary">{event.processingTime}ms</Badge>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h5 className="font-semibold text-gray-700 mb-1">Prompt envoyé</h5>
                            <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">{event.prompt}</div>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-700 mb-1">Réponse reçue</h5>
                            <div className="bg-green-50 p-2 rounded border-l-4 border-green-400">{event.response}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentStats.map((agent, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
                    </div>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Activations</div>
                        <div className="font-bold text-lg">{agent.activations}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Temps moyen</div>
                        <div className="font-bold text-lg">{agent.avgResponseTime}ms</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Confiance moyenne</span>
                        <span className={getConfidenceColor(agent.avgConfidence)}>{agent.avgConfidence}%</span>
                      </div>
                      <Progress value={agent.avgConfidence} className="h-2" />
                    </div>

                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Brain className="w-4 h-4 mr-2" />
                      Voir détails
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">{systemMetrics.totalPrompts}</div>
                      <div className="text-sm text-gray-600">Prompts totaux</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <div>
                      <div className="text-2xl font-bold">{systemMetrics.avgResponseTime}ms</div>
                      <div className="text-sm text-gray-600">Temps moyen</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">{systemMetrics.successRate}%</div>
                      <div className="text-sm text-gray-600">Taux de succès</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance système</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Taux de succès</span>
                      <span className="text-green-600">{systemMetrics.successRate}%</span>
                    </div>
                    <Progress value={systemMetrics.successRate} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cache hit rate</span>
                      <span className="text-blue-600">{systemMetrics.cacheHitRate}%</span>
                    </div>
                    <Progress value={systemMetrics.cacheHitRate} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Taux d'erreur</span>
                      <span className="text-red-600">{systemMetrics.errorRate}%</span>
                    </div>
                    <Progress value={systemMetrics.errorRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Agents actifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agentStats
                      .filter((agent) => agent.status === "active")
                      .map((agent, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">{agent.name}</span>
                          </div>
                          <Badge variant="outline">{agent.activations} calls</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Prompts Tab */}
          <TabsContent value="prompts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-5 h-5" />
                  <span>Structure des prompts</span>
                </CardTitle>
                <CardDescription>Analyse détaillée des prompts envoyés aux agents IA</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {simulationTimeline.map((event, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline">{event.agent}</Badge>
                          <div className="flex items-center space-x-2">
                            <Badge className={getConfidenceColor(event.confidence)}>
                              Confiance: {event.confidence}%
                            </Badge>
                            <Badge variant="secondary">{event.processingTime}ms</Badge>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                          <div className="text-gray-600 mb-1">Prompt:</div>
                          <div className="text-gray-900">{event.prompt}</div>
                        </div>

                        <div className="mt-3 bg-blue-50 p-3 rounded-lg font-mono text-sm">
                          <div className="text-blue-600 mb-1">Response:</div>
                          <div className="text-blue-900">{event.response}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
