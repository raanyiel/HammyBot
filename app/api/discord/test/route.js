import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "Test endpoint is working!" })
}

export async function POST(req) {
  try {
    // Log all headers
    const headers = {}
    req.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Get the raw body
    const body = await req.text()

    // Return all the information we received
    return NextResponse.json({
      message: "Request received!",
      headers: headers,
      bodyLength: body.length,
      bodyPreview: body.substring(0, 200) + (body.length > 200 ? "..." : ""),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error processing request",
        message: error.message,
      },
      { status: 500 },
    )
  }
}

