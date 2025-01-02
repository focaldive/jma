"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import YouTubeSection from "./youtube-section";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const images = [
  {
    src: "https://jaffnamuslimuk.org/wp-content/uploads/2016/11/2016-11-02-PHOTO-00000472.jpg",
    alt: "Gallery Image 1",
  },
  {
    src: "https://jaffnamuslimuk.org/wp-content/uploads/2016/11/2016-11-02-PHOTO-00000466.jpg ",
    alt: "Gallery Image 2",
  },
  {
    src: "https://jaffnamuslimuk.org/wp-content/uploads/2016/11/2016-11-02-PHOTO-00000475.jpg",
    alt: "Gallery Image 3",
  },
  {
    src: "https://jaffnamuslimuk.org/wp-content/uploads/2016/11/IMG_5234.jpg",
    alt: "Gallery Image 4",
  },
  {
    src: "https://jaffnamuslimuk.org/wp-content/uploads/2016/11/IMG_5240.jpg",
    alt: "Gallery Image 5",
  },
  {
    src: "https://jaffnamuslimuk.org/wp-content/uploads/2020/10/IMG-20201005-WA0010.jpg",
    alt: "Gallery Image 6",
  },
  {
    src: "https://jaffnamuslimuk.org/wp-content/uploads/2020/10/IMG-20201005-WA0009.jpg",
    alt: "Gallery Image 7",
  },
];

const GalleryPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId((prevId) =>
      prevId === null || prevId === 0 ? images.length - 1 : prevId - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId((prevId) =>
      prevId === null || prevId === images.length - 1 ? 0 : prevId + 1
    );
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-gray-100 mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-20 lg:py-40">
      <div className="space-y-8 text-center ">
        <motion.h1
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-6xl"
        >
          Gallery of JMF-UK
        </motion.h1>
        <motion.p
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-2xl mx-auto"
        >
          Explore our collection of memorable moments and events that showcase
          the vibrant community spirit of Jaffna Muslim Foundation UK.
        </motion.p>
      </div>
      <br />
      <br />
      <br />
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              layoutId={`card-${index}`}
              onClick={() => setSelectedId(index)}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
            >
              <div className="relative h-64 sm:h-80">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              layoutId={`card-${selectedId}`}
              className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full aspect-video">
                <Image
                  src={images[selectedId].src}
                  alt={images[selectedId].alt}
                  fill
                  priority
                  style={{ objectFit: "contain" }}
                />
              </div>
              <motion.button
                className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedId(null)}
              >
                <X size={24} />
              </motion.button>
              <motion.button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevious}
              >
                <ChevronLeft size={24} />
              </motion.button>
              <motion.button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
              >
                <ChevronRight size={24} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <YouTubeSection />
    </div>
  );
};

export default GalleryPage;
