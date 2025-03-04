import { NextResponse } from "next/server"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v10"

// This endpoint will be called by Discord after acknowledging the interaction
export async function POST(req) {
  try {
    const { guildId, userId, roleId, action } = await req.json()

    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN)

    if (action === "add") {
      await rest.put(Routes.guildMemberRole(guildId, userId, roleId))

      return NextResponse.json({
        success: true,
        message: `Role ${roleId} added to user ${userId}`,
      })
    } else if (action === "remove") {
      await rest.delete(Routes.guildMemberRole(guildId, userId, roleId))

      return NextResponse.json({
        success: true,
        message: `Role ${roleId} removed from user ${userId}`,
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid action",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Error processing role action:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

