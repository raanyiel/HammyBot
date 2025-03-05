const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Setting up database...')
  
  // Create tables if they don't exist
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "LoggingChannel" (
      "id" TEXT NOT NULL,
      "guildId" TEXT NOT NULL,
      "channelId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "LoggingChannel_pkey" PRIMARY KEY ("id")
    );
    
    CREATE TABLE IF NOT EXISTS "VerificationRole" (
      "id" TEXT NOT NULL,
      "guildId" TEXT NOT NULL,
      "roleId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "VerificationRole_pkey" PRIMARY KEY ("id")
    );
    
    CREATE TABLE IF NOT EXISTS "GithubWebhook" (
      "id" TEXT NOT NULL,
      "guildId" TEXT NOT NULL,
      "repository" TEXT NOT NULL,
      "channelId" TEXT NOT NULL,
      "events" TEXT NOT NULL DEFAULT 'all',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "GithubWebhook_pkey" PRIMARY KEY ("id")
    );
  `
  
  // Create unique constraints
  await prisma.$executeRaw`
    CREATE UNIQUE INDEX IF NOT EXISTS "LoggingChannel_guildId_key" ON "LoggingChannel"("guildId");
    CREATE UNIQUE INDEX IF NOT EXISTS "VerificationRole_guildId_key" ON "VerificationRole"("guildId");
    CREATE UNIQUE INDEX IF NOT EXISTS "GithubWebhook_guildId_repository_key" ON "GithubWebhook"("guildId", "repository");
  `
  
  console.log('Database setup complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
