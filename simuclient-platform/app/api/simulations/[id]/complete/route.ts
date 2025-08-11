import { type NextRequest, NextResponse } from "next/server"
import { SimulationService } from "@/lib/simulations"
import { protectApiRoute } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // Protège la route
  const authResponse = await protectApiRoute(request)
  if (authResponse) return authResponse

  try {
    const { id } = params
    const { feedback, confidenceScore } = await request.json()

    if (typeof feedback !== "string" || typeof confidenceScore !== "number") {
      return NextResponse.json({ message: "Feedback et confidenceScore sont requis." }, { status: 400 })
    }

    const simulation = await SimulationService.completeSimulation(id, feedback, confidenceScore)

    if (!simulation) {
      return NextResponse.json({ message: "Simulation non trouvée ou non démarrée." }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: simulation }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la finalisation de la simulation:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}
