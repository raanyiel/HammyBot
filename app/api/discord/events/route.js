import { NextResponse } from "next/server"
import { verifyDiscordRequest } from "../../../../lib/discord/verifyRequest"
import { startVoiceSession, endVoiceSession, recordMediaSubmission } from "../../../../lib/discord/commands"

export async function POST(req) {
  try {
    console.log("Received Discord event")

    // Clone the request for verification
    const reqClone = req.clone()

    // Verify the request is from Discord
    const { isValid, body } = await verifyDiscordRequest(reqClone)

    console.log("Request validation:", isValid ? "valid" : "invalid")

    if (!isValid) {
      console.log("Invalid request signature")
      return NextResponse.json({ error: "Invalid request" }, { status: 401 })
    }

    // Handle different event types
    const { t: eventType, d: eventData } = body

    console.log("Event type:", eventType)

    // Handle voice state updates for XP
    if (eventType === "VOICE_STATE_UPDATE") {
      await handleVoiceStateUpdate(eventData)
    }

    // Handle message creation for media XP
    if (eventType === "MESSAGE_CREATE") {
      await handleMessageCreate(eventData)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing Discord event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleVoiceStateUpdate(data) {
  try {
    const { guild_id: guildId, user_id: userId, channel_id: channelId } = data

    if (!guildId || !userId) {
      return
    }

    // User joined a voice channel
    if (channelId) {
      console.log(`User ${userId} joined voice channel ${channelId} in guild ${guildId}`)
      await startVoiceSession(guildId, userId, channelId)
    }
    // User left a voice channel
    else {
      console.log(`User ${userId} left voice channel in guild ${guildId}`)
      // We don't have the previous channel ID in this case, so we'll end all active sessions
      const previousChannelId = data.channel_id || "unknown"
      await endVoiceSession(guildId, userId, previousChannelId)
    }
  } catch (error) {
    console.error("Error handling voice state update:", error)
  }
}

async function handleMessageCreate(data) {
  try {
    const { guild_id: guildId, author, channel_id: channelId, id: messageId, attachments } = data

    // Ignore bot messages
    if (author.bot || !guildId) {
      return
    }

    // Check if message has attachments (media)
    if (attachments && attachments.length > 0) {
      console.log(`User ${author.id} posted media in channel ${channelId} in guild ${guildId}`)

      // Determine media type from first attachment
      const attachment = attachments[0]
      let mediaType = "unknown"

      if (attachment.content_type) {
        if (attachment.content_type.startsWith("image/")) {
          mediaType = "image"
        } else if (attachment.content_type.startsWith("video/")) {
          mediaType = "video"
        } else if (attachment.content_type.startsWith("audio/")) {
          mediaType = "audio"
        }
      }

      // Record the media submission
      await recordMediaSubmission(guildId, author.id, channelId, messageId, mediaType)
    }
  } catch (error) {
    console.error("Error handling message create:", error)
  }
}
