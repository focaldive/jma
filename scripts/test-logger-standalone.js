const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../app/generated/prisma/client");
require("dotenv").config({ path: ".env" });

async function main() {
  console.log("Initializing Prisma Client with Adapter...");
  console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);

  // Setup adapter just like lib/prisma.ts
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Checking if systemLog model exists on client...");
    if (prisma.systemLog) {
      console.log("✅ prisma.systemLog exists.");
    } else {
      console.error("❌ prisma.systemLog is UNDEFINED.");
      return;
    }

    console.log("Fetching logs...");
    const logs = await prisma.systemLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { adminUser: true },
    });

    console.log(`✅ Found ${logs.length} logs.`);
    logs.forEach((l) => {
      console.log(
        `- [${l.createdAt.toISOString()}] ${l.action}: ${
          l.description
        } (User: ${l.adminUser?.email || "None"})`
      );
    });
  } catch (e) {
    console.error("❌ Error during test:", e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
