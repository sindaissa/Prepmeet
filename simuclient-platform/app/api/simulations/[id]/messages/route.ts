import { type NextRequest, NextResponse } from "next/server"
import { SimulationService } from "@/lib/simulations"
import { protectApiRoute } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Protège la route
  const authResponse = await protectApiRoute(request)
  if (authResponse) return authResponse

  try {
    const { id } = params
    const messages = await SimulationService.getSimulationMessages(id)
    return NextResponse.json({ success: true, data: messages }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la récupération des messages de simulation:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // Protège la route
  const authResponse = await protectApiRoute(request)
  if (authResponse) return authResponse

  try {
    const { id } = params
    const { sender, content, messageType, metadata } = await request.json()

    if (!sender || !content || !messageType) {
      return NextResponse.json({ message: "Expéditeur, contenu et type de message sont requis." }, { status: 400 })
    }

    const newMessage = await SimulationService.addMessageToSimulation(id, sender, content, messageType, metadata)
    return NextResponse.json({ success: true, data: newMessage }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de l'ajout du message à la simulation:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}
