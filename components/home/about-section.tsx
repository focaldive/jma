"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* About Us Badge */}
        <div className="text-sm md:text-base lg:text-xl font-medium bg-green-300 text-green-700 rounded-full w-28 md:w-32 lg:w-36 px-3 md:px-4 py-1.5 md:py-2 mb-6 md:mb-8 text-center">
          About Us
        </div>

        {/* Header Section */}
        <div className="flex flex-col space-y-6 mb-8 md:mb-12 lg:mb-16">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
            >
              Starting a charity isn&apos;t easy...
              <span className="block mt-2">But we managed it.</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex-shrink-0"
            >
              <Link href="/about">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 md:px-8 py-4 md:py-6 rounded-lg text-base md:text-lg transition-all duration-200 hover:shadow-lg w-full md:w-auto"
                >
                  Know More
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10 lg:gap-12">
          {/* Column 1: Description Top, Image Bottom */}
          <div className="flex-1 grid gap-6 md:gap-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base md:text-lg text-gray-600 leading-relaxed"
            >
              Jaffna Muslim Association focuses on providing help to this
              community in Sri Lanka- we have provided financial help for
              widows, education for children, medical help (funding operations,
              treatment etc.) for those who need it, built buildings necessary
              to the community (i.e.: Masjids, graveyards etc.) – we have also
              had an emergency appeal for the victims of the 2004 Boxing Day
              Tsunami by collecting money for those affected.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square w-full"
            >
              <div className="absolute inset-0 bg-white rounded-3xl md:rounded-[40px] lg:rounded-[50px] shadow-2xl overflow-hidden">
                <div className="relative w-full h-full bg-[#e8f4ff] flex items-center justify-center p-4 md:p-6 lg:p-8">
                  <Image
                    src="https://jaffnamuslimuk.org/wp-content/uploads/2013/10/Fitra-Post.jpg"
                    alt="Jaffna Muslim Association Community Work"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Column 2: Image Top, Description Bottom */}
          <div className="flex-1 grid gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square w-full"
            >
              <div className="absolute inset-0 bg-white rounded-3xl md:rounded-[40px] lg:rounded-[50px] shadow-2xl overflow-hidden">
                <div className="relative w-full h-full bg-[#e8f4ff] flex items-center justify-center p-4 md:p-6 lg:p-8">
                  <Image
                    src="https://jaffnamuslimuk.org/wp-content/uploads/2013/10/Fitra-Post.jpg"
                    alt="Jaffna Muslim Association Impact"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  />
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base md:text-lg text-gray-600 leading-relaxed"
            >
              Jaffna Muslim Association focuses on providing help to this
              community in Sri Lanka- we have provided financial help for
              widows, education for children, medical help (funding operations,
              treatment etc.) for those who need it, built buildings necessary
              to the community (i.e.: Masjids, graveyards etc.) – we have also
              had an emergency appeal for the victims of the 2004 Boxing Day
              Tsunami by collecting money for those affected.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
