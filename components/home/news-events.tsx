"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Sample data
const featuredNews = {
  id: 1,
  title: "Annual Community Gathering 2024",
  date: "January 15, 2024",
  description:
    "Join us for our biggest community event of the year. Experience inspiring talks, cultural performances, and connect with fellow community members. This year's theme focuses on unity and building stronger bonds within our community.",
  image:
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80",
  link: "/news/annual-gathering-2024",
};

const newsList = [
  {
    id: 2,
    title: "Eid Charity Drive - Supporting Families in Need",
    image:
      "https://images.unsplash.com/photo-1547119879-c379a507fd2a?w=400&auto=format&fit=crop&q=80",
    link: "/news/eid-charity-drive",
  },
  {
    id: 3,
    title: "Youth Leadership Workshop - Empowering Tomorrow's Leaders",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=80",
    link: "/news/youth-workshop",
  },
  {
    id: 4,
    title: "Medical Camp Success - 500+ Patients Served",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80",
    link: "/news/medical-camp",
  },
  {
    id: 5,
    title: "Education Scholarship Program Announcement",
    image:
      "https://static.toiimg.com/thumb/msid-122131890,imgsize-134911,width-400,resizemode-4/122131890.jpg",
    link: "/news/scholarship-program",
  },
];

export function NewsEvents() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6 lg:px-14">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-12 lg:mb-14">
          <div className="flex-1">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-3"
            >
              Latest <span className="text-blue-600">News & Events</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base md:text-lg text-gray-600 max-w-xl"
            >
              Stay updated with our community activities, upcoming events, and
              inspiring stories
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/news">
              <Button className="rounded-full px-6 py-5 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 ">
                All Updates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4">
          {/* Left Column - Featured Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group"
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
              {/* Featured Image */}
              <div className="relative h-64 md:h-80 lg:h-72 overflow-hidden">
                <Image
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                {/* Date Label */}
                <div className="flex items-center gap-2 text-blue-600 mb-4">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {featuredNews.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {featuredNews.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                  {featuredNews.description}
                </p>

                {/* Read More Button */}
                <Link href={featuredNews.link}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-5 font-medium transition-all duration-300 hover:shadow-lg group/btn">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Column - List Cards */}
          <div className="space-y-4 md:space-y-5">
            {newsList.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={news.link}>
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex h-32 md:h-36">
                    {/* Image on Left */}
                    <div className="relative w-32 md:w-40 flex-shrink-0 overflow-hidden">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 128px, 160px"
                      />
                    </div>

                    {/* Content on Right */}
                    <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
                      <h4 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {news.title}
                      </h4>

                      {/* Read More Button */}
                      <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
