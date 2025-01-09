"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Heart, Calendar, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { NewsItem } from "@/utils/fetchPosts";
import { RichContentRenderer } from "@/components/news/news-rich-content-renderer";
import Image from "next/image";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

interface NewsArticleProps {
  article: NewsItem;
  relatedArticles: NewsItem[];
}

export default function NewsArticle({
  article,
  relatedArticles,
}: NewsArticleProps) {
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24"
    >
      {/* Back Button */}
      <motion.div variants={fadeIn} className="mb-8">
        <Button variant="ghost" className="group" asChild>
          <Link href="/news">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to News
          </Link>
        </Button>
      </motion.div>

      {/* Article Header */}
      <motion.div variants={fadeIn} className="space-y-4 mb-8">
        {/* <Badge>{article.category}</Badge> */}
        <h1 className="text-4xl font-bold tracking-tight">
          {article.title.rendered}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{article.date}</span>
          </div>
        </div>
      </motion.div>

      {/* Author Card */}
      <motion.div variants={fadeIn} className="mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <UserRound className="h-5 w-5 rounded-full" />
            <div>
              <p className="font-medium">
                {article.rttpg_author.display_name?.charAt(0).toUpperCase() +
                  article.rttpg_author.display_name?.slice(1)}
              </p>
            </div>
            <div className="ml-auto flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Article Content */}
      <motion.div variants={fadeIn} className="prose prose-lg max-w-none">
        <RichContentRenderer content={article.content.rendered} />
      </motion.div>

      {/* Related Articles */}
      <motion.div variants={fadeIn} className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {relatedArticles.map((relatedArticle) => (
            <motion.div
              key={relatedArticle.id}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <Link href={`/news/${relatedArticle.id}`}>
                <Card>
                  <CardContent className="p-4">
                    <div className="relative h-48 mb-4 rounded-md overflow-hidden">
                      <Image
                        src={
                          relatedArticle.rttpg_featured_image_url.landscape[0]
                        }
                        alt={relatedArticle.title.rendered}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform group-hover:scale-105"
                      />
                    </div>
                    <Badge className="mb-2">{relatedArticle.category}</Badge>
                    <h3 className="font-semibold mb-2 group-hover:text-primary">
                      {relatedArticle.title.rendered}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedArticle.rttpg_excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
