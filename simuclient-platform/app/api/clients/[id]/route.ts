import { type NextRequest, NextResponse } from "next/server"
import { ClientService } from "@/lib/clients"
import { protectApiRoute } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Protège la route
  const authResponse = await protectApiRoute(request)
  if (authResponse) return authResponse

  try {
    const { id } = params
    const client = await ClientService.getClientById(id)

    if (!client) {
      return NextResponse.json({ message: "Client non trouvé." }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: client }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la récupération du client par ID:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Protège la route
  const authResponse = await protectApiRoute(request)
  if (authResponse) return authResponse

  try {
    const { id } = params
    const updateData = await request.json()

    const updatedClient = await ClientService.updateClient(id, updateData)

    if (!updatedClient) {
      return NextResponse.json({ message: "Client non trouvé ou mise à jour échouée." }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedClient }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Protège la route
  const authResponse = await protectApiRoute(request)
  if (authResponse) return authResponse

  try {
    const { id } = params
    const deleted = await ClientService.deleteClient(id)

    if (!deleted) {
      return NextResponse.json({ message: "Client non trouvé ou suppression échouée." }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Client supprimé avec succès." }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la suppression du client:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}
