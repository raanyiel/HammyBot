import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    console.error("Missing authorization code")
    return NextResponse.redirect(new URL("/dashboard/login?error=missing_code", request.url))
  }

  try {
    console.log("Exchanging code for token...")

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
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error("Token exchange error:", errorText)
      return NextResponse.redirect(new URL("/dashboard/login?error=token_exchange", request.url))
    }

    const tokenData = await tokenResponse.json()
    console.log("Token received successfully")

    // Get the user's information
    console.log("Fetching user data...")
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.error("User fetch error:", await userResponse.text())
      return NextResponse.redirect(new URL("/dashboard/login?error=user_fetch", request.url))
    }

    const userData = await userResponse.json()
    console.log("User data fetched successfully:", userData.username)

    // Get the user's guilds
    console.log("Fetching guilds data...")
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!guildsResponse.ok) {
      console.error("Guilds fetch error:", await guildsResponse.text())
      return NextResponse.redirect(new URL("/dashboard/login?error=guilds_fetch", request.url))
    }

    const guildsData = await guildsResponse.json()
    console.log(`Fetched ${guildsData.length} guilds`)

    // Store the auth data in a cookie
    const authData = {
      user: userData,
      guilds: guildsData,
      token: tokenData.access_token,
      expires_at: Date.now() + tokenData.expires_in * 1000,
    }

    // Set the cookie
    console.log("Setting auth cookie...")
    cookies().set({
      name: "discord_auth",
      value: JSON.stringify(authData),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenData.expires_in,
      path: "/",
    })

    console.log("Auth cookie set, redirecting to dashboard")
    // Redirect to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.redirect(new URL("/dashboard/login?error=server_error", request.url))
  }
}

