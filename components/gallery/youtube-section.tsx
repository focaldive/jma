"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const videos = [
  {
    id: "44dC35GIQCk",
    title: "JMA UK Gathering 2022",
    artist: "Admin",
  },
  {
    id: "OqjkNbA8tro",
    title: "Fithra - Iggirikollawa",
    artist: "Shia LaBeouf",
  },
  {
    id: "BtgjD8nG6lE",
    title: "Emergency Crisis Relief 2022",
    artist: "Google Developers",
  },
];

const YouTubeSection = () => {
  const [activeVideo, setActiveVideo] = useState(videos[0]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <motion.h2
          className="mb-20 text-2xl text-center font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-6xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Featured Videos
        </motion.h2>
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Video Player Section */}
          <motion.div
            className="lg:w-2/3"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
              {/* Embed YouTube Iframe */}
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <motion.div
              className="mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {activeVideo.title}
              </h3>
              <p className="text-sm text-gray-600">{activeVideo.artist}</p>
            </motion.div>
          </motion.div>

          {/* Video List */}
          <motion.div
            className="lg:w-1/3"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h3 className="text-xl font-medium text-gray-900 mb-6">
              More Videos
            </h3>
            <ul className="space-y-4">
              <AnimatePresence>
                {videos.map((video) => (
                  <motion.li
                    key={video.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      onClick={() => setActiveVideo(video)}
                      className={`w-full text-left p-2 rounded-md transition-colors ${
                        activeVideo.id === video.id
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <div className="relative w-20 h-20 mr-3 overflow-hidden rounded-md">
                          <Image
                            src={`https://img.youtube.com/vi/${video.id}/0.jpg`}
                            alt={video.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 80px"
                            className="object-cover"
                            priority={activeVideo.id === video.id}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                            {video.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {video.artist}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default YouTubeSection;
