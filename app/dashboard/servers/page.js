"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ServersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState(null)
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      // Get user data from URL
      const userParam = searchParams.get("user")
      const guildsParam = searchParams.get("guilds")

      if (userParam && guildsParam) {
        const userData = JSON.parse(userParam)
        const guildsData = JSON.parse(guildsParam)

        setUser(userData)
        setServers(guildsData)
      } else {
        // If no data in URL, redirect to login
        router.push("/dashboard/login")
      }
    } catch (error) {
      console.error("Error parsing URL data:", error)
      router.push("/dashboard/login")
    } finally {
      setLoading(false)
    }
  }, [searchParams, router])

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

