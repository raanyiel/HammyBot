"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)

  // Check if user just logged in
  const loginSuccess = searchParams.get("login_success")

  useEffect(() => {
    // In a real app, you would fetch the user's servers from your API
    // For now, we'll just use dummy data
    setTimeout(() => {
      setServers([
        { id: "123456789", name: "Test Server 1", icon: null },
        { id: "987654321", name: "Test Server 2", icon: null },
      ])
      setLoading(false)
    }, 1000)
  }, [])

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
      <h1 className="text-3xl font-bold mb-6">Your Servers</h1>

      {loginSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Successfully logged in with Discord!
        </div>
      )}

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
                  "https://discord.com/api/oauth2/authorize?client_id=" +
                    process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID +
                    "&permissions=8&scope=bot%20applications.commands",
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

