"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

const projects = [
  {
    year: 2023,
    month: "January",
    description: "Education - Student",
    location: "Negombo",
    currency: "LKR",
    amount: 144000.0,
  },
  {
    year: 2023,
    month: "February",
    description: "City Boys Club",
    location: "Y.M.M.A., Puttalam",
    currency: "LKR",
    amount: 48000.0,
  },
  {
    year: 2023,
    month: "February",
    description: "Education - A-level Student",
    location: "Puttalam",
    currency: "LKR",
    amount: 60000.0,
  },
  {
    year: 2023,
    month: "February",
    description: "Education - A-level Student",
    location: "Puttalam",
    currency: "LKR",
    amount: 15000.0,
  },
  {
    year: 2023,
    month: "February",
    description: "Education - A-level Student",
    location: "Puttalam",
    currency: "LKR",
    amount: 15000.0,
  },
  {
    year: 2023,
    month: "February",
    description: "Education - University Student",
    location: "Puttalam",
    currency: "LKR",
    amount: 180000.0,
  },
  {
    year: 2023,
    month: "February",
    description: "Education - University Student",
    location: "Puttalam",
    currency: "LKR",
    amount: 180000.0,
  },
  {
    year: 2023,
    month: "February",
    description: "Education - University Student",
    location: "Puttalam",
    currency: "LKR",
    amount: 180000.0,
  },
  {
    year: 2023,
    month: "February",
    description: "Education - ZOTS Group of 96 Zahira College",
    location: "Colombo",
    currency: "LKR",
    amount: 50000.0,
  },
  {
    year: 2023,
    month: "February",
    description: "Disabled child",
    location: "Puttalam",
    currency: "LKR",
    amount: 36000.0,
  },
  {
    year: 2023,
    month: "February",
    description: "Cancer Patient",
    location: "Puttalam",
    currency: "LKR",
    amount: 36000.0,
  },
  {
    year: 2023,
    month: "February",
    description: "Turkey and Syria Earthquake",
    location: "",
    currency: "GBP",
    amount: 1000.0,
  },
  {
    year: 2023,
    month: "April",
    description: "Iftar",
    location: "East Ham",
    currency: "GBP",
    amount: 1338.12,
  },
  {
    year: 2023,
    month: "April",
    description: "Iftar",
    location: "Leicester",
    currency: "GBP",
    amount: 810.0,
  },
];

export function ProjectTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Complete list of projects and services for the year 2023
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project, i) => (
                <TableRow key={i}>
                  <TableCell>{project.month}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.location}</TableCell>
                  <TableCell>{project.currency}</TableCell>
                  <TableCell className="text-right">
                    {project.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
