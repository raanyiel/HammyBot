"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch the user's data and servers
    const fetchUserData = async () => {
      try {
        // First, check if we're authenticated
        const authResponse = await fetch("/api/auth/check")
        if (!authResponse.ok) {
          // If not authenticated, redirect to login
          router.push("/dashboard/login")
          return
        }

        const authData = await authResponse.json()
        setUser(authData.user)

        // Fetch the user's servers
        const serversResponse = await fetch("/api/discord/servers")
        if (serversResponse.ok) {
          const serversData = await serversResponse.json()
          setServers(serversData)
        } else {
          console.error("Failed to fetch servers")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleServerClick = (serverId) => {
    router.push(`/dashboard/server/${serverId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading your servers...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {user && (
        <div className="flex items-center mb-6">
          <img
            src={
              user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                : "https://cdn.discordapp.com/embed/avatars/0.png"
            }
            alt={user.username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <h1 className="text-3xl font-bold">Welcome, {user.username}</h1>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Your Servers</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servers.map((server) => (
          <Card key={server.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{server.name}</CardTitle>
              <CardDescription>Server ID: {server.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleServerClick(server.id)}>Manage Server</Button>
            </CardContent>
          </Card>
        ))}

        {servers.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 mb-4">You don't have any servers with the bot installed.</p>
            <Button
              onClick={() =>
                window.open(
                  `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`,
                  "_blank",
                )
              }
            >
              Add Bot to Server
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

