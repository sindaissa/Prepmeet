import { type NextRequest, NextResponse } from "next/server"
import { getDb, type User } from "@/lib/db"
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, department, position } = await request.json()

    // Validation basique des entrées
    if (!name || !email || !password || !department || !position) {
      return NextResponse.json({ message: "Tous les champs sont requis." }, { status: 400 })
    }

    const db = await getDb()
    const usersCollection = db.collection<User>("users")

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "Cet email est déjà enregistré." }, { status: 409 })
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password)

    // Créer le nouvel utilisateur
    const newUser: User = {
      name,
      email,
      password: hashedPassword,
      department,
      position,
      role: "user", // Rôle par défaut
      created_at: new Date(),
      updated_at: new Date(),
      last_login: null,
      is_active: true,
    }

    const result = await usersCollection.insertOne(newUser)
    const createdUser = { ...newUser, _id: result.insertedId, id: result.insertedId.toHexString() }

    // Créer une session pour le nouvel utilisateur
    const ipAddress = request.ip || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    const session = await createSession(createdUser._id!.toHexString(), ipAddress, userAgent)

    const response = NextResponse.json(
      {
        message: "Compte créé avec succès.",
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          department: createdUser.department,
          position: createdUser.position,
        },
      },
      { status: 201 },
    )

    // Définir le cookie de session
    setSessionCookie(response, session.session_token, session.expires_at)

    return response
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur:", error)
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 })
  }
}
