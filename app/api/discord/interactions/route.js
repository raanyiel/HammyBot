import { NextResponse } from "next/server"

// This is a simplified version just to test if Discord is reaching your endpoint
export async function POST(req) {
  try {
    // Log all headers
    const headers = {}
    req.headers.forEach((value, key) => {
      headers[key] = value
    })

    console.log("Received Discord interaction")
    console.log("Headers:", JSON.stringify(headers, null, 2))

    // Get the raw body
    const body = await req.text()
    console.log("Body length:", body.length)
    console.log("Body preview:", body.substring(0, 200) + (body.length > 200 ? "..." : ""))

    // Parse the body
    let parsedBody
    try {
      parsedBody = JSON.parse(body)
      console.log("Parsed body type:", parsedBody.type)
    } catch (e) {
      console.error("Failed to parse body as JSON:", e.message)
    }

    // If this is a ping from Discord (type 1), respond with pong (type 1)
    if (parsedBody && parsedBody.type === 1) {
      console.log("Responding to ping with pong")
      return NextResponse.json({ type: 1 })
    }

    // For all other requests, just acknowledge them
    console.log("Responding with acknowledgement")
    return NextResponse.json({
      type: 4,
      data: { content: "Command received! This is a test response." },
    })
  } catch (error) {
    console.error("Error in interactions endpoint:", error)
    return NextResponse.json(
      {
        error: "Error processing request",
        message: error.message,
      },
      { status: 500 },
    )
  }
}

