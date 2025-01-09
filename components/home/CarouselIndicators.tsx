import { motion } from "framer-motion";

interface CarouselIndicatorsProps {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}

export function CarouselIndicators({
  total,
  current,
  onSelect,
}: CarouselIndicatorsProps) {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      {[...Array(total)].map((_, index) => (
        <motion.button
          key={index}
          onClick={() => onSelect(index)}
          className={`w-3 h-3 rounded-full ${
            index === current ? "bg-white" : "bg-white/50"
          }`}
          initial={{ scale: 1 }}
          animate={{ scale: index === current ? 1.5 : 1 }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}
