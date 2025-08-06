"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Play,
  Building2,
  Users,
  TrendingUp,
  MapPin,
  Euro,
  ExternalLink,
  Target,
  Briefcase,
} from "lucide-react"

const clientsData = {
  millesimal: {
    name: "MILLÉSIMA",
    sector: "4634Z – commerce de gros (commerce interentreprises) de boissons",
    logo: "🍷",
    products:
      "Vente en ligne de grands vins et champagnes fins (grands crus classés, vins primeurs), achat direct auprès des propriétés, environ 2,5 millions de bouteilles stockées. Fiches produits détaillées (dégustation, millésimes, notes presse), formats rares via la 'Bibliothèque impériale'. Services : conseils œnologiques (7 conseillers), coffrets cadeaux d'affaires sur mesure, événements de dégustation 'Panorama'.",
    clients: [],
    actualites: [
      "Collaboration avec Talan (2022-2023) : intégration IA pour prédiction des ventes et tarification dynamique, portée : 234 000 références produits, 15 000 clients dans 18 pays. Résultat : amélioration gestion des stocks, hausse CA (~70 M€).",
      "Lancement en 2023 d'une gamme de spiritueux haut de gamme (~175 références), avec objectif de diversification.",
      "Ouverture d'une nouvelle boutique à New York (Upper East Side) en février 2024 (1257 2nd Avenue, 5200 sqft).",
    ],
    ca: "≈55 M€ (exercice 2023)",
    effectif: "68 (2023)",
    localisation: [
      "Siège : Bordeaux (87 quai de Paludate)",
      "USA : Boutique à New York (1257 2nd Avenue, Upper East Side)",
      "France : Saint-Tropez, Millésima La Plage au Cap Ferret",
    ],
    linkedin: ["https://www.linkedin.com/in/hortense-bernard-3026519", "https://www.linkedin.com/in/philippinedunoyer"],
    historique:
      "Depuis 2022, collaboration avec Talan sur des projets IA (prédiction des ventes, tarification dynamique), portant sur 234 000 références produits et 15 000 clients dans 18 pays. Objectif : optimisation des stocks et augmentation du CA. Projet d'une durée d'environ 18 mois, résultats positifs et perspectives de poursuite.",
    concurrents: [
      "SQLI (refonte e-commerce avec architecture headless, ReactJS + Spring Boot, performance site web)",
      "Sensefuel (moteur de recherche intelligent basé sur IA pour conversion e-commerce)",
    ],
  },
  altyn: {
    name: "ALTYN",
    sector: "Énergie et climat, transition énergétique, environnementale et numérique des bâtiments et des territoires",
    logo: "🏢",
    products:
      "Conseil, ingénierie, services et travaux liés à la transition énergétique, environnementale et numérique des bâtiments et des territoires. Contrats de Performance Énergétique (CPE), audits énergétiques, gestion et maintenance des systèmes énergétiques, assistance à maîtrise d'ouvrage BIM, conseil en stratégie BIM et de BIM & CIM Management, synthèse BIM, réhabilitation lourde, d'extension et de surélévation tous corps d'état, commissionnement ou rétro-commissionnement, mise au point (GTB et CVC), exploitation avec garanties de performance, Energy Management, intégration de systèmes digitaux liés à la performance énergétique et environnementale des bâtiments.",
    clients: [
      "Sarthe Habitat",
      "Jardineries TRUFFAUT",
      "Habitat 44",
      "USH Pays-de-la-Loire",
      "Université Paris 8",
      "7 bailleurs sociaux de la région Pays de la Loire",
    ],
    actualites: [
      "Inauguration de la résidence Georges Gauthier avec Sarthe Habitat (1er IMH en Europe réhabilité selon la démarche EnergieSprong)",
      "Accompagnement de TRUFFAUT pour la gestion technique des bâtiments",
      "Réhabilitation de la résidence Bois Rochefort à Guérande avec Habitat 44 et l'USH Pays-de-la-Loire",
      "Livraison de la première réhabilitation énergétique sur une université française selon la démarche EnergieSprong à l'Université Paris 8",
    ],
    ca: "Croissance de +68% confirmée (en 2024)",
    effectif: "Recrutement de 250 personnes en CDI (annoncé en 2023)",
    localisation: ["France (Île-de-France, Grand Ouest)"],
    linkedin: [
      "Sophie LAPIERRE (Directrice communication & marketing - Directrice responsabilité sociétale des entreprises)",
    ],
    historique: "Non mentionné",
    concurrents: ["Non mentionné"],
  },
  bouygues: {
    name: "Bouygues Telecom",
    sector: "Télécommunications",
    logo: "📱",
    products:
      "Forfaits mobiles, offres internet (Bbox fibre, 5G box), téléphones, accessoires pour téléphones, services pour professionnels (forfaits mobiles pro, Box Pro Evolutive, standard téléphonique, cybersécurité)",
    clients: ["Samsung", "Apple", "Xiaomi", "Honor", "Google Pixel", "Deezer", "L'atelier de Roxane"],
    actualites: [
      "Promotion des Samsung Galaxy Z Fold/Flip",
      "Lancement de l'iPhone 16",
      "Offre B&YOU Pure Fibre",
      "Nouvelle Box Wifi 7",
      "Forfait voyage 100% eSIM",
      "Kids Watch TCL MT46",
    ],
    ca: "Non mentionné",
    effectif: "10 000 conseillers et 500 boutiques",
    localisation: ["France"],
    linkedin: ["William Boutet"],
    historique: "Non mentionné",
    concurrents: ["Non mentionné"],
  },
  bpi: {
    name: "BPI France",
    sector: "Banque publique d'investissement",
    logo: "🏦",
    products:
      "Financement (trésorerie, actifs, immatériel, projets, innovation, export, garantie), Investissement (Capital Innovation, Capital Développement, Fonds de Fonds), Conseil (Formation, Mise en réseau, Accélération), accompagnement à la création d'entreprise, soutien à l'innovation, développement à l'international",
    clients: [
      "Entreprises (TPE, PME, ETI, grandes entreprises, startups)",
      "partenaires bancaires",
      "régions",
      "réseaux d'accompagnement",
      "investisseurs institutionnels",
      "CMA CGM",
      "La France Mutualiste",
      "Compagnie Léa Nature",
      "Groupe Berdoues Parfums et Cosmétiques",
      "MagREEsource",
      "Spiko",
      "Elis",
      "Verkor",
    ],
    actualites: [
      "Plan Industrie, Plan Climat, Plan Tech",
      "Soutien aux secteurs stratégiques (Santé, Cybersécurité, Défense, French Touch)",
      "Développement de l'écosystème IA",
      "Accompagnement de la transition écologique des entreprises",
    ],
    ca: "En 2023, Bpifrance a injecté 63 milliards d'euros dans le financement de l'économie française",
    effectif: "Plus de 3 000 collaborateurs",
    localisation: ["France (50 implantations régionales)"],
    linkedin: [
      "Nicolas Parpex (Directeur French Touch Capital)",
      "Delphine Le Mintier-Jonglez (Directrice d'investissements senior Mode & Luxe)",
      "Damien d'Houdain (Directeur d'investissements senior)",
      "Malik Adouani (Directeur d'investissements)",
      "Julie Momas (Directrice de participations)",
      "Alexandre Poisson (Chargé d'investissements senior)",
      "Marie-Léa Higoa (Chargée d'investissements junior)",
      "Yona Panazol (Chargée de mission senior plan French Touch)",
      "Albane Zelmar (Chargée de suivi portefeuille et pilotage financier)",
      "Sania Kahlouche (Assistante de direction)",
    ],
    historique: "Non mentionnée",
    concurrents: ["Non applicable (Bpifrance est une banque publique d'investissement, pas un projet)"],
  },
  distalmotion: {
    name: "Distalmotion",
    sector: "Chirurgie robotique",
    logo: "🤖",
    products: "Système de chirurgie robotique DEXTER®",
    clients: ["Hôpitaux", "chirurgiens", "centres d'enseignement experts", "King's Health Partners", "CHUV Lausanne"],
    actualites: [
      "Participation à divers congrès et événements (Society of Robotic Surgery, American Hernia Society, EAU - Robotic Surgery Section, etc.)",
    ],
    ca: "Non mentionné",
    effectif: "Plus de 150 employés",
    localisation: ["Lausanne, Suisse"],
    linkedin: ["Non mentionné"],
    historique: "Non mentionné",
    concurrents: ["Non mentionné"],
  },
  loreal: {
    name: "L'Oréal",
    sector: "Vente de vins et spiritueux",
    logo: "💄",
    products:
      "Vins grands crus classés, champagnes, vins en primeurs, vins du monde, spiritueux (Whisky, Rhum, Cognac, Armagnac, Tequila, etc.)",
    clients: [
      "Non mentionné explicitement, mais travaille avec de nombreux domaines et châteaux prestigieux (e.g., Château Margaux, Château Lafite Rothschild, Dom Pérignon, etc.)",
    ],
    actualites: [
      "Primeurs 2024 (Bordeaux, Bourgogne, Vallée du Rhône, Alsace)",
      "Offre de magnum offert dès 400€ d'achats",
    ],
    ca: "Non mentionné",
    effectif: "Non mentionné",
    localisation: ["Chais à Bordeaux"],
    linkedin: ["Non mentionné"],
    historique: "Non mentionnée",
    concurrents: ["Non pertinent, car il s'agit d'un site de vente de vins, pas d'un projet impliquant Talan."],
  },
}

