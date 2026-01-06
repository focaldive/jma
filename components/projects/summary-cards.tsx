"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LandPlot, Users, School, Heart } from "lucide-react";

interface SummaryCardsProps {
  totalLkr: string;
  totalGbp: string;
  projectCount: number;
  beneficiaries: string;
}

export function SummaryCards({
  totalLkr,
  totalGbp,
  projectCount,
  beneficiaries,
}: SummaryCardsProps) {
  const summaryItems = [
    {
      title: "Total Amount (LKR)",
      value: totalLkr,
      icon: LandPlot,
      color: "text-blue-500",
    },
    {
      title: "Total Amount (GBP)",
      value: totalGbp,
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Total Projects",
      value: projectCount,
      icon: School,
      color: "text-orange-500",
    },
    {
      title: "Beneficiaries",
      value: beneficiaries,
      icon: Heart,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
