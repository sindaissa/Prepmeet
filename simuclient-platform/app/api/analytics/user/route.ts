import { type NextRequest, NextResponse } from "next/server"
import { getDb, type Simulation } from "@/lib/db"
import { protectApiRoute } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  // Protège la route
  const authResponse = await protectApiRoute(request)
  if (authResponse) return authResponse

  try {
    const userId = request.headers.get("x-user-id")! // Assuré par protectApiRoute
    const db = await getDb()

    // Nombre total de simulations de l'utilisateur
    const userTotalSimulations = await db
      .collection<Simulation>("simulations")
      .countDocuments({ user_id: new ObjectId(userId) })

    // Simulations complétées par l'utilisateur
    const userCompletedSimulations = await db
      .collection<Simulation>("simulations")
      .countDocuments({ user_id: new ObjectId(userId), status: "completed" })

    // Durée moyenne des simulations complétées par l'utilisateur
    const userAvgDurationResult = await db
      .collection<Simulation>("simulations")
      .aggregate([
        { $match: { user_id: new ObjectId(userId), status: "completed", duration_minutes: { $ne: null } } },
        { $group: { _id: null, avgDuration: { $avg: "$duration_minutes" } } },
      ])
      .toArray()
    const userAvgSimulationDuration = userAvgDurationResult[0]?.avgDuration || 0

    // Score de confiance moyen de l'utilisateur
    const userAvgConfidenceResult = await db
      .collection<Simulation>("simulations")
      .aggregate([
        { $match: { user_id: new ObjectId(userId), status: "completed", confidence_score: { $ne: null } } },
        { $group: { _id: null, avgConfidence: { $avg: "$confidence_score" } } },
      ])
      .toArray()
    const userAvgConfidenceScore = userAvgConfidenceResult[0]?.avgConfidence || 0

    // Dernières simulations de l'utilisateur
    const latestSimulations = await db
      .collection<Simulation>("simulations")
      .find({ user_id: new ObjectId(userId) })
      .sort({ created_at: -1 })
      .limit(5)
      .toArray()
      .then((sims) => sims.map((sim) => ({ ...sim, id: sim._id?.toHexString() })))

    return NextResponse.json(
      {
        success: true,
        data: {
          userTotalSimulations,
          userCompletedSimulations,
          userAvgSimulationDuration: Number.parseFloat(userAvgSimulationDuration.toFixed(2)),
          userAvgConfidenceScore: Number.parseFloat(userAvgConfidenceScore.toFixed(2)),
          latestSimulations,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erreur lors de la récupération des métriques utilisateur:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}
