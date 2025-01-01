"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const years = [2023, 2022, 2021, 2020];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-20 lg:py-40 bg-gray-5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <div className="space-y-4 text-center">
          <motion.h1
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mb-3 text-2xl font-bold tracking-light sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Our Projects and Services
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Explore our yearly initiatives and their impact on communities
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {years.map((year, index) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/projects/${year}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{year}</h2>
                      <p className="text-sm text-muted-foreground">
                        View projects
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
