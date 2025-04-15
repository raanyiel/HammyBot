js

import { verifyKey } from "discord-interactions"

export async function verifyDiscordRequest(request) {
  const signature = request.headers.get("x-signature-ed25519")
  const timestamp = request.headers.get("x-signature-timestamp")
  const body = await request.text()

  if (!signature || !timestamp || !body) return { isValid: false, body: null }

  const isValid = verifyKey(body, signature, timestamp, process.env.DISCORD_PUBLIC_KEY)
  if (!isValid) return { isValid: false, body: null }

  try {
    return { isValid: true, body: JSON.parse(body) }
  } catch {
    return { isValid: false, body: null }
  }
}
