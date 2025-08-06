import { type NextRequest, NextResponse } from "next/server"
import { deleteSession, clearSessionCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_token")?.value

    if (sessionToken) {
      await deleteSession(sessionToken)
    }

    const response = NextResponse.json({ message: "Déconnexion réussie." }, { status: 200 })
    clearSessionCookie(response) // Supprime le cookie de session

    return response
  } catch (error) {
    console.error("Erreur lors de la déconnexion de l'utilisateur:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}
