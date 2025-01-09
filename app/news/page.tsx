"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchPosts, NewsItem } from "@/utils/fetchPosts";
import { NewsItem as NewsItemComponent } from "@/components/news/news-item";
import { NewsSidebar } from "@/components/news/news-sidebar";
import { NewsSkeleton } from "@/components/news/news-skeleton";
import { NewsCategories } from "@/components/news/news-categories";

const categories: string[] = ["All", "Events", "Appeals", "Community"];
const ITEMS_PER_PAGE = 6;

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetchInitialPosts();
  }, []);

  async function fetchInitialPosts() {
    try {
      const posts = await fetchPosts(1, ITEMS_PER_PAGE);
      setNewsItems(posts);
      console.log(posts);
      setLoading(false);
      setHasMore(posts.length === ITEMS_PER_PAGE);
    } catch (err) {
      setError(
        `Failed to load news items: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setLoading(false);
    }
  }

  async function fetchMorePosts() {
    if (loading) return;

    try {
      const nextPage = page + 1;
      const newPosts = await fetchPosts(nextPage, ITEMS_PER_PAGE);
      setNewsItems((prevItems) => [...prevItems, ...newPosts]);
      setPage(nextPage);
      setHasMore(newPosts.length === ITEMS_PER_PAGE);
    } catch (err) {
      setError(
        `Failed to load more news items: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  }

  function handleCategorySelection(category: string): void {
    setSelectedCategory(category);
    setNewsItems([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    fetchInitialPosts();
  }

  const filteredNews = newsItems.filter(
    (news) => selectedCategory === "All" || news.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-20 lg:py-40">
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
        <NewsCategories
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelection}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Main News Section */}
          <div className="lg:col-span-2">
            {loading ? (
              <NewsSkeleton />
            ) : error ? (
              <p>{error}</p>
            ) : (
              <InfiniteScroll
                dataLength={filteredNews.length}
                next={fetchMorePosts}
                hasMore={hasMore}
                loader={<NewsSkeleton />}
                endMessage={
                  <p className="text-center mt-4">No more news to load.</p>
                }
              >
                <div className="grid gap-8">
                  {filteredNews.map((news, index) => (
                    <NewsItemComponent
                      key={news.id}
                      news={news}
                      index={index}
                    />
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </div>

          {/* Sidebar */}
          <NewsSidebar recentPosts={newsItems.slice(0, 5)} />
        </div>
      </motion.div>
    </div>
  );
}
