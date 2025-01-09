"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Users, Heart, Globe } from "lucide-react";
import Image from "next/image";

const years = [2023, 2022, 2021, 2020];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stats = [
  { icon: Users, value: "10,000+", label: "People Helped" },
  { icon: Heart, value: "£500,000+", label: "Funds Raised" },
  { icon: Globe, value: "20+", label: "Countries Reached" },
];

const featuredProjects = [
  {
    title: "Education Support",
    description:
      "Providing scholarships and educational resources to underprivileged students.",
    image:
      "https://media.istockphoto.com/id/1141695665/photo/a-difficult-moment-during-a-breakout-session.jpg?s=612x612&w=0&k=20&c=vkSfclzckAp6Jihj1-mXU1A-awZoaMqniRDKZjs6diY=",
  },
  {
    title: "Healthcare Initiatives",
    description:
      "Organizing medical camps and providing essential healthcare services.",
    image:
      "https://media.istockphoto.com/id/1586911323/photo/close-up-of-african-woman-hands-holding-red-heart-in-solidarity.jpg?s=612x612&w=0&k=20&c=of0vz5Ddd-BPWrbUy1g51hzBD8qf842zwPj-7VR4cpU=",
  },
  {
    title: "Community Development",
    description:
      "Building infrastructure and supporting local businesses in Jaffna.",
    image:
      "https://media.istockphoto.com/id/2062046492/photo/cul-de-sac-street-dead-end-at-sunset-and-private-residential-houses-in-rural-suburban-sprawl.jpg?s=612x612&w=0&k=20&c=R312WHXXQ5ZWtCw9hrgOvbFC0UNjDwaKK72yoQ-YnoQ=",
  },
];

export default function ProjectsPage() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-20 lg:py-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-24"
        >
          {/* Hero Section */}
          <div className="space-y-8 text-center">
            <motion.h1
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-6xl"
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

          {/* Years Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {/* Impact Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-primary text-primary-foreground rounded-lg p-8 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-4xl font-bold mb-2">{stat.value}</p>
                  <p className="text-lg">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Featured Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-center">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join us in making a difference. Your support can help us reach
              more communities and create lasting impact.
            </p>
            <Link
              href="/donate"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors"
            >
              Donate Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
