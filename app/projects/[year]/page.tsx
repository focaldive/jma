"use client";

import { ProjectChart } from "../../components/projects/project-chart";
import { ProjectTable } from "../../components/projects/project-table";
import { ProjectGallery } from "../../components/projects/project-gallery";
import { SummaryCards } from "../../components/projects/summary-cards";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function YearProjectPage({
  params,
}: {
  params: { year: string };
}) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-20 lg:py-40 bg-gray-5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <div className="flex flex-col space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button variant="ghost" className="group mb-4" asChild>
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Projects
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
              Our Projects and Services During {params.year}
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              A comprehensive overview of our initiatives, their impact, and the
              communities we&apos;ve served throughout {params.year}.
            </p>
          </motion.div>
        </div>

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
              For memories and evidence... Its not possible without your
              support. <br />
              Please continue to support us to support our community and
              humanity.
            </p>
            <br />
            <ProjectGallery />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
