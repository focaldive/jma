"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function YearPageHeader({ year }: { year: string }) {
  return (
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
          Our Projects and Services During {year}
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          A comprehensive overview of our initiatives, their impact, and the
          communities we&apos;ve served throughout {year}.
        </p>
      </motion.div>
    </div>
  );
}
