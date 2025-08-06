"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Users, Target, TrendingUp, LogOut, User, Building2, Menu, X } from "lucide-react"

const meetingTypes = [
  {
    id: "decouverte",
    name: "Découverte",
    description: "Première rencontre client, identification des besoins",
    duration: "45-60 min",
    difficulty: "Débutant",
  },
  {
    id: "presentation",
    name: "Présentation",
    description: "Présentation de solution, démonstration produit",
    duration: "60-90 min",
    difficulty: "Intermédiaire",
  },
  {
    id: "negociation",
    name: "Négociation",
    description: "Discussion tarifaire, conditions contractuelles",
    duration: "90-120 min",
    difficulty: "Avancé",
  },
  {
    id: "crise",
    name: "Gestion de crise",
    description: "Résolution de problème, réclamation client",
    duration: "30-45 min",
    difficulty: "Expert",
  },
  {
    id: "suivi",
    name: "Suivi projet",
    description: "Point d'avancement, validation étapes",
    duration: "30-45 min",
    difficulty: "Intermédiaire",
  },
  {
    id: "comite",
    name: "Comité de décision",
    description: "Présentation devant comité, validation budget",
    duration: "60-90 min",
    difficulty: "Expert",
  },
]

const clients = [
  {
    id: "millesimal",
    name: "MILLÉSIMAL",
    sector: "Fintech & Services financiers",
    logo: "🍷",
    description: "Vente en ligne de grands vins et champagnes fins",
  },
  {
    id: "altyn",
    name: "ALTYN",
    sector: "Énergie et climat",
    logo: "🏢",
    description: "Transition énergétique des bâtiments et territoires",
  },
  {
    id: "bouygues",
    name: "Bouygues Telecom",
    sector: "Télécommunications",
    logo: "📱",
    description: "Forfaits mobiles, internet, services pro",
  },
  {
    id: "bpi",
    name: "BPI France",
    sector: "Banque publique d'investissement",
    logo: "🏦",
    description: "Financement, investissement, conseil aux entreprises",
  },
  {
    id: "distalmotion",
    name: "Distalmotion",
    sector: "Chirurgie robotique",
    logo: "🤖",
    description: "Système de chirurgie robotique DEXTER®",
  },
  {
    id: "loreal",
    name: "L'Oréal",
    sector: "Cosmétiques & Luxe",
    logo: "💄",
    description: "Cosmétiques, parfums, produits de beauté",
  },
]

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedMeetingType, setSelectedMeetingType] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/signin")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/auth/signin")
  }

  const handleLaunchSimulation = () => {
    if (selectedClient && selectedMeetingType) {
      router.push(`/client-info?client=${selectedClient}&type=${selectedMeetingType}`)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Débutant":
        return "bg-green-100 text-green-800"
      case "Intermédiaire":
        return "bg-yellow-100 text-yellow-800"
      case "Avancé":
        return "bg-orange-100 text-orange-800"
      case "Expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SimuClient
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">by Talan</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium truncate max-w-32">{user.name}</span>
                <Badge variant="outline" className="text-xs">
                  {user.role || "Manager"}
                </Badge>
              </div>

              <nav className="flex space-x-6">
                <a href="/history" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Historique
                </a>
                <a href="/assistant" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Assistant
                </a>
                <a href="/clients" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Clients
                </a>
                {user.role === "admin" && (
                  <a href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                    Dashboard RH
                  </a>
                )}
              </nav>

              <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2 bg-transparent">
                <LogOut className="w-4 h-4" />
                <span className="hidden xl:inline">Déconnexion</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-gray-100 px-2 py-1 rounded-lg">
                <User className="w-3 h-3 text-gray-600" />
                <span className="text-xs font-medium truncate max-w-20">{user.name.split(" ")[0]}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t pt-4">
              <nav className="flex flex-col space-y-3">
                <a href="/history" className="text-gray-600 hover:text-blue-600 transition-colors text-sm py-2">
                  Historique
                </a>
                <a href="/assistant" className="text-gray-600 hover:text-blue-600 transition-colors text-sm py-2">
                  Assistant
                </a>
                <a href="/clients" className="text-gray-600 hover:text-blue-600 transition-colors text-sm py-2">
                  Clients
                </a>
                {user.role === "admin" && (
                  <a href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors text-sm py-2">
                    Dashboard RH
                  </a>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-transparent justify-start mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Target className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Formation Interactive</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Bienvenue {user.name.split(" ")[0]} ! <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Choisissez votre simulation
              </span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Sélectionnez un client Talan et le type de réunion pour commencer votre simulation personnalisée
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="text-center">
              <CardContent className="pt-4 sm:pt-6">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900">500+</div>
                <div className="text-xs sm:text-sm text-gray-600">Managers formés</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4 sm:pt-6">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{clients.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Clients Talan</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4 sm:pt-6">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900">85%</div>
                <div className="text-xs sm:text-sm text-gray-600">Taux de satisfaction</div>
              </CardContent>
            </Card>
          </div>

          {/* Selection Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Client Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>1. Sélectionnez un client</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Choisissez le client Talan avec lequel vous souhaitez simuler la réunion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedClient === client.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedClient(client.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-xl sm:text-2xl flex-shrink-0">{client.logo}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{client.name}</h3>
                          <p className="text-xs sm:text-sm text-blue-600 mb-1 truncate">{client.sector}</p>
                          <p className="text-xs text-gray-600 line-clamp-2">{client.description}</p>
                        </div>
                        {selectedClient === client.id && (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meeting Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span>2. Type de réunion</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Sélectionnez le type de réunion que vous souhaitez simuler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {meetingTypes.map((meeting) => (
                    <div
                      key={meeting.id}
                      className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedMeetingType === meeting.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedMeetingType(meeting.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{meeting.name}</h3>
                            <Badge className={`${getDifficultyColor(meeting.difficulty)} text-xs`}>
                              {meeting.difficulty}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{meeting.description}</p>
                          <p className="text-xs text-purple-600">Durée: {meeting.duration}</p>
                        </div>
                        {selectedMeetingType === meeting.id && (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Launch Button */}
          <div className="text-center mt-6 sm:mt-8">
            <Button
              onClick={handleLaunchSimulation}
              disabled={!selectedClient || !selectedMeetingType}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 sm:px-8 py-3 text-sm sm:text-base lg:text-lg h-auto"
              size="lg"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Voir les infos client et lancer la simulation
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
