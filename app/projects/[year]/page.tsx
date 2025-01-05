import { ProjectChart } from "../../components/projects/project-chart";
import { ProjectTable } from "../../components/projects/project-table";
import { ProjectGallery } from "../../components/projects/project-gallery";
import { SummaryCards } from "../../components/projects/summary-cards";
import { YearPageHeader } from "@/components/projects/year-page-header";
import { notFound } from "next/navigation";

type params = Promise<{ year: string }>;

export default async function YearProjectPage({ params }: { params: params }) {
  const { year } = await params;

  if (!year) {
    return notFound();
  }

  return (
    <>
      <YearPageHeader year={year} />
      <SummaryCards />
      <div className="grid gap-8">
        <div className="grid md:grid-cols-2 gap-8">
          <ProjectChart />
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Key Highlights</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Supported over 1,200 beneficiaries</li>
              <li>• Completed 45 major projects</li>
              <li>• Expanded to 5 new regions</li>
              <li>• Increased education support by 25%</li>
            </ul>
          </div>
        </div>

        <div className="overflow-x-auto">
          <ProjectTable />
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
          <ProjectGallery />
        </div>
      </div>
    </>
  );
}
