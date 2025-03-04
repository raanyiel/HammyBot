import { NextResponse } from "next/server"
import { verifyKey } from "discord-interactions"
import { createClient, handleInteraction } from "../../../../lib/discord"

export async function POST(req) {
  try {
    // Get request body as text
    const bodyText = await req.text()

    // Get Discord signature headers
    const signature = req.headers.get("x-signature-ed25519")
    const timestamp = req.headers.get("x-signature-timestamp")

    // Verify the request
    const isValidRequest = verifyKey(bodyText, signature, timestamp, process.env.DISCORD_PUBLIC_KEY)

    if (!isValidRequest) {
      return NextResponse.json({ error: "Invalid request signature" }, { status: 401 })
    }

    // Parse the request body
    const interaction = JSON.parse(bodyText)

    // Handle Discord ping
    if (interaction.type === 1) {
      return NextResponse.json({ type: 1 })
    }

    // Initialize Discord client
    const client = createClient()

    // Log in to Discord
    await client.login(process.env.DISCORD_BOT_TOKEN)

    // Process the interaction
    const response = await handleInteraction(interaction)

    // Destroy the client to clean up
    client.destroy()

    // Return the response
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error processing interaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

