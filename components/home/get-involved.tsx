"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Your existing data
const causes = [
  {
    title: "Zakat Al-Fitr",
    description:
      "When you give Zakat al-Fitrah, your fasting is increased in reward.",
    image:
      "https://images.unsplash.com/photo-1512358958014-b651a7ee1773?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bW9uZXklMjBnaXZpbmd8ZW58MHwwfDB8fHwy",
  },
  {
    title: "Sadaqah Jariyah",
    description:
      "Your generosity can not only give people living in extreme poverty the help",
    image:
      "https://images.unsplash.com/photo-1619149769183-01fc5bccc153?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fG1vbmV5JTIwZ2l2aW5nfGVufDB8MHwwfHx8Mg%3D%3D",
  },
  {
    title: "Medical Help",
    description: "Provide help for medical related issues for the needy",
    image:
      "https://images.unsplash.com/photo-1542884841-9f546e727bca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1lZGljYWx8ZW58MHwwfDB8fHwy",
  },
  {
    title: "Orphans & Widows",
    description:
      "Across the world, millions of families have been torn apart by the death of...",
    image:
      "https://images.unsplash.com/photo-1497655392221-e645087843da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b3JwaGFuJTIwJTI2JTIwd2lkb3dzfGVufDB8MHwwfHx8Mg%3D%3D",
  },
  {
    title: "Water for All",
    description: "Every 2 minutes a child dies from a water-related disease",
    image:
      "https://media.istockphoto.com/id/600999260/photo/hands-of-poor-african-children-asking-for-drinking-water.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ev7WU39mC-XPkcsfhRBRJv6cKSeEsR01-yrcuQYUa_0=",
  },
];

export function GetInvolved() {
  const featuredCause = causes[0]; // First card for Layout 1
  const gridCauses = causes.slice(1, 5); // 4 cards for Layout 2 (2x2 grid)

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4">
          {/* LAYOUT 1: Title/Description + 1 Featured Card */}
          <div className="space-y-3">
            {/* Title and Description */}
            <div className=" ">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2"
              >
                Get Involved &{" "}
                <span className="text-blue-600">Make a Difference</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }} 
                className="text-base md:text-lg text-gray-600 leading-relaxed  "
              >
                Join us in transforming lives through meaningful action. Your
                contribution creates lasting impact in communities that need it
                most.
              </motion.p>
            </div>

            {/* Featured Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative h-[450px] overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <Image
                src={featuredCause.image}
                alt={featuredCause.title}
                fill
                className="object-cover  transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    {featuredCause.title}
                  </h3>
                  <p className="text-sm md:text-base text-white/90 mb-4">
                    {featuredCause.description}
                  </p>
                  <Link href="/donate">
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-5 font-semibold"
                    >
                      Donate Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* LAYOUT 2: 2x2 Grid (4 Cards) */}
          <div className="grid grid-cols-2 gap-3">
            {gridCauses.map((cause, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative aspect-square overflow-hidden rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <Image
                  src={cause.image}
                  alt={cause.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white">
                    <h3 className="text-base md:text-lg font-bold mb-2">
                      {cause.title}
                    </h3>
                    <p className="text-xs md:text-sm text-white/90 line-clamp-2 mb-3">
                      {cause.description}
                    </p>
                    <Link href="/donate">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 text-xs md:text-sm"
                      >
                        Donate
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
