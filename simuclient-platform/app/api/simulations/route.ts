import { type NextRequest, NextResponse } from "next/server"
import { SimulationService } from "@/lib/simulations"
import { protectApiRoute } from "@/lib/auth"

export async function GET(request: NextRequest) {
  // Protège la route
  const authResponse = await protectApiRoute(request)
  if (authResponse) return authResponse

  try {
    const userId = request.headers.get("x-user-id")! // Assuré par protectApiRoute
    const simulations = await SimulationService.getSimulationsByUserId(userId)
    return NextResponse.json({ success: true, data: simulations }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la récupération des simulations:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Protège la route
  const authResponse = await protectApiRoute(request)
  if (authResponse) return authResponse

  try {
    const userId = request.headers.get("x-user-id")! // Assuré par protectApiRoute
    const { clientId, meetingType } = await request.json()

    if (!clientId || !meetingType) {
      return NextResponse.json({ message: "Client ID et type de réunion sont requis." }, { status: 400 })
    }

    const newSimulation = await SimulationService.createSimulation(userId, clientId, meetingType)
    return NextResponse.json({ success: true, data: newSimulation }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la simulation:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}
