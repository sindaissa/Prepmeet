import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Client } from "./db"

/**
 * Interface pour la réponse générée par l'IA.
 * @property {string} content - Le contenu textuel de la réponse.
 * @property {number} confidence - Un score de confiance pour la réponse (0.0 à 1.0).
 * @property {number} processingTime - Le temps de traitement de la requête en millisecondes.
 * @property {string} agentType - Le type d'agent IA qui a généré la réponse (ex: "discovery", "objection").
 * @property {any} metadata - Des métadonnées supplémentaires sur la réponse.
 */
export interface AIResponse {
  content: string
  confidence: number
  processingTime: number
  agentType: string
  metadata: any
}

/**
 * Service pour interagir avec les différents agents IA.
 * Chaque méthode représente un agent spécialisé avec son propre prompt système.
 */
export class AIAgentService {
  /**
   * Agent de découverte : Génère une réponse axée sur l'exploration des besoins du client.
   * @param {Client} client - Les informations sur le client simulé.
   * @param {string} meetingType - Le type de réunion (ex: "Première rencontre", "Négociation").
   * @param {string} userMessage - Le message actuel du consultant (utilisateur).
   * @param {any[]} conversationHistory - L'historique complet de la conversation.
   * @returns {Promise<AIResponse>} La réponse générée par l'agent de découverte.
   */
  static async generateDiscoveryResponse(
    client: Client,
    meetingType: string,
    userMessage: string,
    conversationHistory: any[],
  ): Promise<AIResponse> {
    const startTime = Date.now()

    try {
      // Le prompt système définit le rôle et le comportement de l'IA en tant que client.
      // Il inclut des informations détaillées sur le client pour une simulation réaliste.
      const systemPrompt = `Tu es ${client.name}, ${client.position} chez ${client.company} dans le secteur ${client.sector}.

Personnalité: ${client.personality_type}
Style de communication: ${client.communication_style}
Style de prise de décision: ${client.decision_making_style}
Points de douleur: ${client.pain_points.join(", ")}
Objectifs: ${client.goals.join(", ")}
Contexte: ${client.background}

Type de réunion: ${meetingType}

Tu es en phase de découverte. Pose des questions pertinentes pour comprendre les besoins du consultant. Sois authentique selon ta personnalité et ton secteur d'activité. Reste professionnel mais naturel.`

      // Utilise le modèle OpenAI pour générer du texte basé sur le prompt système et le message de l'utilisateur.
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: userMessage,
      })

      const processingTime = Date.now() - startTime

