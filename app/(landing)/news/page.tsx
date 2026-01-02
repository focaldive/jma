"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchLocalArticles, Article } from "@/utils/fetchPosts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewsSkeleton } from "@/components/news/news-skeleton";
import { Calendar, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

const categories: string[] = [
  "All",
  "News",
  "Announcements",
  "Events",
  "Updates",
  "Press",
];

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      setLoading(true);
      const data = await fetchLocalArticles();
      console.log("Fetched articles:", data);
      // Show all articles (remove isPublished filter for now)
      setArticles(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError(
        `Failed to load articles: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setLoading(false);
    }
  }

  const filteredArticles = articles.filter(
    (article) =>
      selectedCategory === "All" || article.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-20 lg:py-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Latest News & Articles
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, events, and announcements from
            our community.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <NewsSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/news/${article.id}`} className="block group">
                  <Card className="overflow-hidden h-full transition-all hover:shadow-xl hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative h-48 bg-gray-100">
                      {article.featuredImage ? (
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-lg font-semibold">
                          Read More
                        </span>
                      </div>
                      {/* Category Badge */}
                      <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-700">
                        {article.category}
                      </Badge>
                    </div>

                    <CardContent className="p-5">
                      <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </CardTitle>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {article.excerpt || article.content.substring(0, 150)}
                        ...
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(new Date(article.createdAt), "MMMM dd, yyyy")}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Featured Articles */}
        {articles.filter((a) => a.isFeatured).length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles
                .filter((a) => a.isFeatured)
                .slice(0, 2)
                .map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <Link href={`/news/${article.id}`} className="block group">
                      <Card className="overflow-hidden transition-all hover:shadow-2xl">
                        <div className="grid md:grid-cols-2">
                          <div className="relative h-64">
                            {article.featuredImage ? (
                              <img
                                src={article.featuredImage}
                                alt={article.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <ImageIcon className="w-16 h-16 text-white/50" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-6 flex flex-col justify-center">
                            <Badge className="w-fit mb-3 bg-amber-500 hover:bg-amber-600">
                              Featured
                            </Badge>
                            <CardTitle className="text-xl mb-3 group-hover:text-blue-600 transition-colors">
                              {article.title}
                            </CardTitle>
                            <p className="text-gray-600 line-clamp-3 mb-4">
                              {article.excerpt ||
                                article.content.substring(0, 200)}
                              ...
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-2" />
                              {format(
                                new Date(article.createdAt),
                                "MMMM dd, yyyy"
                              )}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
