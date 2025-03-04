import { NextResponse } from "next/server"
import { verifyDiscordRequest, discordRequest } from "../../../../lib/discord"

export async function POST(req) {
  try {
    // Verify the request is from Discord
    const { isValid, body } = await verifyDiscordRequest(req)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid request" }, { status: 401 })
    }

    // Handle Discord's ping
    if (body.type === 1) {
      return NextResponse.json({ type: 1 })
    }

    // Handle slash commands
    if (body.type === 2) {
      const { name, options } = body.data

      if (name === "role") {
        const subCommand = options[0].name
        const subCommandOptions = options[0].options
        const userId = subCommandOptions.find((opt) => opt.name === "user").value
        const roleId = subCommandOptions.find((opt) => opt.name === "role").value
        const guildId = body.guild_id

        try {
          if (subCommand === "assign") {
            // Add role to user
            await discordRequest(`guilds/${guildId}/members/${userId}/roles/${roleId}`, {
              method: "PUT",
            })

            return NextResponse.json({
              type: 4,
              data: {
                content: `Successfully assigned <@&${roleId}> to <@${userId}>!`,
                allowed_mentions: { parse: [] }, // Prevent role and user pings
              },
            })
          } else if (subCommand === "unassign") {
            // Remove role from user
            await discordRequest(`guilds/${guildId}/members/${userId}/roles/${roleId}`, {
              method: "DELETE",
            })

            return NextResponse.json({
              type: 4,
              data: {
                content: `Successfully unassigned <@&${roleId}> from <@${userId}>!`,
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
            type: 4,
            data: { content: errorMessage },
          })
        }
      }
    }

    // Default response for unhandled commands
    return NextResponse.json({
      type: 4,
      data: { content: "Command not recognized." },
    })
  } catch (error) {
    console.error("Error processing interaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

