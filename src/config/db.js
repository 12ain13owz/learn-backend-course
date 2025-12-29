import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

const connectDB = async () => {
  try {
    // Connect to the database
    await prisma.$connect()
    console.log('Database connected vis Prisma')

    // Test the database connection
    await prisma.$queryRaw`SELECT 1 AS connection_test`
    console.log('Database connection test query succeeded ✅')
  } catch (error) {
    console.error(`Database connection error: ${error.message}`)
    process.exit(1)
  }
}

const disconnectDB = async () => {
  await prisma.$disconnect()
}

export { prisma, connectDB, disconnectDB }
