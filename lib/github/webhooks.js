import prisma from "../db/prismaClient.js"

export async function setGithubWebhook(guildId, repository, channelId, events = "all") {
  try {
    await prisma.githubWebhook.upsert({
      where: { guildId_repository: { guildId, repository } },
      update: { channelId, events },
      create: { guildId, repository, channelId, events },
    })
    return true
  } catch {
    return false
  }
}

export async function removeGithubWebhook(guildId, repository) {
  try {
    const result = await prisma.githubWebhook.delete({
      where: { guildId_repository: { guildId, repository } },
    }).catch(() => null)
    return !!result
  } catch {
    return false
  }
}

export async function listGithubWebhooks(guildId) {
  try {
    const webhooks = await prisma.githubWebhook.findMany({ where: { guildId } })
    return webhooks.map(({ repository, channelId, events }) => ({ repository, channelId, events }))
  } catch {
    return []
  }
}

export async function findGithubWebhook(repository) {
  try {
    return await prisma.githubWebhook.findFirst({
      where: { repository: { equals: repository, mode: "insensitive" } },
    })
  } catch {
    return null
  }
}
