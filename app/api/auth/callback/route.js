import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    // Get the authorization code from the URL
    const url = new URL(req.url)
    const code = url.searchParams.get("code")
    const error = url.searchParams.get("error")

    // If there's an error or no code, handle it
    if (error || !code) {
      console.error("OAuth error:", error || "No code provided")
      return NextResponse.redirect(new URL("/?error=oauth_failed", req.url))
    }

    // Exchange the code for an access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri:
          process.env.NEXT_PUBLIC_REDIRECT_URI ||
          `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/auth/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}))
      console.error("Token exchange error:", errorData)
      return NextResponse.redirect(new URL("/?error=token_exchange", req.url))
    }

    const tokenData = await tokenResponse.json()

    // Get the user's information
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.error("Failed to get user info")
      return NextResponse.redirect(new URL("/?error=user_info", req.url))
    }

    const userData = await userResponse.json()

    // Get the guilds the bot was added to
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!guildsResponse.ok) {
      console.error("Failed to get guilds info")
      return NextResponse.redirect(new URL("/?error=guilds_info", req.url))
    }

    const guildsData = await guildsResponse.json()

    // Store user data in the database
    try {
      await prisma.user.upsert({
        where: { id: userData.id },
        update: {
          username: userData.username,
          avatar: userData.avatar,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          tokenExpires: new Date(Date.now() + tokenData.expires_in * 1000),
          lastLogin: new Date(),
        },
        create: {
          id: userData.id,
          username: userData.username,
          avatar: userData.avatar,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          tokenExpires: new Date(Date.now() + tokenData.expires_in * 1000),
          lastLogin: new Date(),
        },
      })

      // You might want to create a session cookie here

      return NextResponse.redirect(new URL(`/dashboard?success=true&user=${userData.username}`, req.url))
    } catch (error) {
      console.error("Failed to store user data:", error)
      return NextResponse.redirect(new URL("/?error=database_error", req.url))
    }
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.redirect(new URL("/?error=server_error", req.url))
  }
}

