import { verifyKey } from "discord-interactions"

// Simple in-memory storage for logging channels
// In a production environment, you would use a database
const loggingChannels = new Map()

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

// Set the logging channel for a guild
export function setLoggingChannel(guildId, channelId) {
  loggingChannels.set(guildId, channelId)
  return true
}

// Disable logging for a guild
export function disableLogging(guildId) {
  return loggingChannels.delete(guildId)
}

// Get the logging channel for a guild
export function getLoggingChannel(guildId) {
  return loggingChannels.get(guildId)
}

// Send a log message to the logging channel
export async function sendLogMessage(guildId, embed) {
  const loggingChannelId = getLoggingChannel(guildId)

  if (!loggingChannelId) {
    return false // Logging not enabled for this guild
  }

  try {
    await discordRequest(`channels/${loggingChannelId}/messages`, {
      method: "POST",
      body: JSON.stringify({
        embeds: [embed],
      }),
    })
    return true
  } catch (error) {
    console.error("Error sending log message:", error)
    return false
  }
}

// Create a log embed for moderation actions
export function createLogEmbed(action, moderator, user, reason, details = {}) {
  // Set color based on action type
  let color
  switch (action.toLowerCase()) {
    case "ban":
      color = 0xed4245 // Red
      break
    case "kick":
      color = 0xfee75c // Yellow
      break
    case "warn":
      color = 0xf8a532 // Orange
      break
    case "purge":
      color = 0x5865f2 // Blurple
      break
    case "role add":
      color = 0x57f287 // Green
      break
    case "role remove":
      color = 0xeb459e // Pink
      break
    default:
      color = 0x95a5a6 // Grey
  }

  // Create the embed
  const embed = {
    title: `${action.toUpperCase()} | Moderation Action`,
    color: color,
    timestamp: new Date().toISOString(),
    footer: {
      text: `ID: ${user?.id || "N/A"}`,
    },
    fields: [],
  }

  // Add fields based on available information
  if (moderator) {
    embed.fields.push({
      name: "Moderator",
      value: `<@${moderator.id}> (${moderator.username})`,
      inline: true,
    })
  }

  if (user) {
    embed.fields.push({
      name: "User",
      value: `<@${user.id}> (${user.username})`,
      inline: true,
    })
  }

  if (reason) {
    embed.fields.push({
      name: "Reason",
      value: reason,
      inline: false,
    })
  }

  // Add any additional details
  for (const [key, value] of Object.entries(details)) {
    if (value) {
      embed.fields.push({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: String(value),
        inline: true,
      })
    }
  }

  return embed
}