const meetingTypes = {
  decouverte: { name: "Découverte", icon: "🔍" },
  presentation: { name: "Présentation", icon: "📊" },
  negociation: { name: "Négociation", icon: "🤝" },
  crise: { name: "Gestion de crise", icon: "🚨" },
  suivi: { name: "Suivi projet", icon: "📋" },
  comite: { name: "Comité de décision", icon: "👥" },
}

export default function ClientInfo() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)

  const clientId = searchParams?.get("client") || ""
  const meetingTypeId = searchParams?.get("type") || ""

  const client = clientsData[clientId as keyof typeof clientsData]
  const meetingType = meetingTypes[meetingTypeId as keyof typeof meetingTypes]

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/signin")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLaunchSimulation = () => {
    router.push(`/simulate?client=${clientId}&type=${meetingTypeId}`)
  }

  if (!user || !client || !meetingType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

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
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <div className="text-2xl sm:text-3xl flex-shrink-0">{client.logo}</div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold truncate">{client.name}</h1>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {meetingType.icon} {meetingType.name}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Préparation
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLaunchSimulation}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-shrink-0 text-sm sm:text-base"
              size="sm"
            >
              <Play className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Lancer la simulation</span>
              <span className="sm:hidden">Lancer</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Vue d'ensemble */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>Vue d'ensemble</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Secteur d'activité</h4>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{client.sector}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Produits & Services</h4>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{client.products}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actualités et projets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Actualités & Projets en cours</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {client.actualites.map((actualite, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700 leading-relaxed">{actualite}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Clients et partenaires */}
            {client.clients.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span>Clients & Partenaires majeurs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {client.clients.map((clientName, index) => (
                      <Badge key={index} variant="outline" className="text-xs sm:text-sm">
                        {clientName}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Historique Talan */}
            {client.historique !== "Non mentionné" && client.historique !== "Non mentionnée" && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-800 text-lg sm:text-xl">
                    <Briefcase className="w-5 h-5" />
                    <span>Historique relation avec Talan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-900 leading-relaxed text-sm sm:text-base">{client.historique}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar informations clés */}
          <div className="space-y-4 sm:space-y-6">
            {/* Métriques clés */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Métriques clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Euro className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Chiffre d'affaires</p>
                    <p className="font-semibold text-sm sm:text-base break-words">{client.ca}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Effectif</p>
                    <p className="font-semibold text-sm sm:text-base break-words">{client.effectif}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Localisation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span>Localisation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {client.localisation.map((location, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm text-gray-700 break-words">{location}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contacts LinkedIn */}
            {client.linkedin.length > 0 && client.linkedin[0] !== "Non mentionné" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <ExternalLink className="w-5 h-5 text-blue-600" />
                    <span>Contacts clés</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {client.linkedin.map((contact, index) => (
                      <div key={index} className="text-xs sm:text-sm">
                        {contact.startsWith("http") ? (
                          <a
                            href={contact}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center space-x-1 break-all"
                          >
                            <span>Profil LinkedIn</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        ) : (
                          <p className="text-gray-700 break-words">{contact}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Concurrents */}
            {client.concurrents.length > 0 &&
              client.concurrents[0] !== "Non mentionné" &&
              !client.concurrents[0].includes("Non applicable") && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-orange-800 text-base sm:text-lg">
                      <Target className="w-5 h-5" />
                      <span>Concurrents identifiés</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {client.concurrents.map((concurrent, index) => (
                        <div
                          key={index}
                          className="text-xs sm:text-sm text-orange-900 bg-orange-100 p-2 rounded break-words"
                        >
                          {concurrent}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Conseils simulation */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800 text-base sm:text-lg">
                  <Target className="w-5 h-5" />
                  <span>Conseils pour la simulation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs sm:text-sm text-green-900">
                  <p>• Préparez-vous aux questions sur l'historique Talan</p>
                  <p>• Mettez en avant les succès passés</p>
                  <p>• Soyez prêt à différencier vs concurrents</p>
                  <p>• Adaptez votre discours au secteur d'activité</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
