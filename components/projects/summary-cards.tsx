"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LandPlot, Users, School, Heart } from "lucide-react";

const summaryItems = [
  {
    title: "Total Amount (LKR)",
    value: "7,846,356.00",
    icon: LandPlot,
    color: "text-blue-500",
  },
  {
    title: "Total Amount (GBP)",
    value: "3,848.12",
    icon: Users,
    color: "text-green-500",
  },
  {
    title: "Total Projects",
    value: "45",
    icon: School,
    color: "text-orange-500",
  },
  {
    title: "Beneficiaries",
    value: "1,200+",
    icon: Heart,
    color: "text-red-500",
  },
];

export function SummaryCards() {
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
