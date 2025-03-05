import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default function Home() {
  redirect("/dashboard")

  // This won't be rendered, but we'll include it as a fallback
  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>Discord Moderation Bot</h1>
      <p style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Redirecting to dashboard...</p>
    </main>
  )
}

// Feature Card Component
function FeatureCard({ title, description, icon }) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="text-4xl mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-300">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

// Command Card Component
function CommandCard({ name, description }) {
  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <p className="font-mono text-indigo-400">{name}</p>
      <p className="text-sm text-gray-300 mt-1">{description}</p>
    </div>
  )
}

