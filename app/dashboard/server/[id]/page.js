"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ServerSettings() {
  const { id } = useParams()
  const [server, setServer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the server details from your API
    // For now, we'll use mock data
    setTimeout(() => {
      setServer({
        id,
        name: "My Discord Server",
        memberCount: 120,
        icon: "https://cdn.discordapp.com/embed/avatars/0.png",
        features: {
          logging: true,
          loggingChannel: "bot-logs",
          starboard: false,
          starboardChannel: "",
          starboardThreshold: 3,
          starboardEmoji: "⭐",
          verification: true,
          verificationRole: "Verified",
        },
      })
      setLoading(false)
    }, 1000)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading server settings...</p>
      </div>
    )
  }

  if (!server) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-600">Server not found or you don't have access.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-6 flex items-center">
          <img src={server.icon || "/placeholder.svg"} alt={server.name} className="w-12 h-12 rounded-full mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{server.name}</h1>
            <p className="text-gray-600 dark:text-gray-300">{server.memberCount} members</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="logging">Logging</TabsTrigger>
            <TabsTrigger value="starboard">Starboard</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure general bot settings for this server</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="prefix">Command Prefix</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">The bot uses slash commands by default</p>
                  </div>
                  <Input id="prefix" value="/" className="w-20 text-center" disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">The language for bot responses</p>
                  </div>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logging">
            <Card>
              <CardHeader>
                <CardTitle>Logging Settings</CardTitle>
                <CardDescription>Configure logging for moderation actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="logging-enabled">Enable Logging</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Log moderation actions to a channel</p>
                  </div>
                  <Switch id="logging-enabled" checked={server.features.logging} />
                </div>

                {server.features.logging && (
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="logging-channel">Logging Channel</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Channel where logs will be sent</p>
                    </div>
                    <Select defaultValue={server.features.loggingChannel}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bot-logs">bot-logs</SelectItem>
                        <SelectItem value="mod-logs">mod-logs</SelectItem>
                        <SelectItem value="general">general</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="starboard">
            <Card>
              <CardHeader>
                <CardTitle>Starboard Settings</CardTitle>
                <CardDescription>Configure the starboard feature</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="starboard-enabled">Enable Starboard</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Highlight popular messages in a dedicated channel
                    </p>
                  </div>
                  <Switch id="starboard-enabled" checked={server.features.starboard} />
                </div>

                {server.features.starboard && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="starboard-channel">Starboard Channel</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Channel where starred messages will be posted
                        </p>
                      </div>
                      <Select defaultValue={server.features.starboardChannel || "starboard"}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="starboard">starboard</SelectItem>
                          <SelectItem value="highlights">highlights</SelectItem>
                          <SelectItem value="general">general</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="starboard-threshold">Star Threshold</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Number of stars needed to appear on the starboard
                        </p>
                      </div>
                      <Input
                        id="starboard-threshold"
                        type="number"
                        defaultValue={server.features.starboardThreshold}
                        min="1"
                        max="100"
                        className="w-20 text-center"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="starboard-emoji">Star Emoji</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Emoji used for starring messages</p>
                      </div>
                      <Input
                        id="starboard-emoji"
                        defaultValue={server.features.starboardEmoji}
                        className="w-20 text-center"
                      />
                    </div>
                  </>
                )}

                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Verification Settings</CardTitle>
                <CardDescription>Configure the verification system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="verification-enabled">Enable Verification</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Require users to verify before accessing the server
                    </p>
                  </div>
                  <Switch id="verification-enabled" checked={server.features.verification} />
                </div>

                {server.features.verification && (
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="verification-role">Verification Role</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Role given to verified users</p>
                    </div>
                    <Select defaultValue={server.features.verificationRole}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Verified">Verified</SelectItem>
                        <SelectItem value="Member">Member</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="github">
            <Card>
              <CardHeader>
                <CardTitle>GitHub Integration</CardTitle>
                <CardDescription>Manage GitHub webhook integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Connected Repositories</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Use the <code>/github-webhook</code> commands in Discord to manage repositories
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                      <div>
                        <p className="font-medium">owner/repo</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Channel: #github-updates</p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Remove
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                      <div>
                        <p className="font-medium">owner/another-repo</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Channel: #dev-feed</p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Add New Repository</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Use the following command in your Discord server:
                  </p>
                  <code className="block p-2 bg-black text-white rounded font-mono text-sm">
                    /github-webhook setup owner/repo #channel events
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

