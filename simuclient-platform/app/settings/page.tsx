"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Settings,
  Shield,
  Download,
  Trash2,
  Moon,
  Sun,
  Globe,
  Bell,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState({
    name: "Sophie Martin",
    email: "sophie.martin@talan.com",
    role: "Senior Manager",
    team: "Digital Transformation",
    phone: "+33 1 23 45 67 89",
  })

  const [preferences, setPreferences] = useState({
    language: "fr",
    theme: "light",
    notifications: true,
    emailReports: true,
    autoSave: true,
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleProfileUpdate = () => {
    // Simulate profile update
    alert("Profil mis à jour avec succès !")
  }

  const handleDataExport = () => {
    // Simulate data export
    const data = {
      profile,
      simulations: 15,
      averageScore: 82,
      exportDate: new Date().toISOString(),
    }

    const element = document.createElement("a")
    element.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2))
    element.download = "mes-donnees-simuclient.json"
    element.click()
  }

  const handleDataDeletion = () => {
    if (showDeleteConfirm) {
      // Simulate data deletion request
      alert("Demande de suppression envoyée. Vous recevrez une confirmation par email.")
      setShowDeleteConfirm(false)
    } else {
      setShowDeleteConfirm(true)
    }
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
              <Settings className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Paramètres</h1>
                <p className="text-gray-600">Gérez votre profil et vos préférences</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profil</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Préférences</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Confidentialité</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Mes données</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Informations personnelles</span>
                </CardTitle>
                <CardDescription>Modifiez vos informations de profil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Select value={profile.role} onValueChange={(value) => setProfile({ ...profile, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Senior Manager">Senior Manager</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Junior Manager">Junior Manager</SelectItem>
                        <SelectItem value="Team Lead">Team Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team">Équipe</Label>
                    <Select value={profile.team} onValueChange={(value) => setProfile({ ...profile, team: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Digital Transformation">Digital Transformation</SelectItem>
                        <SelectItem value="Business Development">Business Development</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Delivery">Delivery</SelectItem>
                        <SelectItem value="R&D">R&D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleProfileUpdate}>Sauvegarder les modifications</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Langue et région</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Langue de l'interface</Label>
                        <p className="text-sm text-gray-600">Choisissez votre langue préférée</p>
                      </div>
                      <Select
                        value={preferences.language}
                        onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sun className="w-5 h-5" />
                    <span>Apparence</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Thème</Label>
                        <p className="text-sm text-gray-600">Choisissez entre le thème clair ou sombre</p>
                      </div>
                      <Select
                        value={preferences.theme}
                        onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center space-x-2">
                              <Sun className="w-4 h-4" />
                              <span>Clair</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center space-x-2">
                              <Moon className="w-4 h-4" />
                              <span>Sombre</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notifications push</Label>
                        <p className="text-sm text-gray-600">Recevoir des notifications dans l'application</p>
                      </div>
                      <Switch
                        checked={preferences.notifications}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Rapports par email</Label>
                        <p className="text-sm text-gray-600">Recevoir un résumé hebdomadaire par email</p>
                      </div>
                      <Switch
                        checked={preferences.emailReports}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, emailReports: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sauvegarde automatique</Label>
                        <p className="text-sm text-gray-600">Sauvegarder automatiquement vos progrès</p>
                      </div>
                      <Switch
                        checked={preferences.autoSave}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, autoSave: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Confidentialité et sécurité</span>
                </CardTitle>
                <CardDescription>Gérez vos paramètres de confidentialité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Vos données sont traitées conformément au RGPD et à la politique de confidentialité de Talan.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Collecte de données</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Nous collectons uniquement les données nécessaires au fonctionnement de la plateforme :
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Informations de profil (nom, email, rôle)</li>
                      <li>• Données de performance des simulations</li>
                      <li>• Logs d'utilisation pour l'amélioration du service</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Partage des données</h4>
                    <p className="text-sm text-gray-600 mb-3">Vos données peuvent être partagées avec :</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Votre manager direct (scores et progression)</li>
                      <li>• L'équipe RH (statistiques anonymisées)</li>
                      <li>• Les formateurs (pour personnaliser l'accompagnement)</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Durée de conservation</h4>
                    <p className="text-sm text-gray-600">
                      Vos données sont conservées pendant la durée de votre emploi chez Talan plus 3 ans, conformément
                      aux obligations légales.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Télécharger mes données</span>
                  </CardTitle>
                  <CardDescription>Exportez toutes vos données personnelles (RGPD)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Vous pouvez télécharger un fichier contenant toutes vos données personnelles stockées sur la
                      plateforme SimuClient.
                    </p>
                    <div className="flex items-center space-x-4">
                      <Button onClick={handleDataExport} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger mes données
                      </Button>
                      <Badge variant="secondary">Format JSON</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <Trash2 className="w-5 h-5" />
                    <span>Supprimer mon compte</span>
                  </CardTitle>
                  <CardDescription>Demander la suppression définitive de toutes vos données</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Attention :</strong> Cette action est irréversible. Toutes vos données seront
                        définitivement supprimées après validation par l'équipe RH.
                      </AlertDescription>
                    </Alert>

                    {showDeleteConfirm && (
                      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <h4 className="font-semibold text-red-800 mb-2">Confirmer la suppression</h4>
                        <p className="text-sm text-red-700 mb-3">
                          Êtes-vous sûr de vouloir supprimer définitivement votre compte et toutes vos données ?
                        </p>
                        <Textarea
                          placeholder="Veuillez indiquer la raison de cette demande (optionnel)"
                          className="mb-3"
                        />
                        <div className="flex space-x-2">
                          <Button variant="destructive" size="sm" onClick={handleDataDeletion}>
                            Confirmer la suppression
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                            Annuler
                          </Button>
                        </div>
                      </div>
                    )}

                    {!showDeleteConfirm && (
                      <Button variant="destructive" onClick={handleDataDeletion}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Demander la suppression
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
