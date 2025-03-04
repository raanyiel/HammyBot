import { verifyKey } from "discord-interactions"

// Verify that the request is coming from Discord
export async function verifyDiscordRequest(request) {
  try {
    const signature = request.headers.get("x-signature-ed25519")
    const timestamp = request.headers.get("x-signature-timestamp")

    if (!signature || !timestamp) {
      console.error("Missing signature or timestamp headers")
      return { isValid: false, body: null }
    }

    const body = await request.text()

    if (!body) {
      console.error("Empty request body")
      return { isValid: false, body: null }
    }

    const isValidRequest = verifyKey(body, signature, timestamp, process.env.DISCORD_PUBLIC_KEY)

    if (!isValidRequest) {
      console.error("Invalid request signature")
      return { isValid: false, body: null }
    }

    let parsedBody
    try {
      parsedBody = JSON.parse(body)
    } catch (error) {
      console.error("Error parsing request body:", error)
      return { isValid: false, body: null }
    }

    return { isValid: true, body: parsedBody }
  } catch (error) {
    console.error("Error in verifyDiscordRequest:", error)
    return { isValid: false, body: null }
  }
}

// Make requests to Discord API
export async function discordRequest(endpoint, options) {
  try {
    const url = `https://discord.com/api/v10/${endpoint}`

    const res = await fetch(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      ...options,
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({ status: res.status }))
      console.error("Discord API error:", data)
      throw new Error(JSON.stringify(data))
    }

    return res
  } catch (error) {
    console.error("Error in discordRequest:", error)
    throw error
  }
}

// Register slash commands with Discord
export async function registerCommands(commands) {
  try {
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
  } catch (error) {
    console.error("Error in registerCommands:", error)
    throw error
  }
}

