"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Briefcase, Users, Handshake, DollarSign } from "lucide-react";

const projects = [
  {
    title: "Youth Education",
    description:
      "Empowering the next generation through quality education and mentorship programs.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8eW91dGglMjBlZHVjYXRpb258ZW58MHwwfDB8fHwy",
  },
  {
    title: "Community Support",
    description:
      "Building stronger communities through outreach and support services.",
    image:
      "https://images.unsplash.com/photo-1728322150375-d6a2accce6d9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tbXVuaXR5JTIwc3VwcG9ydHxlbnwwfDB8MHx8fDI%3D",
  },
  {
    title: "Cultural Programs",
    description:
      "Preserving and celebrating our rich cultural heritage through various initiatives.",
    image:
      "https://images.unsplash.com/photo-1723833651274-cf1a94c398be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGN1bHR1cmFsfGVufDB8MHwwfHx8Mg%3D%3D",
  },
];

const impactStats = [
  {
    icon: Briefcase,
    value: "50+",
    label: "Projects Completed",
    description: "Successfully delivered initiatives",
  },
  {
    icon: Users,
    value: "10K+",
    label: "Lives Impacted",
    description: "Community members helped",
  },
  {
    icon: Handshake,
    value: "25+",
    label: "Community Partners",
    description: "Organizations we work with",
  },
  {
    icon: DollarSign,
    value: "$250K+",
    label: "Donations",
    description: "Total donations received",
  },
];

export function Projects() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-14">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14 lg:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-black mb-4">
            Our <span className="">Projects</span>
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto">
            Discover the initiatives making a real difference in communities
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              /* Added padding-bottom to allow the overlapping box space at the bottom */
              className="group relative pb-12"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lg">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Floating Content Box */}
              <div className="absolute bottom-0 my-0 left-4 right-4 bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-3">
                <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
                  {project.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Donation Button */}
                <Link
                  href={`/donate?project=${encodeURIComponent(project.title)}`}
                  className="block pt-2"
                >
                  <Button className="w-fit px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-5 text-sm font-bold transition-all duration-300">
                    Donation Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Impact Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 md:mt-20 lg:mt-24"
        >
          <div className="text-center mb-10 md:mb-12">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Our Impact
            </h3>
            <p className="text-gray-600 text-base md:text-lg">
              Making a measurable difference in our community
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200/50 hover:border-blue-300 h-full">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>

                  <div className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-3">
                    {stat.value}
                  </div>
                  <div className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
