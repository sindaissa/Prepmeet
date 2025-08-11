"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Home,
  Download,
  RotateCcw,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Target,
  Clock,
  Award,
} from "lucide-react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"

const clientsData = {
  millesimal: { name: "MILLÉSIMAL", logo: "🍷" },
  altyn: { name: "ALTYN", logo: "🏢" },
  bouygues: { name: "Bouygues Telecom", logo: "📱" },
  bpi: { name: "BPI France", logo: "🏦" },
  distalmotion: { name: "Distalmotion", logo: "🤖" },
  loreal: { name: "L'Oréal", logo: "💄" },
}

const meetingTypes = {
  decouverte: { name: "Découverte", icon: "🔍" },
  presentation: { name: "Présentation", icon: "📊" },
  negociation: { name: "Négociation", icon: "🤝" },
  crise: { name: "Gestion de crise", icon: "🚨" },
  suivi: { name: "Suivi projet", icon: "📋" },
  comite: { name: "Comité de décision", icon: "👥" },
}

export default function Feedback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)

  const clientId = searchParams?.get("client") || ""
  const meetingTypeId = searchParams?.get("type") || ""
  const duration = Number.parseInt(searchParams?.get("duration") || "0")

  const client = clientsData[clientId as keyof typeof clientsData]
  const meetingType = meetingTypes[meetingTypeId as keyof typeof meetingTypes]

  // Génération de scores dynamiques basés sur la durée et le type de réunion
  const generateScores = () => {
    const baseScore = Math.max(60, Math.min(95, 70 + (duration / 60) * 5)) // Score basé sur la durée
    const variation = () => Math.random() * 20 - 10 // Variation de ±10

    return {
      global: Math.round(baseScore + variation()),
      clarte: Math.round(Math.max(50, Math.min(100, baseScore + variation()))),
      pertinence: Math.round(Math.max(50, Math.min(100, baseScore + variation()))),
      objections: Math.round(Math.max(50, Math.min(100, baseScore + variation()))),
      posture: Math.round(Math.max(50, Math.min(100, baseScore + variation()))),
      stress: Math.round(Math.max(30, Math.min(90, 70 - (baseScore - 70)))),
    }
  }

  const [scores] = useState(generateScores())

  const radarData = [
    { subject: "Clarté", A: scores.clarte, fullMark: 100 },
    { subject: "Pertinence", A: scores.pertinence, fullMark: 100 },
    { subject: "Objections", A: scores.objections, fullMark: 100 },
    { subject: "Posture", A: scores.posture, fullMark: 100 },
    { subject: "Gestion stress", A: 100 - scores.stress, fullMark: 100 },
  ]

  const generateFeedback = () => {
    const feedbacks = {
      pointsForts: [
        "Excellente écoute active et reformulation des besoins client",
        "Présentation claire et structurée de la solution Talan",
        "Bonne connaissance du secteur d'activité du client",
        "Gestion efficace du temps de parole",
        "Arguments techniques solides et bien documentés",
      ],
      ameliorations: [
        "Approfondir les questions de découverte des enjeux business",
        "Renforcer l'argumentation sur la différenciation vs concurrents",
        "Améliorer la gestion des objections tarifaires",
        "Développer plus d'exemples concrets et de références",
        "Travailler la conclusion et les prochaines étapes",
      ],
    }

    // Sélection aléatoire de 3 points forts et 2-3 améliorations
    const selectedForts = feedbacks.pointsForts.sort(() => 0.5 - Math.random()).slice(0, 3)

    const selectedAmeliorations = feedbacks.ameliorations
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.random() > 0.5 ? 2 : 3)

    return { pointsForts: selectedForts, ameliorations: selectedAmeliorations }
  }

  const [feedback] = useState(generateFeedback())

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/signin")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}min ${secs}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "bg-green-500" }
    if (score >= 80) return { label: "Très bien", color: "bg-blue-500" }
    if (score >= 70) return { label: "Bien", color: "bg-yellow-500" }
    if (score >= 60) return { label: "Correct", color: "bg-orange-500" }
    return { label: "À améliorer", color: "bg-red-500" }
  }

  if (!user || !client || !meetingType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const scoreBadge = getScoreBadge(scores.global)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="flex items-center space-x-2 flex-shrink-0"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Accueil</span>
              </Button>
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <div className="text-xl sm:text-2xl flex-shrink-0">{client.logo}</div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold truncate">Résultats de simulation</h1>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {meetingType.icon} {meetingType.name}
                    </Badge>
                    <Badge variant="secondary" className="text-xs truncate max-w-24 sm:max-w-none">
                      {client.name}
                    </Badge>
                    <Badge className={`${scoreBadge.color} text-xs`}>{scoreBadge.label}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => router.push(`/report?client=${clientId}&type=${meetingTypeId}&duration=${duration}`)}
                className="text-xs sm:text-sm"
                size="sm"
              >
                <Download className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Rapport PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
              <Button
                onClick={() => router.push(`/simulate?client=${clientId}&type=${meetingTypeId}`)}
                className="text-xs sm:text-sm"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Refaire</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Score global et métriques */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Score global */}
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2 text-lg sm:text-xl">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  <span>Score Global</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl sm:text-6xl font-bold mb-4">
                  <span className={getScoreColor(scores.global)}>{scores.global}</span>
                  <span className="text-lg sm:text-2xl text-gray-400">/100</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Durée: {formatDuration(duration)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>Objectif: {meetingType.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Graphique radar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Analyse détaillée des compétences</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Évaluation sur 5 dimensions clés de la performance commerciale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Performance"
                        dataKey="A"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Scores détaillés */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6">
                  {radarData.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(item.A)}`}>{item.A}</div>
                      <div className="text-xs sm:text-sm text-gray-600">{item.subject}</div>
                      <Progress value={item.A} className="mt-2 h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feedback IA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Points forts */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800 text-base sm:text-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span>Points forts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {feedback.pointsForts.map((point, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-xs sm:text-sm text-green-900">{point}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Points d'amélioration */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-800 text-base sm:text-lg">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Points d'amélioration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {feedback.ameliorations.map((point, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-xs sm:text-sm text-orange-900">{point}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar informations */}
          <div className="space-y-4 sm:space-y-6">
            {/* Résumé session */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Résumé de la session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Participant</p>
                  <p className="font-semibold text-sm sm:text-base truncate">{user.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{user.role}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Client simulé</p>
                  <p className="font-semibold text-sm sm:text-base">{client.name}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Type de réunion</p>
                  <p className="font-semibold text-sm sm:text-base">{meetingType.name}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Durée</p>
                  <p className="font-semibold text-sm sm:text-base">{formatDuration(duration)}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Date</p>
                  <p className="font-semibold text-sm sm:text-base">{new Date().toLocaleDateString("fr-FR")}</p>
                </div>
              </CardContent>
            </Card>

            {/* Recommandations personnalisées */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 text-base sm:text-lg">Recommandations IA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-xs sm:text-sm text-blue-900">
                  <p>
                    <strong>Formation suggérée:</strong> Module "Gestion des objections" adapté au secteur {client.name}
                  </p>
                  <p>
                    <strong>Prochaine simulation:</strong> Essayez une réunion de
                    {meetingTypeId === "decouverte"
                      ? " présentation"
                      : meetingTypeId === "presentation"
                        ? " négociation"
                        : " suivi projet"}{" "}
                    avec le même client
                  </p>
                  <p>
                    <strong>Ressources:</strong> Consultez la fiche client détaillée et les success stories Talan
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent text-xs sm:text-sm"
                  onClick={() => router.push("/history")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Voir l'historique
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent text-xs sm:text-sm"
                  onClick={() => router.push("/assistant")}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Coach personnel
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent text-xs sm:text-sm"
                  onClick={() => router.push(`/client-info?client=${clientId}&type=${meetingTypeId}`)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Revoir les infos client
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
