"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HealthcareProgram() {
  return (
    <main className="min-h-screen bg-gray-100">
      <section className="relative w-full h-[80vh] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1617450365226-9bf28c04e130?q=80&w=2070&auto=format&fit=crop"
          alt="Healthcare Access"
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
            Healthcare Access
          </motion.h1>
          <motion.p
            className="mt-4 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Bringing essential medical care to those who need it most.
          </motion.p>
          <Button
            className="mt-6 bg-red-500 hover:bg-red-600 px-6 py-3 text-lg rounded-lg"
            onClick={() => window.location.href = "/donate"}
          >
            Support Healthcare
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-gray-800">Healthcare Crisis</h2>
        <div className="mt-4 text-lg text-gray-600 space-y-6">
          <p>
            Millions of people worldwide continue to lack access to basic healthcare services, creating a devastating humanitarian crisis that affects communities across the globe. In both rural and urban areas, countless individuals face significant barriers to accessing essential medical care, leading to preventable illnesses, untreated conditions, and unnecessary suffering.
          </p>
          <p>
            The healthcare crisis is particularly severe in underserved communities, where infrastructure limitations, economic constraints, and geographical isolation combine to create significant challenges. Many families must travel hours or even days to reach the nearest medical facility, often facing impossible choices between seeking care and maintaining their livelihoods.
          </p>
          <p>
            Through our mobile clinic initiative, we&apos;re working to bridge this critical gap in healthcare access. Our team of dedicated medical professionals travels to remote and underserved areas, providing essential services including preventive care, vaccinations, maternal health services, and treatment for chronic conditions. These mobile units serve as lifelines for communities that would otherwise have no access to medical care.
          </p>
          <p>
            Your donation directly supports these vital healthcare services. With your help, we can:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Deploy additional mobile medical units to reach more communities</li>
            <li>Supply essential medications and medical equipment</li>
            <li>Provide training for local healthcare workers</li>
            <li>Implement preventive healthcare programs</li>
            <li>Support emergency medical response capabilities</li>
          </ul>
          <p>
            The impact of your contribution extends far beyond immediate medical care. By supporting healthcare access, you&apos;re helping to build stronger, healthier communities. Improved healthcare leads to better educational outcomes, increased economic productivity, and enhanced quality of life for entire families and communities.
          </p>
          <p>
            Join us in our mission to ensure that quality healthcare is not a privilege but a fundamental right accessible to all. Every contribution, regardless of size, helps us move closer to this vital goal. Together, we can create lasting change and build a healthier future for generations to come.
          </p>
        </div>
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
