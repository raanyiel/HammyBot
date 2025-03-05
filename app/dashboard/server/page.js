"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      router.push("/dashboard/login")
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Hammy Bot Dashboard</h1>
        <p className="mb-4">Redirecting to login...</p>
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    )
  }

  // This shouldn't render, but just in case
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Hammy Bot Dashboard</h1>
      <p className="mb-4">Please log in to access the dashboard.</p>
      <Link href="/dashboard/login">
        <Button>Go to Login</Button>
      </Link>
    </div>
  )
}

