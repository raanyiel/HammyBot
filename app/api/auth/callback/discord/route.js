import { NextResponse } from "next/server"
import { cookies } from "next/headers"

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
        redirect_uri:
          process.env.NEXT_PUBLIC_REDIRECT_URI || `${new URL(request.url).origin}/api/auth/callback/discord`,
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

    // Store the auth data in a cookie
    const authData = {
      user: userData,
      guilds: guildsData,
      token: tokenData.access_token,
      expires_at: Date.now() + tokenData.expires_in * 1000,
    }

    // Set the cookie
    cookies().set({
      name: "discord_auth",
      value: JSON.stringify(authData),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenData.expires_in,
      path: "/",
    })

    // Redirect to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.redirect(new URL("/dashboard/login?error=server_error", request.url))
  }
}

