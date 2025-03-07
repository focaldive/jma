"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  HeartHandshake,
  Activity,
  Home,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const stats = [
  { icon: Users, value: "20+", label: "Years serving the community" },
  { icon: HeartHandshake, value: "200+", label: "Projects & Services" },
  { icon: Activity, value: "20+", label: "Medical supports" },
  { icon: Home, value: "3000+", label: "Families benefited" },
];

const services = [
  "Medical & Healthcare",
  "Food & Water solution",
  "Education",
  "Sustainable livelihoods",
  "Orphans and children's",
  "Emergency Relief",
  "Zakat",
  "Qurbani & Fitra",
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="space-y-8 text-center mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-20 lg:py-40">
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-6xl"
        >
          Who We Are?
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-2xl mx-auto"
        >
          Empowering and supporting the Jaffna Muslim community since 2002
          through humanitarian aid and sustainable development
        </motion.p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 space-y-24">
        {/* Introduction */}
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Jaffna Muslim Association – UK
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2002, Jaffna Muslim Association is a non-profit charity
              organisation created to help the people who were forcibly
              displaced from the town of Jaffna in Sri Lanka in 1990.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We focus on providing financial help for widows, education for
              children, medical help for those who need it and build buildings
              necessary for the community.
            </p>
          </div>
          <motion.div
            className="relative h-[400px] rounded-lg overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="https://media.istockphoto.com/id/2162383464/photo/top-view-of-a-a-heart-shape-of-people-showing-unity-and-teamwork.jpg?s=612x612&w=0&k=20&c=uKHuYCRvSXCavfkpvT97k_g1ZM33phDT5zu1UZQBTlY="
              alt="Community Support"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-none">
              <CardContent className="p-6 text-center space-y-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <stat.icon className="w-8 h-8 mx-auto text-blue-600" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Services */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            What We Do
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="group relative p-6 bg-gray-50 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                whileHover={{ y: -5 }}
              >
                <h3 className="font-medium text-gray-900 group-hover:text-white">
                  {service}
                </h3>
                <ArrowRight className="absolute bottom-4 right-4 w-5 h-5 text-gray-400 group-hover:text-white" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bank Details */}
        <motion.div
          className="max-w-lg mx-auto text-center space-y-10 bg-gray-50 p-8 rounded-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-xl font-semibold text-gray-900">
            Our Bank Details
          </h3>
          <div className="space-y-2 text-gray-600">
            <p>Jaffna Muslim Association - UK</p>
            <p>Lloyds Bank</p>
            <p>Account Number: 00390943</p>
            <p>Sort Code: 30-94-66</p>
          </div>
        </motion.div>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}
