import { getDb, type Client, ObjectId } from "@/lib/db"

export class ClientService {
  /**
   * Récupère tous les clients de la base de données.
   * @returns {Promise<Client[]>} Une liste de tous les clients.
   */
  static async getAllClients(): Promise<Client[]> {
    const db = await getDb()
    const clientsCollection = db.collection<Client>("clients")
    const clients = await clientsCollection.find({}).toArray()
    // Convertir ObjectId en string pour l'ID si nécessaire pour la compatibilité front-end
    return clients.map((client) => ({ ...client, id: client._id?.toHexString() }))
  }

  /**
   * Récupère un client par son ID.
   * @param {string} id L'ID du client.
   * @returns {Promise<Client | null>} Le client trouvé ou null.
   */
  static async getClientById(id: string): Promise<Client | null> {
    const db = await getDb()
    const clientsCollection = db.collection<Client>("clients")
    try {
      const client = await clientsCollection.findOne({ _id: new ObjectId(id) })
      if (client) {
        // Convertir ObjectId en string pour l'ID
        return { ...client, id: client._id?.toHexString() }
      }
      return null
    } catch (error) {
      console.error("Error fetching client by ID:", error)
      return null
    }
  }

  /**
   * Crée un nouveau client dans la base de données.
   * @param {Omit<Client, '_id' | 'id' | 'created_at' | 'updated_at'>} clientData Les données du nouveau client.
   * @returns {Promise<Client>} Le client créé.
   */
  static async createClient(clientData: Omit<Client, "_id" | "id" | "created_at" | "updated_at">): Promise<Client> {
    const db = await getDb()
    const clientsCollection = db.collection<Client>("clients")
    const newClient: Client = {
      ...clientData,
      created_at: new Date(),
      updated_at: new Date(),
    }
    const result = await clientsCollection.insertOne(newClient)
    return { ...newClient, _id: result.insertedId, id: result.insertedId.toHexString() }
  }

  /**
   * Met à jour un client existant.
   * @param {string} id L'ID du client à mettre à jour.
   * @param {Partial<Omit<Client, '_id' | 'id' | 'created_at'>>} updateData Les données à mettre à jour.
   * @returns {Promise<Client | null>} Le client mis à jour ou null si non trouvé.
   */
  static async updateClient(
    id: string,
    updateData: Partial<Omit<Client, "_id" | "id" | "created_at">>,
  ): Promise<Client | null> {
    const db = await getDb()
    const clientsCollection = db.collection<Client>("clients")
    const result = await clientsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updated_at: new Date() } },
      { returnDocument: "after" }, // Retourne le document après la mise à jour
    )
    if (result.value) {
      return { ...result.value, id: result.value._id?.toHexString() }
    }
    return null
  }

  /**
   * Supprime un client par son ID.
   * @param {string} id L'ID du client à supprimer.
   * @returns {Promise<boolean>} Vrai si le client a été supprimé, faux sinon.
   */
  static async deleteClient(id: string): Promise<boolean> {
    const db = await getDb()
    const clientsCollection = db.collection<Client>("clients")
    const result = await clientsCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  }
}
