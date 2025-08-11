import { MongoClient, type Db, ObjectId } from "mongodb"
import dotenv from 'dotenv'

// Charger les variables d'environnement à partir du fichier .env
dotenv.config()

// Assurez-vous que la variable d'environnement MONGODB_URI est définie
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Utilisation d'une approche singleton pour la connexion à la base de données
// Cela garantit qu'une seule instance de MongoClient est créée et réutilisée
if (process.env.NODE_ENV === "development") {
  // En mode développement, utilisez une variable globale pour préserver le client
  // entre les rechargements à chaud (hot-reloads)
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // En mode production, il est préférable de ne pas utiliser de variable globale
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

/**
 * Récupère l'instance de la base de données MongoDB.
 * @returns {Promise<Db>} L'instance de la base de données.
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise
  // Remplacez 'simuclient_db' par le nom de votre base de données MongoDB
  return client.db("simuclient_db")
}

// Définitions des interfaces pour les documents MongoDB
// Notez l'utilisation de `_id: ObjectId` pour l'identifiant unique de MongoDB
export interface User {
  _id?: ObjectId // MongoDB utilise _id par défaut
  id?: string // Pour la compatibilité si vous utilisez des IDs string ailleurs
  email: string
  password?: string // Le mot de passe hashé, optionnel pour les retours API
  name: string
  role: string
  department: string
  position: string
  created_at: Date
  updated_at: Date
  last_login: Date | null
  is_active: boolean
}

export interface Client {
  _id?: ObjectId
  id?: string
  name: string
  company: string
  sector: string
  position: string
  personality_type: string
  communication_style: string
  decision_making_style: string
  pain_points: string[]
  goals: string[]
  background: string
  avatar_url: string
  created_at: Date
  updated_at: Date
}

export interface Simulation {
  _id?: ObjectId
  id?: string
  user_id: ObjectId // Référence à l'ID de l'utilisateur
  client_id: ObjectId // Référence à l'ID du client
  meeting_type: string
  status: "pending" | "active" | "completed" | "cancelled"
  started_at: Date | null
  completed_at: Date | null
  duration_minutes: number | null
  confidence_score: number | null
  performance_metrics: any
  feedback: string | null
  created_at: Date
  updated_at: Date
}

export interface SimulationMessage {
  _id?: ObjectId
  id?: string
  simulation_id: ObjectId // Référence à l'ID de la simulation
  sender: "user" | "client"
  content: string
  message_type: "text" | "objection" | "question" | "emotion"
  timestamp: Date
  metadata: any
}

export interface UserSession {
  _id?: ObjectId
  id?: string
  user_id: ObjectId // Référence à l'ID de l'utilisateur
  session_token: string
  expires_at: Date
  created_at: Date
  ip_address: string
  user_agent: string
}

// Exportez ObjectId pour faciliter son utilisation dans d'autres fichiers
export { ObjectId }
