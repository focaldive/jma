"use client"

import { motion } from "framer-motion"

export function Header() {
    return (
        <div className="text-center space-y-10 px-4 sm:px-6 max-w-3xl mx-auto">
            <motion.h1
                className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                Make a Donation
            </motion.h1>
            <motion.p
                className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Your generosity can make a real difference. Every donation helps us support those in need and create lasting
                positive change in our community. Choose how you'd like to contribute today.
            </motion.p>
        </div>
    )
}

