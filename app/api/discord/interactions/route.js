import { NextResponse } from "next/server"
import { verifyDiscordRequest, discordRequest } from "../../../../lib/discord"

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

      if (name === "role" && options && options.length > 0) {
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
        const guildId = body.guild_id

        console.log(`Processing role ${subCommand} command`)
        console.log(`Guild ID: ${guildId}, User ID: ${userId}, Role ID: ${roleId}`)

        try {
          if (subCommand === "add") {
            // Add role to user
            console.log(`Adding role ${roleId} to user ${userId}`)
            await discordRequest(`guilds/${guildId}/members/${userId}/roles/${roleId}`, {
              method: "PUT",
            })

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

      // Default response for unhandled commands
      return NextResponse.json({
        type: CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: "Command not recognized or missing required options." },
      })
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

