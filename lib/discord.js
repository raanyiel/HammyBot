// Helper functions for Discord API interactions
import { verifyKey } from "discord-interactions"

// Verify that the request is coming from Discord
export async function verifyDiscordRequest(request) {
  const signature = request.headers.get("x-signature-ed25519")
  const timestamp = request.headers.get("x-signature-timestamp")

  if (!signature || !timestamp) {
    console.error("Missing signature or timestamp headers")
    return { isValid: false, body: null }
  }

  let body
  try {
    body = await request.text()
    console.log("Request body:", body)
  } catch (error) {
    console.error("Error reading request body:", error)
    return { isValid: false, body: null }
  }

  try {
    const isValidRequest = verifyKey(body, signature, timestamp, process.env.DISCORD_PUBLIC_KEY)

    if (!isValidRequest) {
      console.error("Invalid request signature")
      console.error("Public key used:", process.env.DISCORD_PUBLIC_KEY)
      return { isValid: false, body: null }
    }

    return { isValid: true, body: JSON.parse(body) }
  } catch (error) {
    console.error("Error verifying request:", error)
    return { isValid: false, body: null }
  }
}

// Register slash commands with Discord
export async function registerCommands(commands) {
  const url = `https://discord.com/api/v10/applications/${process.env.DISCORD_CLIENT_ID}/commands`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
    method: "PUT",
    body: JSON.stringify(commands),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Error registering commands: ${text}`)
  }

  return await response.json()
}

// Make requests to Discord API
export async function discordRequest(endpoint, options) {
  const url = `https://discord.com/api/v10/${endpoint}`

  console.log(`Making Discord API request to: ${url}`)
  console.log("Request options:", JSON.stringify(options, null, 2))

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      ...options,
    })

    console.log(`Discord API response status: ${res.status}`)

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      console.error("Discord API error response:", data)
      throw new Error(JSON.stringify(data || { status: res.status, statusText: res.statusText }))
    }

    return res
  } catch (error) {
    console.error("Error making Discord API request:", error)
    throw error
  }
}

