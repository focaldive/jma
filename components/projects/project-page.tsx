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
            className="bg-blue-800 text-primary-foreground rounded-lg py-16 shadow-lg"
          >
            {/* <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2> */}
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
            className="space-y-20"
          >
            <h2 className="text-5xl font-bold text-center">
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

          {/* Janaza Project Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-5xl font-bold">Janaza Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                Supporting our community during times of loss with dignified funeral services and assistance
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="lg:col-span-1"
              >
                <Card className="h-full bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                  <CardContent className="p-6 space-y-4">
                    <div className="bg-slate-800 text-white p-4 rounded-lg inline-flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">About Our Janaza Services</h3>
                    <p className="text-muted-foreground">
                      Our Janaza Project provides comprehensive support for bereaved families, including:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Funeral arrangement assistance</span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Transportation services</span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Burial coordination</span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Financial assistance for eligible families</span>
                      </li>
                    </ul>
                    <div className="pt-4">
                      <Link
                        href="/janaza-services"
                        className="inline-flex items-center text-primary font-medium hover:underline"
                      >
                        Learn more about our services
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="lg:col-span-2"
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Recent Janaza Notices</h3>
                      <Link
                        href="/janaza-notices"
                        className="text-sm text-primary hover:underline inline-flex items-center"
                      >
                        View all notices
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>

                    <div className="space-y-4">
                      {/* Notice 1 */}
                      <div className="border-b pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">Mohammed Ismail</h4>
                          <span className="text-xs bg-slate-100 px-2 py-1 rounded">3 days ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Janaza prayers will be held at Jaffna Grand Mosque on Friday, March 8th at 1:30 PM.
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mr-1"
                          >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          <span>Contact: Ismail Family (077-123-4567)</span>
                        </div>
                      </div>

                      {/* Notice 2 */}
                      <div className="border-b pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">Fatima Zahra</h4>
                          <span className="text-xs bg-slate-100 px-2 py-1 rounded">1 week ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Janaza prayers were held at Colombo Masjid on March 1st. May Allah grant her Jannah.
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mr-1"
                          >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          <span>Contact: Zahra Family (077-987-6543)</span>
                        </div>
                      </div>

                      {/* Notice 3 */}
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">Abdul Rahman</h4>
                          <span className="text-xs bg-slate-100 px-2 py-1 rounded">2 weeks ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Janaza prayers were held at Kandy Central Mosque on February 25th. May Allah have mercy on him.
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mr-1"
                          >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          <span>Contact: Rahman Family (077-456-7890)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 mr-2 text-primary"
                        >
                          <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.8a2 2 0 0 0 1.4-.6L12 4.6a2 2 0 0 1 1.4-.6h3.8a2 2 0 0 1 2 2v2.4Z"></path>
                          <path d="M12 10v6"></path>
                          <path d="M9 13h6"></path>
                        </svg>
                        Need Assistance?
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        For janaza services or to report a death in the community, please contact our 24/7 helpline.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href="tel:+94771234567"
                          className="inline-flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mr-2"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          Call Helpline
                        </Link>
                        <Link
                          href="/janaza-request"
                          className="inline-flex items-center justify-center bg-slate-100 text-slate-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mr-2"
                          >
                            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                            <path d="M3 9h18"></path>
                            <path d="M9 21V9"></path>
                          </svg>
                          Request Service
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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
