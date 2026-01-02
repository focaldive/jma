"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  fetchLocalArticle,
  fetchLocalArticles,
  Article,
} from "@/utils/fetchPosts";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Heart,
  Calendar,
  Eye,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function NewsArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      try {
        const [articleData, allArticles] = await Promise.all([
          fetchLocalArticle(id as string),
          fetchLocalArticles(),
        ]);
        setArticle(articleData);

        // Get related articles from same category
        const related = allArticles
          .filter(
            (a) =>
              a.id !== articleData.id && a.category === articleData.category
          )
          .slice(0, 2);

        // If not enough related articles in same category, get others
        if (related.length < 2) {
          const others = allArticles
            .filter((a) => a.id !== articleData.id && !related.includes(a))
            .slice(0, 2 - related.length);
          related.push(...others);
        }

        setRelatedArticles(related);
      } catch (err) {
        console.error("Failed to load article:", err);
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="h-12 bg-gray-200 rounded w-3/4" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-red-500">{error}</p>
        <Button asChild className="mt-4">
          <Link href="/news">Back to News</Link>
        </Button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500">Article not found</p>
        <Button asChild className="mt-4">
          <Link href="/news">Back to News</Link>
        </Button>
      </div>
    );
  }

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
        <Badge className="bg-blue-600 hover:bg-blue-700">
          {article.category}
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">{article.title}</h1>
        <div className="flex items-center gap-6 text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(article.createdAt), "MMMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{article.viewCount} views</span>
          </div>
        </div>
      </motion.div>

      {/* Featured Image */}
      {article.featuredImage && (
        <motion.div
          variants={fadeIn}
          className="mb-8 rounded-2xl overflow-hidden"
        >
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-auto object-cover"
          />
        </motion.div>
      )}

      {/* Action Bar */}
      <motion.div variants={fadeIn} className="mb-8">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-500">
              {article.excerpt && <p className="italic">{article.excerpt}</p>}
            </div>
            <div className="flex gap-2">
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
      <motion.div
        variants={fadeIn}
        className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-700 prose-a:text-blue-600"
      >
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </motion.div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <motion.div variants={fadeIn} className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedArticles.map((related) => (
              <motion.div
                key={related.id}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <Link href={`/news/${related.id}`}>
                  <Card className="overflow-hidden">
                    <div className="relative h-48 bg-gray-100">
                      {related.featuredImage ? (
                        <img
                          src={related.featuredImage}
                          alt={related.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <Badge className="mb-2 bg-blue-600">
                        {related.category}
                      </Badge>
                      <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {related.excerpt || related.content.substring(0, 100)}
                        ...
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
