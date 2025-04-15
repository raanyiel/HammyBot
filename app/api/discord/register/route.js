import { NextResponse } from "next/server"
import { registerCommands } from "../../../../lib/discord/api"
import { ALL_COMMANDS } from "../../../../lib/discord/commands"

// This endpoint registers all slash commands with Discord
export async function GET() {
  try {
    const response = await registerCommands(ALL_COMMANDS)

    // Create a more detailed response
    const commandDetails = ALL_COMMANDS.map((cmd) => ({
      name: cmd.name,
      description: cmd.description,
      options: cmd.options ? cmd.options.length : 0,
    }))

    return NextResponse.json({
      success: true,
      message: "Commands registered successfully!",
      registeredAt: new Date().toISOString(),
      commandCount: response.length,
      commands: commandDetails,
    })
  } catch (error) {
    console.error("Error registering commands:", error)
    return NextResponse.json(
      {
        error: "Failed to register commands",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
