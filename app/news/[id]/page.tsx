"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSinglePost, fetchPosts, NewsItem } from "@/utils/fetchPosts";
import NewsArticle from "@/components/news/news-article";
import { NewsArticleSkeleton } from "@/components/news/news-article-skeleton";

export default function NewsArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticleAndRelated() {
      try {
        const [articleData, allPosts] = await Promise.all([
          fetchSinglePost(Number(id)),
          fetchPosts(1, 10),
        ]);
        setArticle(articleData);
        const filtered = allPosts
          .filter((post) => post.id !== articleData.id)
          .slice(0, 2);
        setRelatedArticles(filtered);
      } catch {
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    }

    loadArticleAndRelated();
  }, [id]);

  if (loading) return <NewsArticleSkeleton />;
  if (error) return <div>{error}</div>;
  if (!article) return <div>Article not found</div>;

  return <NewsArticle article={article} relatedArticles={relatedArticles} />;
}
