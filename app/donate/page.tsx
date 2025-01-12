"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/donate/header";
import { DonationForm } from "@/components/donate/donation-form";
import { DonationInfo } from "@/components/donate/donation-info";
import { DonorForm } from "@/components/donate/donor-form";
import { PromiseCard } from "@/components/donate/promotion";
import { NewsletterSignup } from "@/components/donate/newsletter";

export default function DonationPage() {
  return (
    <div className="min-h-screen bg-gray-50 mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-20 lg:py-40">
      <motion.div
        className="max-w-4xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
        <br />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DonationForm />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <DonationInfo />
            <DonorForm />
            <PromiseCard />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <NewsletterSignup />
        </motion.div>
      </motion.div>
    </div>
  );
}

