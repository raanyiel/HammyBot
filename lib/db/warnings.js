import prisma from "./prismaClient.js"

export async function addWarning(data) {
  return await prisma.warning.create({ data }).catch(() => null)
}

export async function getWarnings(guildId, userId) {
  return await prisma.warning.findMany({
    where: { guildId, userId },
    orderBy: { createdAt: "desc" },
  }).catch(() => [])
}

export async function clearWarnings(guildId, userId) {
  return await prisma.warning.deleteMany({ where: { guildId, userId } }).then(r => r.count).catch(() => 0)
}

export async function clearWarning(warningId) {
  return await prisma.warning.delete({ where: { id: warningId } }).catch(() => null)
}
