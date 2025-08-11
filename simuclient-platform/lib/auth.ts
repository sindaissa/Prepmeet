import { getDb, type User, type UserSession, ObjectId } from "@/lib/db"
import { compare, hash } from "bcryptjs"
import { serialize } from "cookie"
import { type NextRequest, NextResponse } from "next/server"

// Clé secrète pour les tokens de session (à stocker dans les variables d'environnement)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"
const SESSION_EXPIRATION_DAYS = 7

/**
 * Hashe un mot de passe.
 * @param {string} password Le mot de passe à hasher.
 * @returns {Promise<string>} Le mot de passe hashé.
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

/**
 * Compare un mot de passe avec son hash.
 * @param {string} password Le mot de passe en clair.
 * @param {string} hashedPassword Le mot de passe hashé.
 * @returns {Promise<boolean>} Vrai si les mots de passe correspondent, faux sinon.
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

/**
 * Crée une nouvelle session utilisateur dans la base de données.
 * @param {string} userId L'ID de l'utilisateur.
 * @param {string} ipAddress L'adresse IP de l'utilisateur.
 * @param {string} userAgent L'agent utilisateur de l'utilisateur.
 * @returns {Promise<UserSession>} La session utilisateur créée.
 */
export async function createSession(userId: string, ipAddress: string, userAgent: string): Promise<UserSession> {
  const db = await getDb()
  const sessionsCollection = db.collection<UserSession>("sessions")

  const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_DAYS * 24 * 60 * 60 * 1000)

  const newSession: UserSession = {
    user_id: new ObjectId(userId),
    session_token: sessionToken,
    expires_at: expiresAt,
    created_at: new Date(),
    ip_address: ipAddress,
    user_agent: userAgent,
  }

  const result = await sessionsCollection.insertOne(newSession)
  return { ...newSession, _id: result.insertedId }
}

/**
 * Récupère une session utilisateur par son token.
 * @param {string} sessionToken Le token de session.
 * @returns {Promise<UserSession | null>} La session utilisateur ou null si non trouvée/expirée.
 */
export async function getSession(sessionToken: string): Promise<UserSession | null> {
  const db = await getDb()
  const sessionsCollection = db.collection<UserSession>("sessions")

  const session = await sessionsCollection.findOne({
    session_token: sessionToken,
    expires_at: { $gt: new Date() }, // Vérifie que la session n'est pas expirée
  })

  return session
}

/**
 * Supprime une session utilisateur.
 * @param {string} sessionToken Le token de session à supprimer.
 */
export async function deleteSession(sessionToken: string): Promise<void> {
  const db = await getDb()
  const sessionsCollection = db.collection<UserSession>("sessions")
  await sessionsCollection.deleteOne({ session_token: sessionToken })
}

/**
 * Récupère l'utilisateur authentifié à partir de la requête.
 * @param {NextRequest} request La requête Next.js.
 * @returns {Promise<User | null>} L'utilisateur authentifié ou null.
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<User | null> {
  const sessionToken = request.cookies.get("session_token")?.value

  if (!sessionToken) {
    return null
  }

  const session = await getSession(sessionToken)

  if (!session) {
    return null
  }

  const db = await getDb()
  const usersCollection = db.collection<User>("users")
  const user = await usersCollection.findOne({ _id: session.user_id })

  return user
}

/**
 * Middleware pour protéger les routes API.
 * @param {NextRequest} request La requête Next.js.
 * @returns {Promise<NextResponse | null>} Une réponse d'erreur si non authentifié, ou null si authentifié.
 */
export async function protectApiRoute(request: NextRequest): Promise<NextResponse | null> {
  const user = await getAuthenticatedUser(request)

  if (!user) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 })
  }

  // Ajoute l'ID de l'utilisateur aux headers pour un accès facile dans les handlers de route
  request.headers.set("x-user-id", user._id!.toHexString())
  return null // L'utilisateur est authentifié, continuez
}

/**
 * Définit le cookie de session dans la réponse.
 * @param {NextResponse} response La réponse Next.js.
 * @param {string} sessionToken Le token de session.
 * @param {Date} expires La date d'expiration du cookie.
 */
export function setSessionCookie(response: NextResponse, sessionToken: string, expires: Date) {
  response.headers.set(
    "Set-Cookie",
    serialize("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expires,
    }),
  )
}

/**
 * Supprime le cookie de session de la réponse.
 * @param {NextResponse} response La réponse Next.js.
 */
export function clearSessionCookie(response: NextResponse) {
  response.headers.set(
    "Set-Cookie",
    serialize("session_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // Expire immédiatement
    }),
  )
}
