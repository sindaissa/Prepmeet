import { type NextRequest, NextResponse } from "next/server"
import { AIAgentService } from "@/lib/ai-agents"
import { ClientService } from "@/lib/clients"
import { getAuthenticatedUser } from "@/lib/auth" // Importez la fonction d'authentification

/**
 * Gère les requêtes POST pour la génération de réponses IA.
 * Cette route API est responsable de :
 * 1. L'authentification de l'utilisateur.
 * 2. La validation des données d'entrée.
 * 3. La récupération des informations du client.
 * 4. La sélection et l'appel de l'agent IA approprié.
 * 5. Le renvoi de la réponse IA au client.
 * @param {NextRequest} request - L'objet requête Next.js.
 * @returns {Promise<NextResponse>} La réponse HTTP contenant la réponse IA ou une erreur.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authentification de l'utilisateur
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 })
    }

    // 2. Validation des données d'entrée
    const body = await request.json()
    const { clientId, meetingType, message, conversationHistory = [], agentType } = body

    if (!clientId || !meetingType || !message) {
      return NextResponse.json(
        {
          error: "Client, type de réunion et message sont requis dans le corps de la requête.",
        },
        { status: 400 },
      )
    }

    // 3. Récupération des informations du client
    const client = await ClientService.getClientById(clientId)
    if (!client) {
      return NextResponse.json({ error: "Client non trouvé." }, { status: 404 })
    }

    // 4. Sélection et appel de l'agent IA approprié
    // La fonction `generateResponse` dans `AIAgentService` gère la logique de sélection
    // de l'agent (ou utilise un agent forcé si `agentType` est spécifié).
    const aiResponse = await AIAgentService.generateResponse(
      client,
      meetingType,
      message,
      conversationHistory,
      agentType, // Peut être "auto" ou un type d'agent spécifique
    )

    // 5. Renvoi de la réponse IA au client
    return NextResponse.json({
      success: true,
      response: aiResponse.content,
      metadata: {
        confidence: aiResponse.confidence,
        processingTime: aiResponse.processingTime,
        agentType: aiResponse.agentType,
        ...aiResponse.metadata, // Inclut toutes les métadonnées supplémentaires de l'agent
      },
    })
  } catch (error) {
    console.error("Erreur API AI generate:", error)
    // Gérer les erreurs de manière plus spécifique si nécessaire
    return NextResponse.json({ error: "Erreur interne du serveur lors de la génération IA." }, { status: 500 })
  }
}
