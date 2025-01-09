import { Input } from "@/components/ui/input";
import Link from "next/link";
import { NewsItem } from "@/utils/fetchPosts";

interface NewsSidebarProps {
  recentPosts: NewsItem[];
}

export function NewsSidebar({ recentPosts }: NewsSidebarProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="relative">
          <Input type="search" placeholder="Search..." className="w-full" />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Posts</h2>
          <nav className="space-y-2">
            {recentPosts.slice(0, 5).map((news) => (
              <Link
                key={news.id}
                href={`/news/${news.id}`}
                className="block text-primary hover:underline"
              >
                {news.title.rendered}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
