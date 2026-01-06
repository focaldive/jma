const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../app/generated/prisma/client");
require("dotenv").config({ path: ".env" });

async function main() {
  console.log("Initializing Prisma Client...");

  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Creating a PERMANENT log entry...");
    const log = await prisma.systemLog.create({
      data: {
        action: "Debug",
        resource: "System",
        description: "This is a permanent test log to verify display",
        isSecurityEvent: false,
        createdAt: new Date(),
      },
    });
    console.log("✅ Log created successfully:", log.id);
    console.log("Please refresh the Activity Logs page in the browser.");
  } catch (e) {
    console.error("❌ Error creating log:", e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
