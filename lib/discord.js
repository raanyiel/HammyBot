// Helper functions for Discord API interactions
import { verifyKey } from "discord-interactions"

// Verify that the request is coming from Discord
export async function verifyDiscordRequest(request) {
  const signature = request.headers.get("x-signature-ed25519")
  const timestamp = request.headers.get("x-signature-timestamp")
  const body = await request.text()

  const isValidRequest = verifyKey(body, signature, timestamp, process.env.DISCORD_PUBLIC_KEY)

  if (!isValidRequest) {
    return { isValid: false, body: null }
  }

  return { isValid: true, body: JSON.parse(body) }
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

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    ...options,
  })

  if (!res.ok) {
    const data = await res.json()
    console.error(data)
    throw new Error(JSON.stringify(data))
  }

  return res
}

