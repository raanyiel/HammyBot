import { NextResponse } from "next/server"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/login?error=missing_code", request.url))
  }

  try {
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
        redirect_uri: `${new URL(request.url).origin}/api/auth/callback/discord`,
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      console.error("Token exchange error:", error)
      return NextResponse.redirect(new URL("/dashboard/login?error=token_exchange", request.url))
    }

    const tokenData = await tokenResponse.json()

    // Get the user's information
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      return NextResponse.redirect(new URL("/dashboard/login?error=user_fetch", request.url))
    }

    const userData = await userResponse.json()

    // Get the user's guilds
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!guildsResponse.ok) {
      return NextResponse.redirect(new URL("/dashboard/login?error=guilds_fetch", request.url))
    }

    const guildsData = await guildsResponse.json()

    // In a real application, you would:
    // 1. Store the token in a secure HTTP-only cookie or session
    // 2. Store user data in a database or session
    // 3. Redirect to the dashboard

    // For now, we'll just redirect to the dashboard with a temporary query param
    return NextResponse.redirect(new URL(`/dashboard?login_success=true`, request.url))
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.redirect(new URL("/dashboard/login?error=server_error", request.url))
  }
}

