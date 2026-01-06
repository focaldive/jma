import "dotenv/config";
import prisma from "@/lib/prisma";

const categories = [
  { name: "Education", color: "#FF6B6B", icon: "book" },
  { name: "Healthcare", color: "#4ECDC4", icon: "activity" },
  { name: "Emergency Relief", color: "#FFE66D", icon: "alert-triangle" },
  { name: "Community Development", color: "#1A535C", icon: "users" },
  { name: "Water & Sanitation", color: "#5591F5", icon: "droplet" },
];

async function main() {
  console.log("Seeding Categories...");

  // 1. Create Categories
  for (const cat of categories) {
    const existing = await prisma.projectCategory.findUnique({
      where: { name: cat.name },
    });

    if (!existing) {
      await prisma.projectCategory.create({
        data: cat,
      });
      console.log(`Created category: ${cat.name}`);
    } else {
      console.log(`Category exists: ${cat.name}`);
    }
  }

  // 2. Fetch all categories
  const allCategories = await prisma.projectCategory.findMany();

  // 3. Assign categories to projects that don't have one
  const projects = await prisma.project.findMany({
    where: { categoryId: null },
  });

  console.log(`Found ${projects.length} projects without category.`);

  for (const project of projects) {
    // Assign a random category
    const randomCat =
      allCategories[Math.floor(Math.random() * allCategories.length)];

    await prisma.project.update({
      where: { id: project.id },
      data: { categoryId: randomCat.id },
    });
    console.log(`Assigned ${randomCat.name} to project ${project.id}`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
