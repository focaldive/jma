"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const images = [
  "https://jaffnamuslimuk.org/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-31-at-16.44.32-3.jpeg",
  "https://jaffnamuslimuk.org/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-31-at-16.44.32-2.jpeg",
  "https://jaffnamuslimuk.org/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-31-at-16.42.51-2.jpeg",
  "https://jaffnamuslimuk.org/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-31-at-16.39.37-2.jpeg",
  "https://jaffnamuslimuk.org/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-31-at-16.38.09.jpeg",
  "https://jaffnamuslimuk.org/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-31-at-16.36.19.jpeg",
];

export function ProjectGallery() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {images.map((image, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <Image
                  src={image}
                  alt={`Project image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
