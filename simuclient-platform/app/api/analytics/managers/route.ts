import { type NextRequest, NextResponse } from "next/server"
import { getDb, type User, type Simulation } from "@/lib/db"
import { protectApiRoute } from "@/lib/auth"

export async function GET(request: NextRequest) {
  // Protège la route
  const authResponse = await protectApiRoute(request)
  if (authResponse) return authResponse

  const authenticatedUser = await protectApiRoute(request)
  if (!authenticatedUser || authenticatedUser.status !== 200) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 403 })
  }

  // Vérifier si l'utilisateur a le rôle "manager" ou "admin"
  const userRole = request.headers.get("x-user-role") // Assurez-vous que le rôle est ajouté par protectApiRoute ou récupéré ici
  if (userRole !== "manager" && userRole !== "admin") {
    return NextResponse.json({ message: "Accès refusé. Rôle insuffisant." }, { status: 403 })
  }

  try {
    const db = await getDb()

    // Récupérer tous les utilisateurs (consultants)
    const consultants = await db
      .collection<User>("users")
      .find({ role: "user" })
      .project({ password: 0 }) // Exclure le mot de passe
      .toArray()
      .then((users) => users.map((user) => ({ ...user, id: user._id?.toHexString() })))

    const managerAnalytics = []

    for (const consultant of consultants) {
      const userId = consultant._id!

      // Nombre total de simulations du consultant
      const totalSimulations = await db.collection<Simulation>("simulations").countDocuments({ user_id: userId })

      // Simulations complétées par le consultant
      const completedSimulations = await db
        .collection<Simulation>("simulations")
        .countDocuments({ user_id: userId, status: "completed" })

      // Durée moyenne des simulations complétées par le consultant
      const avgDurationResult = await db
        .collection<Simulation>("simulations")
        .aggregate([
          { $match: { user_id: userId, status: "completed", duration_minutes: { $ne: null } } },
          { $group: { _id: null, avgDuration: { $avg: "$duration_minutes" } } },
        ])
        .toArray()
      const avgSimulationDuration = avgDurationResult[0]?.avgDuration || 0

      // Score de confiance moyen du consultant
      const avgConfidenceResult = await db
        .collection<Simulation>("simulations")
        .aggregate([
          { $match: { user_id: userId, status: "completed", confidence_score: { $ne: null } } },
          { $group: { _id: null, avgConfidence: { $avg: "$confidence_score" } } },
        ])
        .toArray()
      const avgConfidenceScore = avgConfidenceResult[0]?.avgConfidence || 0

      managerAnalytics.push({
        consultant: {
          id: consultant.id,
          name: consultant.name,
          email: consultant.email,
          department: consultant.department,
          position: consultant.position,
        },
        totalSimulations,
        completedSimulations,
        avgSimulationDuration: Number.parseFloat(avgSimulationDuration.toFixed(2)),
        avgConfidenceScore: Number.parseFloat(avgConfidenceScore.toFixed(2)),
      })
    }

    return NextResponse.json({ success: true, data: managerAnalytics }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la récupération des métriques des managers:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}
