import { REST, Routes } from "discord.js"

// Register commands with Discord
export async function registerCommands(commands) {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN)
  try {
    const data = await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands })
    return data
  } catch (error) {
    console.error("Error registering commands:", error)
    throw error
  }
}

// Create a Discord client instance
export function createClient() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] })
  return client
}

// Handle Discord interactions
export async function handleInteraction(interaction) {
  // Handle slash commands
  if (interaction.type === InteractionType.ApplicationCommand) {
    const { commandName, options } = interaction

    if (commandName === "role") {
      const subCommand = options.getSubcommand()
      const user = options.getUser("user")
      const role = options.getRole("role")

      if (!user || !role) {
        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "Missing user or role information.",
          },
        }
      }

      try {
        const member = await interaction.guild.members.fetch(user.id)

        if (subCommand === "add") {
          await member.roles.add(role)
          return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content: `Successfully added ${role} to ${user}!`,
              allowed_mentions: { parse: [] },
            },
          }
        } else if (subCommand === "remove") {
          await member.roles.remove(role)
          return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content: `Successfully removed ${role} from ${user}!`,
              allowed_mentions: { parse: [] },
            },
          }
        }
      } catch (error) {
        console.error("Error managing roles:", error)

        let errorMessage = "Failed to manage roles. Please check bot permissions."

        if (error.message && error.message.includes("Missing Permissions")) {
          errorMessage =
            "I don't have permission to manage this role. Make sure my role is higher than the role you're trying to manage."
        }

        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: errorMessage,
          },
        }
      }
    }
  }

  // Default response
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: "Command not recognized.",
    },
  }
}

