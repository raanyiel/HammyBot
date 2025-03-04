import { NextResponse } from "next/server"
import {
  verifyDiscordRequest,
  discordRequest,
  setLoggingChannel,
  disableLogging,
  getLoggingChannel,
  sendLogMessage,
  createLogEmbed,
} from "../../../../lib/discord"

// Interaction type constants
const PING = 1
const APPLICATION_COMMAND = 2

// Interaction response type constants
const PONG = 1
const CHANNEL_MESSAGE_WITH_SOURCE = 4

export async function POST(req) {
  try {
    console.log("Received Discord interaction")

    // Clone the request for verification
    const reqClone = req.clone()

    // Verify the request is from Discord
    const { isValid, body } = await verifyDiscordRequest(reqClone)

    console.log("Request validation:", isValid ? "valid" : "invalid")

    if (!isValid) {
      console.log("Invalid request signature")
      return NextResponse.json({ error: "Invalid request" }, { status: 401 })
    }

    console.log("Request body type:", body.type)

    // Handle Discord's ping
    if (body.type === PING) {
      console.log("Handling Discord ping")
      return NextResponse.json({ type: PONG })
    }

    // Handle slash commands
    if (body.type === APPLICATION_COMMAND) {
      console.log("Handling slash command:", body.data?.name)

      const { name, options } = body.data || {}
      const guildId = body.guild_id
      const channelId = body.channel_id

      // Get information about the user who executed the command
      const moderator = {
        id: body.member.user.id,
        username: body.member.user.username,
      }

      // Handle logging command
      if (name === "logging") {
        const subCommand = options[0].name

        if (subCommand === "set") {
          const channelOption = options[0].options.find((opt) => opt.name === "channel")
          const loggingChannelId = channelOption.value

          // Check if the channel is a text channel
          try {
            const channelResponse = await discordRequest(`channels/${loggingChannelId}`, {
              method: "GET",
            })

            const channel = await channelResponse.json()

            if (channel.type !== 0) {
              // 0 is text channel
              return NextResponse.json({
                type: CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: "The logging channel must be a text channel." },
              })
            }

            // Set the logging channel
            setLoggingChannel(guildId, loggingChannelId)

            return NextResponse.json({
              type: CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: `Logging has been enabled in <#${loggingChannelId}>!`,
                flags: 64, // Ephemeral flag - only visible to the command user
              },
            })
          } catch (error) {
            console.error("Error setting logging channel:", error)

            return NextResponse.json({
              type: CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: "Failed to set logging channel. Please check bot permissions.",
                flags: 64,
              },
            })
          }
        } else if (subCommand === "disable") {
          // Disable logging
          const wasEnabled = disableLogging(guildId)

          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: wasEnabled ? "Logging has been disabled." : "Logging was not enabled for this server.",
              flags: 64,
            },
          })
        } else if (subCommand === "status") {
          // Check logging status
          const loggingChannelId = getLoggingChannel(guildId)

          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: loggingChannelId
                ? `Logging is currently enabled in <#${loggingChannelId}>.`
                : "Logging is currently disabled for this server.",
              flags: 64,
            },
          })
        }
      }

      // Handle role command
      else if (name === "role" && options && options.length > 0) {
        const subCommand = options[0].name
        const subCommandOptions = options[0].options || []

        const userOption = subCommandOptions.find((opt) => opt.name === "user")
        const roleOption = subCommandOptions.find((opt) => opt.name === "role")

        if (!userOption || !roleOption) {
          console.error("Missing required options")
          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "Missing required user or role option." },
          })
        }

        const userId = userOption.value
        const roleId = roleOption.value

        console.log(`Processing role ${subCommand} command`)
        console.log(`Guild ID: ${guildId}, User ID: ${userId}, Role ID: ${roleId}`)

        try {
          // Get user information for logging
          const userResponse = await discordRequest(`users/${userId}`, {
            method: "GET",
          })

          const user = await userResponse.json()

          // Get role information for logging
          const roleResponse = await discordRequest(`guilds/${guildId}/roles`, {
            method: "GET",
          })

          const roles = await roleResponse.json()
          const role = roles.find((r) => r.id === roleId)

          if (subCommand === "add") {
            // Add role to user
            console.log(`Adding role ${roleId} to user ${userId}`)
            await discordRequest(`guilds/${guildId}/members/${userId}/roles/${roleId}`, {
              method: "PUT",
            })

            // Send log if logging is enabled
            const logEmbed = createLogEmbed("role add", moderator, user, null, {
              Role: role ? `${role.name} (${role.id})` : roleId,
            })

            sendLogMessage(guildId, logEmbed)

            return NextResponse.json({
              type: CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: `Successfully added <@&${roleId}> to <@${userId}>!`,
                allowed_mentions: { parse: [] }, // Prevent role and user pings
              },
            })
          } else if (subCommand === "remove") {
            // Remove role from user
            console.log(`Removing role ${roleId} from user ${userId}`)
            await discordRequest(`guilds/${guildId}/members/${userId}/roles/${roleId}`, {
              method: "DELETE",
            })

            // Send log if logging is enabled
            const logEmbed = createLogEmbed("role remove", moderator, user, null, {
              Role: role ? `${role.name} (${role.id})` : roleId,
            })

            sendLogMessage(guildId, logEmbed)

            return NextResponse.json({
              type: CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: `Successfully removed <@&${roleId}> from <@${userId}>!`,
                allowed_mentions: { parse: [] }, // Prevent role and user pings
              },
            })
          }
        } catch (error) {
          console.error("Error managing roles:", error)

          // Check if it's a permission error
          let errorMessage = "Failed to manage roles. Please check bot permissions."

          if (error.message && error.message.includes("Missing Permissions")) {
            errorMessage =
              "I don't have permission to manage this role. Make sure my role is higher than the role you're trying to manage."
          }

          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: errorMessage },
          })
        }
      }

      // Handle purge command
      else if (name === "purge") {
        const amount = options.find((opt) => opt.name === "amount")?.value

        if (!amount) {
          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "Please specify the number of messages to delete." },
          })
        }

        try {
          // First, get messages from the channel
          const messagesResponse = await discordRequest(`channels/${channelId}/messages?limit=${amount}`, {
            method: "GET",
          })

          const messages = await messagesResponse.json()

          if (messages.length === 0) {
            return NextResponse.json({
              type: CHANNEL_MESSAGE_WITH_SOURCE,
              data: { content: "No messages found to delete." },
            })
          }

          // Get message IDs
          const messageIds = messages.map((msg) => msg.id)

          // Bulk delete messages (for messages less than 14 days old)
          await discordRequest(`channels/${channelId}/messages/bulk-delete`, {
            method: "POST",
            body: JSON.stringify({ messages: messageIds }),
          })

          // Send log if logging is enabled
          const logEmbed = createLogEmbed("purge", moderator, null, null, {
            Channel: `<#${channelId}>`,
            "Messages Deleted": messageIds.length,
            "Oldest Message ID": messageIds[messageIds.length - 1],
            "Newest Message ID": messageIds[0],
          })

          sendLogMessage(guildId, logEmbed)

          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Successfully deleted ${messageIds.length} messages.`,
              flags: 64, // Ephemeral flag - only visible to the command user
            },
          })
        } catch (error) {
          console.error("Error purging messages:", error)

          let errorMessage = "Failed to delete messages. Please check bot permissions."

          // Check for common errors
          if (error.message && error.message.includes("Missing Permissions")) {
            errorMessage = "I don't have permission to delete messages in this channel."
          } else if (error.message && error.message.includes("message_too_old")) {
            errorMessage = "Some messages are older than 14 days and cannot be bulk deleted."
          }

          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: errorMessage },
          })
        }
      }

      // Handle warn command
      else if (name === "warn") {
        const userId = options.find((opt) => opt.name === "user")?.value
        const reason = options.find((opt) => opt.name === "reason")?.value
        const anonymous = options.find((opt) => opt.name === "anonymous")?.value ?? true // Default to true if not specified

        if (!userId || !reason) {
          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "Please specify both a user and a reason for the warning." },
          })
        }

        try {
          // Get user information for logging
          const userResponse = await discordRequest(`users/${userId}`, {
            method: "GET",
          })

          const user = await userResponse.json()

          // Get server name
          const guildName = body.guild.name

          // Send a DM to the user with the warning
          let dmSent = false
          try {
            // First, create a DM channel
            const dmChannelResponse = await discordRequest(`users/@me/channels`, {
              method: "POST",
              body: JSON.stringify({ recipient_id: userId }),
            })

            const dmChannel = await dmChannelResponse.json()

            // Create the warning message
            let warningMessage = `**Warning from ${guildName}**\n\n`

            // Add moderator info if not anonymous
            if (!anonymous) {
              warningMessage += `**Moderator:** ${body.member.user.username}\n\n`
            }

            warningMessage += `**Reason:** ${reason}`

            // Send the warning message
            await discordRequest(`channels/${dmChannel.id}/messages`, {
              method: "POST",
              body: JSON.stringify({
                content: warningMessage,
              }),
            })

            dmSent = true
          } catch (dmError) {
            console.error("Error sending DM:", dmError)
            // Continue even if DM fails
          }

          // Send log if logging is enabled
          const logEmbed = createLogEmbed("warn", moderator, user, reason, {
            "DM Sent": dmSent ? "Yes" : "No (User may have DMs disabled)",
            Anonymous: anonymous ? "Yes" : "No",
          })

          sendLogMessage(guildId, logEmbed)

          // Send confirmation in the channel
          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Warning sent to <@${userId}> for: ${reason}${!dmSent ? " (Note: Could not send DM to user)" : ""}`,
              allowed_mentions: { parse: [] }, // Prevent user ping
            },
          })
        } catch (error) {
          console.error("Error warning user:", error)

          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Warning logged for <@${userId}>, but I couldn't DM them. They may have DMs disabled.`,
              allowed_mentions: { parse: [] }, // Prevent user ping
            },
          })
        }
      }

      // Handle kick command
      else if (name === "kick") {
        const userId = options.find((opt) => opt.name === "user")?.value
        const reason = options.find((opt) => opt.name === "reason")?.value || "No reason provided"

        if (!userId) {
          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "Please specify a user to kick." },
          })
        }

        try {
          // Get user information for logging
          const userResponse = await discordRequest(`users/${userId}`, {
            method: "GET",
          })

          const user = await userResponse.json()

          // Kick the user
          await discordRequest(`guilds/${guildId}/members/${userId}`, {
            method: "DELETE",
            body: JSON.stringify({ reason }),
          })

          // Send log if logging is enabled
          const logEmbed = createLogEmbed("kick", moderator, user, reason)

          sendLogMessage(guildId, logEmbed)

          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Successfully kicked <@${userId}> for: ${reason}`,
              allowed_mentions: { parse: [] }, // Prevent user ping
            },
          })
        } catch (error) {
          console.error("Error kicking user:", error)

          let errorMessage = "Failed to kick user. Please check bot permissions."

          if (error.message && error.message.includes("Missing Permissions")) {
            errorMessage =
              "I don't have permission to kick this user. Make sure my role is higher than their highest role."
          }

          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: errorMessage },
          })
        }
      }

      // Handle ban command
      else if (name === "ban") {
        const userId = options.find((opt) => opt.name === "user")?.value
        const reason = options.find((opt) => opt.name === "reason")?.value || "No reason provided"
        const days = options.find((opt) => opt.name === "days")?.value || 0

        if (!userId) {
          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "Please specify a user to ban." },
          })
        }

        try {
          // Get user information for logging
          const userResponse = await discordRequest(`users/${userId}`, {
            method: "GET",
          })

          const user = await userResponse.json()

          // Ban the user
          await discordRequest(`guilds/${guildId}/bans/${userId}`, {
            method: "PUT",
            body: JSON.stringify({
              delete_message_days: days,
              reason,
            }),
          })

          // Send log if logging is enabled
          const logEmbed = createLogEmbed("ban", moderator, user, reason, {
            "Messages Deleted": days > 0 ? `${days} days` : "None",
          })

          sendLogMessage(guildId, logEmbed)

          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Successfully banned <@${userId}> for: ${reason}`,
              allowed_mentions: { parse: [] }, // Prevent user ping
            },
          })
        } catch (error) {
          console.error("Error banning user:", error)

          let errorMessage = "Failed to ban user. Please check bot permissions."

          if (error.message && error.message.includes("Missing Permissions")) {
            errorMessage =
              "I don't have permission to ban this user. Make sure my role is higher than their highest role."
          }

          return NextResponse.json({
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: errorMessage },
          })
        }
      }

      // Default response for unhandled commands
      else {
        return NextResponse.json({
          type: CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: "Command not recognized or missing required options." },
        })
      }
    }

    // Default response for unhandled interaction types
    console.log("Unhandled interaction type")
    return NextResponse.json({
      type: CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: "Unhandled interaction type." },
    })
  } catch (error) {
    console.error("Error processing interaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

