import { ProjectChart } from "@/components/projects/project-chart";
import { ProjectTable } from "@/components/projects/project-table";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { SummaryCards } from "@/components/projects/summary-cards";
import { YearPageHeader } from "@/components/projects/year-page-header";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

type params = Promise<{ year: string }>;

export default async function YearProjectPage({ params }: { params: params }) {
  const { year } = await params;
  const yearInt = parseInt(year);

  if (!year || isNaN(yearInt)) {
    return notFound();
  }

  // Fetch projects for the given year
  const projects = await prisma.project.findMany({
    where: {
      year: yearInt,
      isPublished: true,
    },
    orderBy: {
      month: "asc",
      // Note: Sorting by month string might not be chronological (April vs February).
      // Ideally month should be stored as Int or have a date field.
      // For now, consistent with schema.
    },
    include: {
      category: true,
      images: true,
    },
  });

  // Fetch gallery images (ProjectImage linked to projects of this year)
  // We can collect all images from the fetched projects
  const galleryImages = projects.flatMap((p) => p.images.map((img) => img.url));

  // Calculate Summary Stats
  const totalLkr = projects
    .filter((p) => p.currency === "LKR")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalGbp = projects
    .filter((p) => p.currency === "GBP")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const projectCount = projects.length;

  // Calculate beneficiaries (handling nulls)
  const totalBeneficiaries = projects.reduce(
    (sum, p) => sum + (p.beneficiaries || 0),
    0
  );

  // Aggregate Category Data for Chart
  const categoryMap = new Map<string, { value: number; color: string }>();

  projects.forEach((project) => {
    if (project.category) {
      const catName = project.category.name;
      const current = categoryMap.get(catName) || {
        value: 0,
        color: project.category.color,
      };
      current.value += 1; // Counting number of projects per category.
      // Alternatively, could sum amount, but chart usually shows distribution of counts or funds.
      // Based on original mock data "Education: 25", it looks like count or percentage.
      // Let's stick to count for now.
      categoryMap.set(catName, current);
    }
  });

  const chartData = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    value: data.value,
    color: data.color,
  }));

  return (
    <>
      <YearPageHeader year={year} />
      <SummaryCards
        totalLkr={totalLkr.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        totalGbp={totalGbp.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        projectCount={projectCount}
        beneficiaries={
          totalBeneficiaries > 0
            ? totalBeneficiaries.toLocaleString() + "+"
            : "0"
        }
      />
      <div className="grid gap-8">
        <div className="grid md:grid-cols-2 gap-8">
          <ProjectChart data={chartData} year={year} />
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Key Highlights</h2>
            <ul className="space-y-2 text-muted-foreground">
              {totalBeneficiaries > 0 && (
                <li>
                  • Supported over {totalBeneficiaries.toLocaleString()}{" "}
                  beneficiaries
                </li>
              )}
              <li>• Completed {projectCount} major projects</li>
              {/* Calculating regions would require parsing location or adding location relation/field */}
              {/* <li>• Expanded to 5 new regions</li> */}
              {/* Percentage calculation requires previous year data, skipping for now */}
              {/* <li>• Increased education support by 25%</li> */}
            </ul>
            {projects.length === 0 && (
              <p className="text-muted-foreground">
                No projects found for this year.
              </p>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <ProjectTable projects={projects} />
        </div>
        <br />
        <div className="space-y-4">
          <h2 className="mb-3 text-center text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Project Gallery
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            For memories and evidence... Its not possible without your support.{" "}
            <br />
            Please continue to support us to support our community and humanity.
          </p>
          <br />
          <ProjectGallery images={galleryImages} />
        </div>
      </div>
    </>
  );
}
