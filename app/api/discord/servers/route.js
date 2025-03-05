import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const authCookie = cookies().get("discord_auth")

  if (!authCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const authData = JSON.parse(authCookie.value)

    // Check if the token is expired
    if (authData.expires_at < Date.now()) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 })
    }

    // Filter guilds where the user has admin permissions
    // The permission for Administrator is 0x8 (8)
    const adminGuilds = authData.guilds.filter((guild) => (guild.permissions & 0x8) === 0x8 || guild.owner)

    // Now, we need to check which of these servers have our bot installed
    // For this, we'd typically query our database
    // For now, we'll just return all admin guilds

    return NextResponse.json(adminGuilds)
  } catch (error) {
    console.error("Error fetching servers:", error)
    return NextResponse.json({ error: "Failed to fetch servers" }, { status: 500 })
  }
}

