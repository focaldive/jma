import React from "react";
import ProjectsPage from "@/components/projects/project-page";
import prisma from "@/lib/prisma";

export const revalidate = 3600; // Revalidate every hour

const Projects = async () => {
  // Fetch distinct years from projects
  const projects = await prisma.project.findMany({
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: {
      year: "desc",
    },
  });

  const years = projects.map((p) => p.year);

  const featuredProjects = await prisma.project.findMany({
    where: {
      isFeatured: true,
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  const janazaNotices = await prisma.janazaNotice.findMany({
    where: {
      isPublished: true,
      status: {
        not: "CANCELLED",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  // Calculate Impact Statistics
  const beneficiariesAgg = await prisma.project.aggregate({
    _sum: {
      beneficiaries: true,
    },
    where: {
      isPublished: true,
    },
  });

  const donationsAgg = await prisma.donation.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: "COMPLETED",
    },
  });

  const distinctCountries = await prisma.donation.findMany({
    where: {
      status: "COMPLETED",
      country: {
        not: null,
      },
    },
    distinct: ["country"],
    select: {
      country: true,
    },
  });

  const impactStats = {
    beneficiaries: beneficiariesAgg._sum.beneficiaries || 0,
    fundsRaised: donationsAgg._sum.amount
      ? donationsAgg._sum.amount.toNumber()
      : 0,
    countriesReached:
      distinctCountries.length > 0 ? distinctCountries.length : 0,
  };

  return (
    <main>
      <ProjectsPage
        years={years}
        featuredProjects={featuredProjects}
        janazaNotices={janazaNotices}
        impactStats={impactStats}
      />
    </main>
  );
};

export default Projects;
