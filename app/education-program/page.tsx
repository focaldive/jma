"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function EducationProgram() {
  return (
    <main className="min-h-screen bg-gray-100">
      <section className="relative w-full h-[80vh] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop"
          alt="Education for All"
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
            Education for All
          </motion.h1>
          <motion.p
            className="mt-4 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Empowering the next generation through access to quality education.
          </motion.p>
          <Button className="mt-6 bg-blue-500 hover:bg-blue-600 px-6 py-3 text-lg rounded-lg" onClick={() => window.location.href = "/donate"}>
            Support Education
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-gray-800">Why Education?</h2>
        <div className="mt-4 space-y-6 text-gray-600">
          <p className="text-lg">
            Education is the fundamental cornerstone of human progress and societal development. It serves as the most powerful catalyst for breaking the persistent cycle of poverty and creating lasting positive change in communities worldwide. Through quality education, individuals gain not just knowledge, but essential life skills, critical thinking abilities, and the confidence to pursue their dreams.
          </p>
          <p className="text-lg">
            In today&apos;s rapidly evolving global economy, education has become more crucial than ever. It equips people with the tools they need to adapt to changing circumstances, embrace technological advancements, and participate meaningfully in the digital age. Studies consistently show that educated individuals have better employment prospects, higher earning potential, and improved health outcomes.
          </p>
          <p className="text-lg">
            Beyond individual benefits, education creates a ripple effect throughout entire communities. When more people have access to quality education, we see improvements in public health, economic stability, gender equality, and social cohesion. Educated parents are more likely to prioritize their children&apos;s education, creating a positive intergenerational cycle that gradually lifts families out of poverty.
          </p>
          <p className="text-lg">
            Furthermore, education promotes innovation, entrepreneurship, and sustainable development. It enables communities to develop local solutions to local problems, fostering self-reliance and resilience. In an increasingly interconnected world, education also builds bridges between cultures, promoting understanding, tolerance, and peaceful coexistence.
          </p>
          <p className="text-lg">
            However, millions of children and young people worldwide still lack access to quality education due to economic, social, and geographical barriers. By investing in education, we invest in humanity&apos;s collective future, ensuring that every individual has the opportunity to reach their full potential and contribute to the betterment of society.
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
