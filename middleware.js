import { NextResponse } from "next/server"
import { registerCommands } from "./lib/discord"
import { ALL_COMMANDS } from "./lib/commands"

// This variable helps us track if commands have been registered in this deployment
let commandsRegistered = false

export async function middleware(request) {
  // Only run this once per deployment
  if (!commandsRegistered && process.env.NODE_ENV === "production") {
    commandsRegistered = true

    try {
      console.log("Automatically registering commands on deployment...")
      await registerCommands(ALL_COMMANDS)
      console.log("Commands registered successfully!")
    } catch (error) {
      console.error("Failed to register commands on startup:", error)
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/api/:path*"],
}

