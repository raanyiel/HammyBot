import { NextResponse } from "next/server"
import { registerCommands } from "../../../../lib/discord"
import { ALL_COMMANDS } from "../../../../lib/commands"

// This endpoint registers all slash commands with Discord
export async function GET() {
  try {
    const response = await registerCommands(ALL_COMMANDS)
    return NextResponse.json({ success: true, commands: response })
  } catch (error) {
    console.error("Error registering commands:", error)
    return NextResponse.json({ error: "Failed to register commands" }, { status: 500 })
  }
}

