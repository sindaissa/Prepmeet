// /app/api/assistant/route.ts
import { NextRequest, NextResponse } from "next/server"
import { AIAgentService } from "@/lib/ai-agents"
import { getClientById } from "@/lib/db" // à adapter selon ton backend

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userMessage, clientId, meetingType, conversationHistory } = body

    const client = await getClientById(clientId)
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 })

    const response = await AIAgentService.generateResponse(
      client,
      meetingType,
      userMessage,
      conversationHistory
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
