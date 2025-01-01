"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square max-w-2xl mx-auto lg:mx-0"
          >
            <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative w-full h-full bg-[#e8f4ff] flex items-center justify-center p-8">
                <Image
                  src="https://jaffnamuslimuk.org/wp-content/uploads/2013/10/Fitra-Post.jpg"
                  alt="Additional Image"
                  layout="fill"
                  objectFit="cover"
                  className="mx-auto"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:pl-8"
          >
            <div className="space-y-8 max-w-2xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-8 text-2xl capitalize font-bold tracking-tight sm:text-3xl md:mb-12 md:text-4xl lg:text-5xl"
              >
                Starting a charity isn&apos;t easy...
                <span className="block">But we managed it.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg text-gray-600 leading-relaxed"
              >
                Jaffna Muslim Association focuses on providing help to this
                community in Sri Lanka- we have provided financial help for
                widows, education for children, medical help (funding
                operations, treatment etc.) for those who need it, built
                buildings necessary to the community (i.e.: Masjids, graveyards
                etc.) – we have also had an emergency appeal for the victims of
                the 2004 Boxing Day Tsunami by collecting money for those
                affected.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link href="/about">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-6 rounded-lg text-lg transition-all duration-200 hover:shadow-lg"
                  >
                    Know More
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
