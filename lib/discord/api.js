export async function discordRequest(endpoint, options) {
  const url = `https://discord.com/api/v10/${endpoint}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(JSON.stringify(err))
  }

  return res
}

export async function registerCommands(commands) {
  return discordRequest(`applications/${process.env.DISCORD_CLIENT_ID}/commands`, {
    method: "PUT",
    body: JSON.stringify(commands),
  }).then((res) => res.json())
}
