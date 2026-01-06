const { PrismaClient } = require("../app/generated/prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Checking for System Logs...");

  const logs = await prisma.systemLog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { adminUser: true },
  });

  if (logs.length === 0) {
    console.log(
      "No logs found yet. Try logging in or creating a user via the UI/API to generate logs."
    );
  } else {
    console.log(`Found ${logs.length} logs:`);
    logs.forEach((log) => {
      console.log(
        `[${log.createdAt.toISOString()}] ${log.action} - ${
          log.description
        } (User: ${log.adminUser ? log.adminUser.email : "None"})`
      );
    });
  }

  await prisma.$disconnect();
}

main().catch(console.error);
