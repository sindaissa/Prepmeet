import { type NextRequest, NextResponse } from "next/server"
import { getDb, type User } from "@/lib/db"
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation basique des entrées
    if (!email || !password) {
      return NextResponse.json({ message: "Email et mot de passe sont requis." }, { status: 400 })
    }

    const db = await getDb()
    const usersCollection = db.collection<User>("users")

    // Trouver l'utilisateur par email
    const user = await usersCollection.findOne({ email })

    if (!user || !user.password) {
      return NextResponse.json({ message: "Email ou mot de passe invalide." }, { status: 401 })
    }

    // Vérifier le mot de passe
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ message: "Email ou mot de passe invalide." }, { status: 401 })
    }

    // Mettre à jour la date de dernière connexion
    await usersCollection.updateOne({ _id: user._id }, { $set: { last_login: new Date() } })

    // Créer une session
    const ipAddress = request.ip || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    const session = await createSession(user._id!.toHexString(), ipAddress, userAgent)

    const response = NextResponse.json(
      {
        message: "Connexion réussie.",
        user: {
          id: user._id!.toHexString(),
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          position: user.position,
        },
      },
      { status: 200 },
    )

    // Définir le cookie de session
    setSessionCookie(response, session.session_token, session.expires_at)

    return response
  } catch (error) {
    console.error("Erreur lors de la connexion de l'utilisateur:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}