      return {
        content: text,
        confidence: 0.85, // Score de confiance arbitraire pour cet agent
        processingTime,
        agentType: "discovery",
        metadata: {
          client_id: client.id,
          meeting_type: meetingType,
          conversation_length: conversationHistory.length,
        },
      }
    } catch (error) {
      console.error("Erreur agent découverte:", error)
      return {
        content: "Je rencontre un problème technique. Pouvez-vous répéter votre question ?",
        confidence: 0.1,
        processingTime: Date.now() - startTime,
        agentType: "discovery",
        metadata: { error: true },
      }
    }
  }

  /**
   * Agent d'objections : Génère une réponse qui soulève des préoccupations ou des résistances.
   * @param {Client} client - Les informations sur le client simulé.
   * @param {string} meetingType - Le type de réunion.
   * @param {string} userMessage - Le message actuel du consultant.
   * @param {any[]} conversationHistory - L'historique complet de la conversation.
   * @returns {Promise<AIResponse>} La réponse générée par l'agent d'objections.
   */
  static async generateObjectionResponse(
    client: Client,
    meetingType: string,
    userMessage: string,
    conversationHistory: any[],
  ): Promise<AIResponse> {
    const startTime = Date.now()

    try {
      const systemPrompt = `Tu es ${client.name}, ${client.position} chez ${client.company} dans le secteur ${client.sector}.

Personnalité: ${client.personality_type}
Style de communication: ${client.communication_style}
Style de prise de décision: ${client.decision_making_style}
Points de douleur: ${client.pain_points.join(", ")}
Objectifs: ${client.goals.join(", ")}
Contexte: ${client.background}

Type de réunion: ${meetingType}

Tu es maintenant en mode objection. Soulève des préoccupations légitimes basées sur ton secteur et tes contraintes. Sois challengeant mais constructif. Teste la solution proposée par le consultant.`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: userMessage,
      })

      const processingTime = Date.now() - startTime

      return {
        content: text,
        confidence: 0.8,
        processingTime,
        agentType: "objection",
        metadata: {
          client_id: client.id,
          meeting_type: meetingType,
          conversation_length: conversationHistory.length,
        },
      }
    } catch (error) {
      console.error("Erreur agent objection:", error)
      return {
        content: "J'ai des réserves sur ce point, mais j'ai besoin d'un moment pour formuler ma préoccupation.",
        confidence: 0.1,
        processingTime: Date.now() - startTime,
        agentType: "objection",
        metadata: { error: true },
      }
    }
  }

  /**
   * Agent technique : Génère une réponse avec des questions techniques approfondies.
   * @param {Client} client - Les informations sur le client simulé.
   * @param {string} meetingType - Le type de réunion.
   * @param {string} userMessage - Le message actuel du consultant.
   * @param {any[]} conversationHistory - L'historique complet de la conversation.
   * @returns {Promise<AIResponse>} La réponse générée par l'agent technique.
   */
  static async generateTechnicalResponse(
    client: Client,
    meetingType: string,
    userMessage: string,
    conversationHistory: any[],
  ): Promise<AIResponse> {
    const startTime = Date.now()

    try {
      const systemPrompt = `Tu es ${client.name}, ${client.position} chez ${client.company} dans le secteur ${client.sector}.

Personnalité: ${client.personality_type}
Style de communication: ${client.communication_style}
Style de prise de décision: ${client.decision_making_style}
Points de douleur: ${client.pain_points.join(", ")}
Objectifs: ${client.goals.join(", ")}
Contexte: ${client.background}

Type de réunion: ${meetingType}

Tu es en mode technique. Pose des questions détaillées sur l'implémentation, la sécurité, la scalabilité, l'intégration avec les systèmes existants. Sois précis et exigeant sur les aspects techniques.`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: userMessage,
      })

      const processingTime = Date.now() - startTime

      return {
        content: text,
        confidence: 0.88,
        processingTime,
        agentType: "technical",
        metadata: {
          client_id: client.id,
          meeting_type: meetingType,
          conversation_length: conversationHistory.length,
        },
      }
    } catch (error) {
      console.error("Erreur agent technique:", error)
      return {
        content:
          "J'aimerais approfondir les aspects techniques, mais j'ai besoin d'un moment pour préparer mes questions.",
        confidence: 0.1,
        processingTime: Date.now() - startTime,
        agentType: "technical",
        metadata: { error: true },
      }
    }
  }

  /**
   * Agent émotionnel : Génère une réponse qui exprime des émotions et des réactions humaines.
   * @param {Client} client - Les informations sur le client simulé.
   * @param {string} meetingType - Le type de réunion.
   * @param {string} userMessage - Le message actuel du consultant.
   * @param {any[]} conversationHistory - L'historique complet de la conversation.
   * @returns {Promise<AIResponse>} La réponse générée par l'agent émotionnel.
   */
  static async generateEmotionalResponse(
    client: Client,
    meetingType: string,
    userMessage: string,
    conversationHistory: any[],
  ): Promise<AIResponse> {
    const startTime = Date.now()

    try {
      const systemPrompt = `Tu es ${client.name}, ${client.position} chez ${client.company} dans le secteur ${client.sector}.

Personnalité: ${client.personality_type}
Style de communication: ${client.communication_style}
Style de prise de décision: ${client.decision_making_style}
Points de douleur: ${client.pain_points.join(", ")}
Objectifs: ${client.goals.join(", ")}
Contexte: ${client.background}

Type de réunion: ${meetingType}

Exprime tes émotions et réactions humaines. Montre de l'enthousiasme, des inquiétudes, de la frustration ou de la satisfaction selon le contexte. Sois authentiquement humain dans tes réactions.`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: userMessage,
      })

      const processingTime = Date.now() - startTime

      return {
        content: text,
        confidence: 0.75,
        processingTime,
        agentType: "emotional",
        metadata: {
          client_id: client.id,
          meeting_type: meetingType,
          conversation_length: conversationHistory.length,
        },
      }
    } catch (error) {
      console.error("Erreur agent émotionnel:", error)
      return {
        content: "Je ressens quelque chose par rapport à ce que vous dites, mais j'ai du mal à l'exprimer clairement.",
        confidence: 0.1,
        processingTime: Date.now() - startTime,
        agentType: "emotional",
        metadata: { error: true },
      }
    }
  }

  /**
   * Sélectionne l'agent IA le plus approprié en fonction de l'historique de la conversation
   * et du type de réunion. Cette logique peut être affinée pour être plus sophistiquée.
   * @param {any[]} conversationHistory - L'historique des messages de la simulation.
   * @param {string} meetingType - Le type de réunion.
   * @returns {string} Le type d'agent sélectionné ("discovery", "objection", "technical", "emotional").
   */
  static selectAgent(conversationHistory: any[], meetingType: string): string {
    const messageCount = conversationHistory.length

    // Logique de sélection d'agent basée sur la progression de la conversation
    // Ceci est un exemple simple, vous pouvez le rendre plus complexe avec des règles ou un autre modèle IA.
    if (messageCount < 3) {
      return "discovery" // Au début, on est en phase de découverte
    } else if (messageCount < 6) {
      // Après quelques messages, on peut introduire des aspects techniques
      return Math.random() > 0.5 ? "discovery" : "technical"
    } else if (messageCount < 10) {
      // Plus tard, des objections peuvent apparaître
      return Math.random() > 0.3 ? "objection" : "technical"
    } else {
      // En fin de conversation, tous les types d'agents peuvent être pertinents
      const agents = ["objection", "technical", "emotional"]
      return agents[Math.floor(Math.random() * agents.length)]
    }
  }

  /**
   * Génère une réponse IA en sélectionnant dynamiquement l'agent approprié.
   * @param {Client} client - Les informations sur le client simulé.
   * @param {string} meetingType - Le type de réunion.
   * @param {string} userMessage - Le message actuel du consultant.
   * @param {any[]} conversationHistory - L'historique complet de la conversation.
   * @param {string} [forceAgent] - Optionnel: force l'utilisation d'un agent spécifique.
   * @returns {Promise<AIResponse>} La réponse générée par l'IA.
   */
  static async generateResponse(
    client: Client,
    meetingType: string,
    userMessage: string,
    conversationHistory: any[],
    forceAgent?: string,
  ): Promise<AIResponse> {
    // Détermine le type d'agent à utiliser (forcé ou sélectionné dynamiquement)
    const agentType = forceAgent || this.selectAgent(conversationHistory, meetingType)

    // Appelle la méthode de génération de réponse de l'agent correspondant
    switch (agentType) {
      case "discovery":
        return this.generateDiscoveryResponse(client, meetingType, userMessage, conversationHistory)
      case "objection":
        return this.generateObjectionResponse(client, meetingType, userMessage, conversationHistory)
      case "technical":
        return this.generateTechnicalResponse(client, meetingType, userMessage, conversationHistory)
      case "emotional":
        return this.generateEmotionalResponse(client, meetingType, userMessage, conversationHistory)
      // Fallback si le type d'agent n'est pas reconnu
      default:
        console.warn(`Agent type "${agentType}" not recognized, falling back to discovery agent.`)
        return this.generateDiscoveryResponse(client, meetingType, userMessage, conversationHistory)
    }
  }
}
