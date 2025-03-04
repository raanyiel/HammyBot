import { NextResponse } from "next/server"
import { verifyDiscordRequest, discordRequest } from "../../../../lib/discord"

console.log = (...args) => {
  // Write to a file or use another logging method if needed
  // For now, we'll keep the original console.log behavior
  process.stdout.write(args.join(" ") + "\n")
}

export async function POST(req) {
  try {
    console.log("Received Discord interaction")
    // Verify the request is from Discord
    const { isValid, body } = await verifyDiscordRequest(req)

    console.log("Request validation:", isValid ? "valid" : "invalid")
    console.log("Request body:", JSON.stringify(body, null, 2))

    if (!isValid) {
      console.log("Invalid request signature")
      return NextResponse.json({ error: "Invalid request" }, { status: 401 })
    }

    // Handle Discord's ping
    if (body.type === 1) {
      console.log("Handling Discord ping")
      return NextResponse.json({ type: 1 })
    }

    // Handle slash commands
    if (body.type === 2) {
      console.log("Handling slash command:", body.data.name)
      const { name, options } = body.data

      if (name === "role") {
        const subCommand = options[0].name
        const subCommandOptions = options[0].options
        const userId = subCommandOptions.find((opt) => opt.name === "user").value
        const roleId = subCommandOptions.find((opt) => opt.name === "role").value
        const guildId = body.guild_id

        console.log(`Processing role ${subCommand} command`)
        console.log(`Guild ID: ${guildId}, User ID: ${userId}, Role ID: ${roleId}`)

        try {
          if (subCommand === "add") {
            // Add role to user
            console.log(`Adding role ${roleId} to user ${userId}`)
            const response = await discordRequest(`guilds/${guildId}/members/${userId}/roles/${roleId}`, {
              method: "PUT",
            })
            console.log("Discord API response:", response.status)
            return NextResponse.json({
              type: 4,
              data: {
                content: `Successfully added <@&${roleId}> to <@${userId}>!`,
                allowed_mentions: { parse: [] }, // Prevent role and user pings
              },
            })
          } else if (subCommand === "remove") {
            // Remove role from user
            console.log(`Removing role ${roleId} from user ${userId}`)
            const response = await discordRequest(`guilds/${guildId}/members/${userId}/roles/${roleId}`, {
              method: "DELETE",
            })
            console.log("Discord API response:", response.status)
            return NextResponse.json({
              type: 4,
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
            type: 4,
            data: { content: errorMessage },
          })
        }
      }
    }

    // Default response for unhandled commands
    console.log("Command not recognized")
    return NextResponse.json({
      type: 4,
      data: { content: "Command not recognized." },
    })
  } catch (error) {
    console.error("Error processing interaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

