import { motion } from "framer-motion";

export function Header() {
    return (
        <div className="text-center space-y-4 px-4 sm:px-6">
            <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                Make a Donation
            </motion.h1>
            <motion.p
                className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Your generosity can make a real difference. Every donation helps us
                support those in need and create lasting positive change in our
                community.
            </motion.p>
        </div>
    );
}

