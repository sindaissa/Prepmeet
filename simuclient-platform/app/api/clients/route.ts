import { type NextRequest, NextResponse } from "next/server"
import { ClientService } from "@/lib/clients"
import { protectApiRoute } from "@/lib/auth"

export async function GET(request: NextRequest) {
  // Protège la route : seul un utilisateur authentifié peut y accéder
  const authResponse = await protectApiRoute(request)
  if (authResponse) return authResponse

  try {
    const clients = await ClientService.getAllClients()
    return NextResponse.json({ success: true, data: clients }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Protège la route
  const authResponse = await protectApiRoute(request)
  if (authResponse) return authResponse

  try {
    const clientData = await request.json()
    // Validation basique des données du client
    if (!clientData.name || !clientData.sector || !clientData.company) {
      return NextResponse.json({ message: "Nom, secteur et entreprise sont requis." }, { status: 400 })
    }

    const newClient = await ClientService.createClient(clientData)
    return NextResponse.json({ success: true, data: newClient }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du client:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}
