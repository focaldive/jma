"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Video = {
  id: string;
  youtubeId: string | null;
  title: string;
  description: string | null;
  artist: string | null;
  thumbnail: string | null;
  sourceType: string;
  youtubeUrl: string | null;
};

const YouTubeSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/videos");
      const result = await res.json();

      if (result.success) {
        // Filter only YouTube videos and videos with youtubeId
        const youtubeVideos = result.data.filter(
          (video: Video) => video.sourceType === "YOUTUBE" && video.youtubeId
        );
        setVideos(youtubeVideos);

        // Set first video as active if available
        if (youtubeVideos.length > 0) {
          setActiveVideo(youtubeVideos[0]);
        }
      } else {
        setError(result.message || "Failed to fetch videos");
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading videos...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No videos available yet.</p>
          </div>
        )}

        {/* Videos Display */}
        {!loading && !error && videos.length > 0 && activeVideo && (
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
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
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
                {activeVideo.artist && (
                  <p className="text-sm text-gray-600">{activeVideo.artist}</p>
                )}
                {activeVideo.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {activeVideo.description}
                  </p>
                )}
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
                              src={
                                video.thumbnail ||
                                `https://img.youtube.com/vi/${video.youtubeId}/0.jpg`
                              }
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
                            {video.artist && (
                              <p className="text-xs text-gray-600">
                                {video.artist}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </motion.div>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default YouTubeSection;
