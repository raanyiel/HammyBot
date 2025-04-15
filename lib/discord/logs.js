import { discordRequest } from "./api.js"
import { getLoggingChannel } from "../db/loggingChannels.js"

export async function sendLogMessage(guildId, embed) {
  const channelId = await getLoggingChannel(guildId)
  if (!channelId) return false

  await discordRequest(`channels/${channelId}/messages`, {
    method: "POST",
    body: JSON.stringify({ embeds: [embed] }),
  })

  return true
}

export function createLogEmbed(action, moderator, user, reason, details = {}) {
  const colorMap = {
    ban: 0xed4245,
    kick: 0xfee75c,
    warn: 0xf8a532,
    purge: 0x5865f2,
    "role add": 0x57f287,
    "role remove": 0xeb459e,
  }

  const embed = {
    title: `${action.toUpperCase()} | Moderation Action`,
    color: colorMap[action.toLowerCase()] || 0x95a5a6,
    timestamp: new Date().toISOString(),
    footer: { text: `ID: ${user?.id || "N/A"}` },
    fields: [],
  }

  if (moderator)
    embed.fields.push({ name: "Moderator", value: `<@${moderator.id}> (${moderator.username})`, inline: true })
  if (user)
    embed.fields.push({ name: "User", value: `<@${user.id}> (${user.username})`, inline: true })
  if (reason) embed.fields.push({ name: "Reason", value: reason })

  for (const [k, v] of Object.entries(details)) {
    if (v) embed.fields.push({ name: capitalize(k), value: String(v), inline: true })
  }

  return embed
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
