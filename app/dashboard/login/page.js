"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Check for error in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    if (errorParam) {
      setError(getErrorMessage(errorParam))
    }
  }, [])

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'missing_code':
        return 'Authorization code missing. Please try again.'
      case 'token_exchange':
        return 'Failed to exchange token. Please try again.'
      case 'user_fetch':
        return 'Failed to fetch user data. Please try again.'
      case 'guilds_fetch':
        return 'Failed to fetch guilds data. Please try again.'
      case 'server_error':
        return 'An unexpected error occurred. Please try again.'
      default:
        return 'An error occurred during login. Please try again.'
    }
  }

  const handleLogin = () => {
    setIsLoading(true)
    
    // Get the Discord OAuth URL parameters
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || 
      `${window.location.origin}/api/auth/callback`
    
    // Define the scopes we need
    const scopes = ['identify', 'guilds'].join('%20')
    
    // Redirect to Discord's OAuth page
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes}`
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Dashboard Login</CardTitle>
          <CardDescription className="text-center">
            Log in with your Discord account to manage your servers
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
              {error}
            </div>
          )}
          
          <Button 
            onClick={handleLogin}
            disabled={isLoading}
            className="bg-[#5865F2] hover:bg-[#4752C4] flex items-center gap-2"
          >
            {isLoading ? (
              <span>Loading...</span>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309\

