"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageCircle,
  Send,
  Bot,
  User,
  ArrowLeft,
  Sparkles,
  Target,
  TrendingUp,
  Star,
  Play,
  BookOpen,
  Lightbulb,
  Rocket,
  Trophy,
  Brain,
} from "lucide-react"
import { useRouter } from "next/navigation"

const aiResponses = [
  "Excellente question ! Pour une réunion de découverte avec MILLÉSIMAL, je recommande de commencer par comprendre leur positionnement unique dans le marché du vin de luxe...",
  "Basé sur votre profil, voici 3 axes d'amélioration prioritaires pour vos négociations : l'écoute active, la gestion des objections, et la création de valeur...",
  "Pour gérer une situation de crise avec un client comme BPI France, la clé est de rester calme et de proposer des solutions concrètes rapidement...",
]

export default function Assistant() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; content: string; timestamp: Date }>>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
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
    const userCreatedDate = new Date(parsedUser.created_at || parsedUser.createdAt || Date.now())
    const daysSinceCreation = (Date.now() - userCreatedDate.getTime()) / (1000 * 60 * 60 * 24)
    setIsNewUser(daysSinceCreation < 1) // Nouveau si créé il y a moins d'1 jour
  }, [router])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      type: "user" as const,
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simuler une réponse de l'IA
    setTimeout(() => {
      const aiMessage = {
        type: "ai" as const,
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 2000)
  }

  const handleQuickAction = (action: string) => {
    setInputMessage(action)
  }

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
                  <h1 className="text-2xl font-bold">Assistant IA Personnel</h1>
                  <p className="text-gray-600">Votre coach commercial intelligent</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section pour nouveau utilisateur */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Bot className="w-4 h-4" />
                <span>Assistant IA Nouvelle Génération</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Salut {user.name.split(" ")[0]} ! 👋
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Je suis votre assistant IA personnel
                </span>
              </h2>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Prêt à révolutionner votre approche commerciale ? Je suis là pour vous accompagner à chaque étape de
                votre parcours d'excellence !
              </p>

              {/* Avatar de l'IA */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Brain className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fonctionnalités principales */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="relative overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <CardContent className="pt-8 pb-6 relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Chat Intelligent</h3>
                  <div className="flex justify-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Posez-moi toutes vos questions sur les techniques de vente, la gestion client, ou les stratégies
                    commerciales
                  </p>
                  <Button
                    onClick={() => setIsNewUser(false)}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    Commencer à chatter
                  </Button>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <CardContent className="pt-8 pb-6 relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Évaluation Personnalisée</h3>
                  <div className="flex items-center justify-center mb-3">
                    <Badge className="bg-blue-100 text-blue-800">Analyse IA</Badge>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Obtenez une analyse détaillée de vos forces et axes d'amélioration basée sur vos simulations
                  </p>
                  <Button
                    onClick={() => router.push("/")}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    Faire une simulation d'abord
                  </Button>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <CardContent className="pt-8 pb-6 relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Conseils Experts</h3>
                  <div className="flex items-center justify-center mb-3">
                    <Badge className="bg-green-100 text-green-800">Contenu Premium</Badge>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Accédez à une bibliothèque de conseils d'experts et de meilleures pratiques commerciales
                  </p>
                  <Button
                    onClick={() => router.push("/clients")}
                    variant="outline"
                    className="w-full border-green-300 text-green-600 hover:bg-green-50"
                  >
                    Explorer les ressources
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Première interaction */}
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 mb-8">
              <CardContent className="py-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Commençons par faire connaissance ! 🤝</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Choisissez une question pour démarrer notre conversation. Je m'adapterai à votre style et vos
                    besoins.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  <Button
                    onClick={() => {
                      setIsNewUser(false)
                      handleQuickAction("Comment puis-je améliorer mes techniques de négociation ?")
                    }}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start"
                  >
                    <div>
                      <div className="font-semibold mb-1">💪 Améliorer mes compétences</div>
                      <div className="text-sm text-gray-600">Techniques de négociation et vente</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => {
                      setIsNewUser(false)
                      handleQuickAction("Quels sont les défis spécifiques aux clients Talan ?")
                    }}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start"
                  >
                    <div>
                      <div className="font-semibold mb-1">🎯 Comprendre mes clients</div>
                      <div className="text-sm text-gray-600">Spécificités des clients Talan</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => {
                      setIsNewUser(false)
                      handleQuickAction("Comment me préparer pour ma première simulation ?")
                    }}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start"
                  >
                    <div>
                      <div className="font-semibold mb-1">🚀 Préparer ma simulation</div>
                      <div className="text-sm text-gray-600">Conseils pour bien commencer</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => {
                      setIsNewUser(false)
                      handleQuickAction("Quelles sont les meilleures pratiques pour gérer une crise client ?")
                    }}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start"
                  >
                    <div>
                      <div className="font-semibold mb-1">🆘 Gestion de crise</div>
                      <div className="text-sm text-gray-600">Techniques de résolution</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Aperçu des capacités */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Mes super-pouvoirs IA 🦸‍♂️</h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">Réponses instantanées</h4>
                    <p className="text-sm text-gray-600">
                      Je traite vos questions en temps réel avec une base de connaissances mise à jour
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">Apprentissage adaptatif</h4>
                    <p className="text-sm text-gray-600">
                      Plus vous m'utilisez, plus mes conseils deviennent personnalisés et pertinents
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">Expertise sectorielle</h4>
                    <p className="text-sm text-gray-600">
                      Connaissance approfondie des secteurs d'activité des clients Talan
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">Suivi de progression</h4>
                    <p className="text-sm text-gray-600">
                      Analyse de vos performances et recommandations d'amélioration continue
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={() => router.push("/")}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Commencer ma première simulation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Interface normale de chat pour utilisateurs expérimentés
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
                <h1 className="text-2xl font-bold">Assistant IA</h1>
                <p className="text-gray-600">Votre coach commercial personnel</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                En ligne
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar avec suggestions */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3 bg-transparent"
                  onClick={() => handleQuickAction("Comment améliorer ma technique de découverte client ?")}
                >
                  <div>
                    <div className="font-medium text-sm">Découverte client</div>
                    <div className="text-xs text-gray-500">Techniques d'écoute</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3 bg-transparent"
                  onClick={() => handleQuickAction("Quelles objections puis-je rencontrer avec MILLÉSIMAL ?")}
                >
                  <div>
                    <div className="font-medium text-sm">Gestion d'objections</div>
                    <div className="text-xs text-gray-500">Secteur vin de luxe</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3 bg-transparent"
                  onClick={() => handleQuickAction("Comment négocier avec BPI France ?")}
                >
                  <div>
                    <div className="font-medium text-sm">Négociation</div>
                    <div className="text-xs text-gray-500">Secteur public</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3 bg-transparent"
                  onClick={() => handleQuickAction("Conseils pour présenter à L'Oréal ?")}
                >
                  <div>
                    <div className="font-medium text-sm">Présentation</div>
                    <div className="text-xs text-gray-500">Secteur cosmétique</div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Zone de chat principale */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Assistant IA SimuClient</CardTitle>
                    <CardDescription>Spécialisé dans l'accompagnement commercial Talan</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Zone des messages */}
                <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">Bonjour {user.name.split(" ")[0]} ! 👋</p>
                      <p className="text-sm">
                        Je suis là pour vous aider à améliorer vos performances commerciales. Posez-moi vos questions !
                      </p>
                    </div>
                  )}

                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} mb-4`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                          message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          {message.type === "user" ? (
                            <AvatarFallback className="bg-blue-500 text-white">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          ) : (
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 ${
                            message.type === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-white border border-gray-200 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                            {message.timestamp.toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="flex items-start space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Zone de saisie */}
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Posez votre question..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Actions rapides */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction("Analyse mes dernières simulations")}
                  >
                    📊 Analyser mes performances
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction("Conseils pour négocier avec un client difficile")}
                  >
                    💪 Gestion de conflit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction("Préparer ma prochaine simulation")}
                  >
                    🎯 Préparation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
