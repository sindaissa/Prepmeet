import { getDb, type Simulation, type SimulationMessage, ObjectId } from "@/lib/db"

export class SimulationService {
  /**
   * Crée une nouvelle simulation.
   * @param {string} userId L'ID de l'utilisateur.
   * @param {string} clientId L'ID du client.
   * @param {string} meetingType Le type de réunion.
   * @returns {Promise<Simulation>} La simulation créée.
   */
  static async createSimulation(userId: string, clientId: string, meetingType: string): Promise<Simulation> {
    const db = await getDb()
    const simulationsCollection = db.collection<Simulation>("simulations")

    const newSimulation: Simulation = {
      user_id: new ObjectId(userId),
      client_id: new ObjectId(clientId),
      meeting_type: meetingType,
      status: "pending",
      started_at: null,
      completed_at: null,
      duration_minutes: null,
      confidence_score: null,
      performance_metrics: {},
      feedback: null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await simulationsCollection.insertOne(newSimulation)
    return { ...newSimulation, _id: result.insertedId, id: result.insertedId.toHexString() }
  }

  /**
   * Récupère une simulation par son ID.
   * @param {string} simulationId L'ID de la simulation.
   * @returns {Promise<Simulation | null>} La simulation ou null.
   */
  static async getSimulationById(simulationId: string): Promise<Simulation | null> {
    const db = await getDb()
    const simulationsCollection = db.collection<Simulation>("simulations")
    try {
      const simulation = await simulationsCollection.findOne({ _id: new ObjectId(simulationId) })
      if (simulation) {
        return { ...simulation, id: simulation._id?.toHexString() }
      }
      return null
    } catch (error) {
      console.error("Error fetching simulation by ID:", error)
      return null
    }
  }

  /**
   * Récupère toutes les simulations pour un utilisateur donné.
   * @param {string} userId L'ID de l'utilisateur.
   * @returns {Promise<Simulation[]>} Une liste des simulations de l'utilisateur.
   */
  static async getSimulationsByUserId(userId: string): Promise<Simulation[]> {
    const db = await getDb()
    const simulationsCollection = db.collection<Simulation>("simulations")
    const simulations = await simulationsCollection
      .find({ user_id: new ObjectId(userId) })
      .sort({ created_at: -1 })
      .toArray()
    return simulations.map((sim) => ({ ...sim, id: sim._id?.toHexString() }))
  }

  /**
   * Met à jour le statut d'une simulation à 'active' et enregistre l'heure de début.
   * @param {string} simulationId L'ID de la simulation.
   * @returns {Promise<Simulation | null>} La simulation mise à jour ou null.
   */
  static async startSimulation(simulationId: string): Promise<Simulation | null> {
    const db = await getDb()
    const simulationsCollection = db.collection<Simulation>("simulations")
    const result = await simulationsCollection.findOneAndUpdate(
      { _id: new ObjectId(simulationId) },
      { $set: { status: "active", started_at: new Date(), updated_at: new Date() } },
      { returnDocument: "after" },
    )
    if (result.value) {
      return { ...result.value, id: result.value._id?.toHexString() }
    }
    return null
  }

  /**
   * Met à jour le statut d'une simulation à 'completed' et enregistre l'heure de fin et le feedback.
   * @param {string} simulationId L'ID de la simulation.
   * @param {string} feedback Le feedback de la simulation.
   * @param {number} confidenceScore Le score de confiance final.
   * @returns {Promise<Simulation | null>} La simulation mise à jour ou null.
   */
  static async completeSimulation(
    simulationId: string,
    feedback: string,
    confidenceScore: number,
  ): Promise<Simulation | null> {
    const db = await getDb()
    const simulationsCollection = db.collection<Simulation>("simulations")

    const simulation = await this.getSimulationById(simulationId)
    if (!simulation || !simulation.started_at) {
      return null // La simulation n'existe pas ou n'a pas été démarrée
    }

    const durationMinutes = Math.round((new Date().getTime() - simulation.started_at.getTime()) / (1000 * 60))

    const result = await simulationsCollection.findOneAndUpdate(
      { _id: new ObjectId(simulationId) },
      {
        $set: {
          status: "completed",
          completed_at: new Date(),
          duration_minutes: durationMinutes,
          confidence_score: confidenceScore,
          feedback: feedback,
          updated_at: new Date(),
        },
      },
      { returnDocument: "after" },
    )
    if (result.value) {
      return { ...result.value, id: result.value._id?.toHexString() }
    }
    return null
  }

  /**
   * Ajoute un message à une simulation.
   * @param {string} simulationId L'ID de la simulation.
   * @param {"user" | "client"} sender L'expéditeur du message.
   * @param {string} content Le contenu du message.
   * @param {"text" | "objection" | "question" | "emotion"} messageType Le type de message.
   * @param {any} metadata Les métadonnées du message.
   * @returns {Promise<SimulationMessage>} Le message créé.
   */
  static async addMessageToSimulation(
    simulationId: string,
    sender: "user" | "client",
    content: string,
    messageType: "text" | "objection" | "question" | "emotion",
    metadata: any = {},
  ): Promise<SimulationMessage> {
    const db = await getDb()
    const messagesCollection = db.collection<SimulationMessage>("simulation_messages")

    const newMessage: SimulationMessage = {
      simulation_id: new ObjectId(simulationId),
      sender,
      content,
      message_type: messageType,
      timestamp: new Date(),
      metadata,
    }

    const result = await messagesCollection.insertOne(newMessage)
    return { ...newMessage, _id: result.insertedId, id: result.insertedId.toHexString() }
  }

  /**
   * Récupère tous les messages d'une simulation.
   * @param {string} simulationId L'ID de la simulation.
   * @returns {Promise<SimulationMessage[]>} Une liste des messages de la simulation.
   */
  static async getSimulationMessages(simulationId: string): Promise<SimulationMessage[]> {
    const db = await getDb()
    const messagesCollection = db.collection<SimulationMessage>("simulation_messages")
    const messages = await messagesCollection
      .find({ simulation_id: new ObjectId(simulationId) })
      .sort({ timestamp: 1 })
      .toArray()
    return messages.map((msg) => ({ ...msg, id: msg._id?.toHexString() }))
  }
}
