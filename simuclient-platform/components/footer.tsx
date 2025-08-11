"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Users, Mail, Phone, MapPin, ExternalLink, Github, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">SimuClient</h3>
                <p className="text-sm text-gray-400">by Talan</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Plateforme de simulation intelligente de réunions clients pour renforcer les compétences des managers à
              travers des échanges réalistes animés par une IA multi-agents.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm hover:text-white transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/history" className="text-sm hover:text-white transition-colors">
                  Historique
                </a>
              </li>
              <li>
                <a href="/assistant" className="text-sm hover:text-white transition-colors">
                  Assistant Coach
                </a>
              </li>
              <li>
                <a href="/clients" className="text-sm hover:text-white transition-colors">
                  Base Clients
                </a>
              </li>
              <li>
                <a href="/admin" className="text-sm hover:text-white transition-colors">
                  Dashboard RH
                </a>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Ressources</h4>
            <ul className="space-y-2">
              <li>
                <a href="/settings" className="text-sm hover:text-white transition-colors">
                  Paramètres
                </a>
              </li>
              <li>
                <a href="/debug" className="text-sm hover:text-white transition-colors">
                  Debug IA
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors flex items-center space-x-1">
                  <span>Documentation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors flex items-center space-x-1">
                  <span>API</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Talan</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>formation@talan.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+33 1 44 15 00 00</span>
              </div>
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                <div>
                  <p>9 rue de l'Amiral Hamelin</p>
                  <p>75116 Paris, France</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white bg-transparent"
            >
              Nous contacter
            </Button>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
            <p>&copy; {currentYear} Talan. Tous droits réservés.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                Mentions légales
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="hover:text-white transition-colors">
                RGPD
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span>Propulsé par</span>
            <span className="font-semibold text-blue-400">IA Multi-Agents</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </footer>
  )
}
