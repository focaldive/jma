"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function WaterInitiative() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
          alt="Clean Water Initiative"
          layout="fill"
          className="object-cover brightness-75"
          priority
        />
        <div className="relative text-center text-white px-6">
          <motion.h1
            className="text-5xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Clean Water Initiative
          </motion.h1>
          <motion.p
            className="mt-4 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Providing safe drinking water to underserved communities worldwide .
          </motion.p>
          <Button className="mt-6 bg-teal-500 hover:bg-teal-600 px-6 py-3 text-lg rounded-lg" onClick={() => window.location.href = "/donate"}>
            Donate Now
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-gray-800">Why It Matters</h2>
        <p className="mt-4 text-lg text-gray-600">
          Millions lack access to clean drinking water. This crisis affects not only health but also education, economic development, and overall quality of life. Contaminated water and poor sanitation are linked to the transmission of diseases such as cholera, diarrhea, dysentery, hepatitis A, typhoid, and polio. According to the World Health Organization, over 2 billion people live in water-stressed countries, and the situation is expected to worsen with climate change and population growth.
        </p>
        <p className="mt-4 text-lg text-gray-600">
          Access to clean water is a fundamental human right and a critical component of sustainable development. It is essential for drinking, cooking, personal hygiene, and agriculture. Without it, communities are trapped in a cycle of poverty and disease. Women and children are often the most affected, as they are typically responsible for collecting water, which can take hours each day and prevent them from attending school or working.
        </p>
        <p className="mt-4 text-lg text-gray-600">
          Your support helps provide sustainable water solutions and save lives. By donating to our Clean Water Initiative, you are contributing to the construction of wells, the installation of rainwater harvesting systems, and the implementation of water purification technologies. These solutions are designed to be long-lasting and environmentally friendly, ensuring that communities have reliable access to clean water for years to come.
        </p>
        <p className="mt-4 text-lg text-gray-600">
          In addition to providing clean water, our initiative focuses on education and community engagement. We work with local leaders to promote hygiene practices and train community members to maintain and repair water systems. This empowers communities to take ownership of their water resources and ensures the sustainability of our projects.
        </p>
        <p className="mt-4 text-lg text-gray-600">
          The impact of clean water is profound. It reduces the incidence of waterborne diseases, improves health outcomes, and allows children to attend school regularly. It also frees up time for women to pursue economic opportunities, contributing to the overall development and prosperity of the community. Clean water is not just a necessity; it is a catalyst for change.
        </p>
        <p className="mt-4 text-lg text-gray-600">
          We believe that everyone deserves access to clean water, and with your help, we can make this a reality. Join us in our mission to provide safe drinking water to underserved communities worldwide. Together, we can create a healthier, more equitable world for all.
        </p>
        <div className="flex justify-center mt-6">
          <Button className="p-3 rounded-full flex items-center justify-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 15l7-7 7 7" />
            </svg>
          </Button>
        </div>
      </section>
    </main>
  );
}
