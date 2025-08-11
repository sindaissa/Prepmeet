import { type NextRequest, NextResponse } from "next/server"
import { getDb, type User, type Simulation } from "@/lib/db"
import { protectApiRoute } from "@/lib/auth"

export async function GET(request: NextRequest) {
  // Protège la route
  const authResponse = await protectApiRoute(request)
  if (authResponse) return authResponse

  try {
    const db = await getDb()

    // Nombre total d'utilisateurs
    const totalUsers = await db.collection<User>("users").countDocuments()

    // Nombre total de simulations
    const totalSimulations = await db.collection<Simulation>("simulations").countDocuments()

    // Simulations complétées
    const completedSimulations = await db.collection<Simulation>("simulations").countDocuments({ status: "completed" })

    // Durée moyenne des simulations complétées
    const avgDurationResult = await db
      .collection<Simulation>("simulations")
      .aggregate([
        { $match: { status: "completed", duration_minutes: { $ne: null } } },
        { $group: { _id: null, avgDuration: { $avg: "$duration_minutes" } } },
      ])
      .toArray()
    const avgSimulationDuration = avgDurationResult[0]?.avgDuration || 0

    // Score de confiance moyen
    const avgConfidenceResult = await db
      .collection<Simulation>("simulations")
      .aggregate([
        { $match: { status: "completed", confidence_score: { $ne: null } } },
        { $group: { _id: null, avgConfidence: { $avg: "$confidence_score" } } },
      ])
      .toArray()
    const avgConfidenceScore = avgConfidenceResult[0]?.avgConfidence || 0

    return NextResponse.json(
      {
        success: true,
        data: {
          totalUsers,
          totalSimulations,
          completedSimulations,
          avgSimulationDuration: Number.parseFloat(avgSimulationDuration.toFixed(2)),
          avgConfidenceScore: Number.parseFloat(avgConfidenceScore.toFixed(2)),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erreur lors de la récupération des métriques de la plateforme:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}
