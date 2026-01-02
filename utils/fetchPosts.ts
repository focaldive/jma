// Local database article interface
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  featuredImage: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Legacy WordPress interface (kept for backwards compatibility)
export interface Author {
  name: string;
  role: string;
}

export interface NewsItem {
  id: number;
  title: {
    rendered: string;
  };
  rttpg_excerpt: string;
  category: string;
  rttpg_author: {
    display_name: string;
  };
  date: string;
  rttpg_featured_image_url: {
    landscape: {
      0: string;
    };
  };
  content: {
    rendered: string;
  };
}

// Fetch local articles from database
export async function fetchLocalArticles(): Promise<Article[]> {
  const response = await fetch("/api/articles", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  const data = await response.json();
  if (data.success) {
    return data.articles;
  }
  throw new Error(data.message || "Failed to fetch articles");
}

// Fetch single article from database
export async function fetchLocalArticle(id: string): Promise<Article> {
  const response = await fetch(`/api/articles/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  const data = await response.json();
  if (data.success) {
    return data.article;
  }
  throw new Error(data.message || "Failed to fetch article");
}

// Legacy WordPress fetch (kept for backwards compatibility)
export async function fetchPosts(
  page: number = 1,
  perPage: number = 10
): Promise<NewsItem[]> {
  const response = await fetch(
    `https://jaffnamuslimuk.org/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data: NewsItem[] = await response.json();
  return data;
}

export async function fetchSinglePost(id: number): Promise<NewsItem> {
  const response = await fetch(
    `https://jaffnamuslimuk.org/wp-json/wp/v2/posts/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  const data: NewsItem = await response.json();
  return data;
}
