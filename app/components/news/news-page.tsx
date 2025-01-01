"use client";

export interface Author {
  name: string;
  role: string;
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: Author;
  date: string;
  image: string;
}

export interface NumberHighlight {
  value: string;
  description: string;
}

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";

export default function NewsPage() {
  const categories: string[] = ["All", "Events", "Appeals", "Community"];

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "JMA UK Annual Gathering 2024",
      excerpt:
        "Assalamualaikum dearest brothers and sisters, JMA UK is honoured to invite you to our annual Gathering! InshaAllah, it will be a warm and wonderful time for family and friends to enjoy.",
      category: "Events",
      author: {
        name: "JMA Admin",
        role: "Administrator",
      },
      date: "16h ago",
      image:
        "https://media.istockphoto.com/id/1041155582/photo/blurred-group-of-people-meeting-in-motivation-seminar-event-at-convention-hall-speaker.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ph_hSFcSju27CuoTZQaSwcHERdXLkfe_mqOwUvchsmg=",
    },
    {
      id: 2,
      title: "The Gambia Iftar Appeal",
      excerpt:
        "Alhamdulillah, JMA UK is working with ROCA to help our dear brothers and sisters in The Gambia once more. ROCA is a charity that works with orphans in The Gambia.",
      category: "Appeals",
      author: {
        name: "JMA Team",
        role: "Coordinator",
      },
      date: "2d ago",
      image:
        "https://media.istockphoto.com/id/184361358/photo/middle-eastern-cuisine.jpg?s=612x612&w=0&k=20&c=7l7OLQwbkrZsdhvmnU5Z2M5FiP6D-SAlRr6pKGCTH1A=",
    },
    {
      id: 3,
      title: "Fitra Appeal 2022",
      excerpt:
        "Join us in our Fitra Appeal 2022 to support those in need during the holy month of Ramadan. Your contributions can make a significant difference.",
      category: "Appeals",
      author: {
        name: "JMA Team",
        role: "Coordinator",
      },
      date: "1w ago",
      image:
        "https://media.istockphoto.com/id/508249642/photo/collecting-food-for-donations.jpg?s=612x612&w=0&k=20&c=R3Eet0LkUFgIE2dBO3DHJNK-SL6Mrmu-YUTgpsUksu8=",
    },
    {
      id: 4,
      title: "Ramadan 2022 Iftar Appeal",
      excerpt:
        "Help us provide iftar meals to those in need during Ramadan 2022. Your generosity can bring joy and relief to many families.",
      category: "Appeals",
      author: {
        name: "JMA Volunteers",
        role: "Volunteer",
      },
      date: "2w ago",
      image:
        "https://media.istockphoto.com/id/1745950134/photo/father-and-son-in-skull-caps-embracing-during-eid-ul-fitr.jpg?s=612x612&w=0&k=20&c=1MV3xx6ZLmOO09wvjsqJFp27mjVV3uf5mPyyDxjNBzM=",
    },
    {
      id: 5,
      title: "Flood Relief November 2021",
      excerpt:
        "Support our flood relief efforts in November 2021. We are working tirelessly to provide aid and support to those affected by the floods.",
      category: "Community",
      author: {
        name: "JMA Relief Team",
        role: "Coordinator",
      },
      date: "3w ago",
      image:
        "https://media.istockphoto.com/id/1272685075/photo/emergency-preparedness-natural-disaster-supplies.jpg?s=612x612&w=0&k=20&c=VTO2kPdQfMibrepUOOtNCrEyICeglqGnHXrzRRPErGc=",
    },
  ];

  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  function handleCategorySelection(category: string): void {
    setSelectedCategory(category);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-20 lg:py-40 bg-gray-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-20"
      >
        {/* Header */}
        <h1 className="text-6xl font-semibold tracking-tight text-center">
          Latest News & Articles
        </h1>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap justify-center">
          {categories.map((category) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategorySelection(category)}
            >
              <Badge
                variant={
                  category === selectedCategory ? "default" : "secondary"
                }
                className="px-4 py-2 cursor-pointer"
              >
                {category}
              </Badge>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Main News Section */}
          <div className="lg:col-span-2 grid gap-8">
            {newsItems
              .filter(
                (news) =>
                  selectedCategory === "All" ||
                  news.category === selectedCategory
              )
              .map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/news/${news.id}`} className="block">
                    <Card className="overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative h-48 md:h-full group">
                          <Image
                            src={news.image}
                            alt={news.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-lg font-semibold">
                              Read More
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <Badge className="mb-4">{news.category}</Badge>
                          <CardTitle className="text-xl mb-3 group-hover:text-primary">
                            {news.title}
                          </CardTitle>
                          <p className="text-muted-foreground line-clamp-3 mb-4">
                            {news.excerpt}
                          </p>
                          <div className="flex items-center mt-4">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {news.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                              <p className="text-sm font-medium">
                                {news.author.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {news.date}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Posts</h2>
                <nav className="space-y-2">
                  <a href="#" className="block text-primary hover:underline">
                    JMA UK Annual Gathering 2024
                  </a>
                  <a href="#" className="block text-primary hover:underline">
                    Fitra Appeal 2022
                  </a>
                  <a href="#" className="block text-primary hover:underline">
                    The Gambia Iftar Appeal
                  </a>
                  <a href="#" className="block text-primary hover:underline">
                    Ramadan 2022 Iftar Appeal
                  </a>
                  <a href="#" className="block text-primary hover:underline">
                    Flood Relief November 2021
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
