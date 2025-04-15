import prisma from "../db/prismaClient"

// Get points for a user in a guild
export async function getUserPoints(guildId, userId) {
  try {
    const userPoints = await prisma.userPoints.findUnique({
      where: {
        guildId_userId: {
          guildId,
          userId,
        },
      },
    })

    return userPoints?.points || 0
  } catch (error) {
    console.error("Error getting user points:", error)
    return 0
  }
}

// Rest of the file remains the same...
