"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Disability", value: 15, color: "#2563eb" },
  { name: "Education", value: 25, color: "#f97316" },
  { name: "Emergency Disaster", value: 30, color: "#3b82f6" },
  { name: "Fitra", value: 10, color: "#22c55e" },
  { name: "Housing and Sanitation", value: 8, color: "#eab308" },
  { name: "Sports", value: 5, color: "#1e40af" },
  { name: "Medical", value: 4, color: "#64748b" },
  { name: "Zakath", value: 3, color: "#94a3b8" },
];

export function ProjectChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Distribution of Projects and Services 2023</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
