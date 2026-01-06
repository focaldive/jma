import "dotenv/config";
import prisma from "@/lib/prisma";

async function main() {
  console.log("Checking Project Data...");

  const categories = await prisma.projectCategory.findMany();
  console.log(`Total categories: ${categories.length}`);
  console.log("Categories:", JSON.stringify(categories, null, 2));

  const projects = await prisma.project.findMany({
    include: {
      category: true,
    },
  });

  console.log(`Total projects: ${projects.length}`);

  if (projects.length === 0) {
    console.log("No projects found.");
    return;
  }

  const byYear: Record<
    number,
    { total: number; withCategory: number; categories: Record<string, number> }
  > = {};

  projects.forEach((p) => {
    const year = p.year;
    if (!byYear[year])
      byYear[year] = { total: 0, withCategory: 0, categories: {} };
    byYear[year].total++;
    if (p.category) {
      byYear[year].withCategory++;
      const catName = p.category.name;
      byYear[year].categories[catName] =
        (byYear[year].categories[catName] || 0) + 1;
    }
  });

  console.log("Projects by Year:", JSON.stringify(byYear, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
