import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ message: "Non authentifié." }, { status: 401 })
    }

    // Retourne les informations de l'utilisateur (sans le mot de passe)
    return NextResponse.json(
      {
        id: user._id!.toHexString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
        created_at: user.created_at,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erreur lors de la récupération des informations utilisateur:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}
