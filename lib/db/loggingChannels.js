import prisma from "./prismaClient.js"

export async function setLoggingChannel(guildId, channelId) {
  return await prisma.loggingChannel.upsert({
    where: { guildId },
    update: { channelId },
    create: { guildId, channelId },
  }).then(() => true).catch(() => false)
}

export async function disableLogging(guildId) {
  return await prisma.loggingChannel.delete({ where: { guildId } }).then(() => true).catch(() => false)
}

export async function getLoggingChannel(guildId) {
  return await prisma.loggingChannel.findUnique({ where: { guildId } }).then(res => res?.channelId).catch(() => null)
}
