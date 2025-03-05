"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  const searchParams = useSearchParams()
  const success = searchParams.get("success")
  const username = searchParams.get("user")
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the user's servers from your API
    // For now, we'll use mock data
    setTimeout(() => {
      setServers([
        { id: "1", name: "My Cool Server", memberCount: 120, botAdded: true },
        { id: "2", name: "Gaming Community", memberCount: 450, botAdded: true },
        { id: "3", name: "Study Group", memberCount: 75, botAdded: false },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hammy Bot Dashboard</h1>
          {username && <p className="text-gray-600 dark:text-gray-300">Welcome, {username}!</p>}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6" role="alert">
            <p className="font-bold">Success!</p>
            <p>Hammy Bot has been added to your server.</p>
          </div>
        )}

        <Tabs defaultValue="servers">
          <TabsList className="mb-6">
            <TabsTrigger value="servers">My Servers</TabsTrigger>
            <TabsTrigger value="settings">Bot Settings</TabsTrigger>
            <TabsTrigger value="commands">Commands</TabsTrigger>
          </TabsList>

          <TabsContent value="servers">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Servers</h2>

            {loading ? (
              <p className="text-gray-600 dark:text-gray-300">Loading your servers...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servers.map((server) => (
                  <ServerCard key={server.id} server={server} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Bot Settings</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Global bot settings will appear here. For server-specific settings, please select a server.
            </p>
          </TabsContent>

          <TabsContent value="commands">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Available Commands</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Here are some of the commands you can use with Hammy Bot:
              </p>

              <div className="space-y-4">
                <CommandItem name="/role add @user @role" description="Add a role to a user" />
                <CommandItem name="/role remove @user @role" description="Remove a role from a user" />
                <CommandItem
                  name="/warn @user [reason] [anonymous]"
                  description="Warn a user with a specified reason"
                />
                <CommandItem name="/purge [amount]" description="Delete a specified number of messages (1-100)" />
                <CommandItem
                  name="/github-webhook setup [repository] [#channel] [events]"
                  description="Set up GitHub webhook notifications for a repository"
                />
                <CommandItem
                  name="/starboard setup #channel [threshold] [emoji]"
                  description="Set up the starboard in a specific channel"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function ServerCard({ server }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{server.name}</CardTitle>
        <CardDescription>{server.memberCount} members</CardDescription>
      </CardHeader>
      <CardContent>
        <p className={server.botAdded ? "text-green-600" : "text-red-600"}>
          {server.botAdded ? "Bot is active" : "Bot not added"}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant={server.botAdded ? "outline" : "default"}>{server.botAdded ? "Manage Bot" : "Add Bot"}</Button>
      </CardFooter>
    </Card>
  )
}

function CommandItem({ name, description }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
      <p className="font-mono text-sm bg-gray-100 dark:bg-gray-700 p-1 rounded inline-block mb-1">{name}</p>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  )
}

