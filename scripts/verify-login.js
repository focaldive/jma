const { PrismaClient } = require("../app/generated/prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const email = `login.test.${Date.now()}@example.com`;
  const password = "testLogin123";

  console.log(`Creating test user: ${email}`);

  // 1. Create a user
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.adminUser.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name: "Login Tester",
        role: "VIEWER",
        isActive: true,
      },
    });

    // 2. Simulate Login (User Fetch + Compare)
    console.log("Simulating Login...");

    const user = await prisma.adminUser.findUnique({ where: { email } });

    if (!user) {
      console.error("FAIL: User not found in DB");
      return;
    }

    if (!user.isActive) {
      console.error("FAIL: User is inactive");
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (valid) {
      console.log("SUCCESS: Password matches, login logic valid.");
    } else {
      console.error("FAIL: Password mismatch.");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // Clean up
    try {
      await prisma.adminUser.delete({ where: { email } });
    } catch (e) {}
    await prisma.$disconnect();
  }
}

main();
