import { motion } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { NewsItem as NewsItemType } from "@/utils/fetchPosts";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface NewsItemProps {
  news: NewsItemType;
  index: number;
}

export function NewsItem({ news, index }: NewsItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/news/${news.id}`} className="block">
        <Card className="overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative h-48 md:h-full group">
              <Image
                src={news.rttpg_featured_image_url.landscape[0]}
                alt={news.title.rendered}
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
              <CardTitle className="text-xl mb-3 group-hover:text-primary">
                {news.title.rendered}
              </CardTitle>
              <p className="text-muted-foreground line-clamp-3 mb-4">
                {news.rttpg_excerpt}
              </p>
              <div className="flex items-center mt-4">
                <Calendar className="h-4 w-4" />
                <div className="ml-3">
                  <p className="text-sm font-medium"></p>
                  <p>{format(new Date(news.date), "MMMM dd, yyyy")}</p>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
