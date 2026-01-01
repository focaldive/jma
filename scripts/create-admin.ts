/**
 * Script to create an admin user
 * Run with: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from "../app/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createAdminUser() {
  const email = "admin@example.com"; // Change this
  const password = "admin123"; // Change this
  const name = "Admin User";

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.adminUser.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        role: "ADMIN",
      },
    });

    console.log("Admin user created successfully:");
    console.log({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
