import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface NewsCategoriesProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function NewsCategories({
  categories,
  selectedCategory,
  onCategorySelect,
}: NewsCategoriesProps) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {categories.map((category) => (
        <motion.div
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategorySelect(category)}
        >
          <Badge
            variant={category === selectedCategory ? "default" : "secondary"}
            className="px-4 py-2 cursor-pointer"
          >
            {category}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
}
