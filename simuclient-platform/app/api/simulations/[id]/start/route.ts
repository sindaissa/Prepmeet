import { type NextRequest, NextResponse } from "next/server"
import { SimulationService } from "@/lib/simulations"
import { protectApiRoute } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // Protège la route
  const authResponse = await protectApiRoute(request)
  if (authResponse) return authResponse

  try {
    const { id } = params
    const simulation = await SimulationService.startSimulation(id)

    if (!simulation) {
      return NextResponse.json({ message: "Simulation non trouvée ou déjà démarrée." }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: simulation }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors du démarrage de la simulation:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}
