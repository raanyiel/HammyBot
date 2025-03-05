import { NextResponse } from "next/server"
import { registerCommands } from "./lib/discord"
import { ALL_COMMANDS } from "./lib/commands"
import { processPendingGithubEvents } from "./lib/github"

// This variable helps us track if commands have been registered in this deployment
let commandsRegistered = false
let pendingEventsProcessed = false

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

  // Process any pending GitHub events once per deployment
  if (!pendingEventsProcessed && process.env.NODE_ENV === "production") {
    pendingEventsProcessed = true

    try {
      // Process with a slight delay to ensure the app is fully initialized
      setTimeout(async () => {
        await processPendingGithubEvents()
      }, 5000)
    } catch (error) {
      console.error("Failed to process pending GitHub events:", error)
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/api/:path*"],
}

