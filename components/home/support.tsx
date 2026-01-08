"use client";

import { DollarSign, Handshake } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Support() {
  const supportOptions = [
    {
      icon: DollarSign,
      title: "Make a Donation",
      description: "Support our community initiatives and programs",
      buttonText: "Donate Now",
      href: "/donate",
      gradient: "from-teal-500 to-teal-600",
    },
    {
      icon: Handshake,
      title: "Become a Partner",
      description: "Collaborate with us to make a lasting impact",
      buttonText: "Partner With Us",
      href: "/partner",
      gradient: "from-blue-500 to-blue-600",
    },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-4 tracking-tighter">
            Make a Difference with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
              Your Support
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Your contribution helps us continue our mission to serve and uplift
            the community
          </p>
        </motion.div>

        {/* Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {supportOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                {/* Icon */}
                <div className="mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12  md:w-12 md:h-12 bg-gradient-to-br ${option.gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <option.icon className="w-6 h-6 md:w-6 md:h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h3 className="text-2xl md:text-3xl font-medium text-gray-900 mb-3">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                    {option.description}
                  </p>
                </div>

                {/* Button */}
                <Link href={option.href}>
                  <button
                    className={`w-full bg-gradient-to-r ${option.gradient} text-white font-medium p-4 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 text-base md:text-lg`}
                  >
                    {option.buttonText} →
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-sm md:text-base text-gray-500">
            Have questions?{" "}
            <Link
              href="/contact"
              className="text-teal-600 hover:text-teal-700 font-semibold underline decoration-2 underline-offset-4"
            >
              Contact us
            </Link>{" "}
            to learn more about how you can help
          </p>
        </motion.div>
      </div>
    </section>
  );
}
