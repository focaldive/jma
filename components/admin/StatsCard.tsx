import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: React.ReactNode;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p
            className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2"
            suppressHydrationWarning
          >
            {value}
          </p>
          {change && (
            <p
              className={cn(
                "text-sm mt-2 font-medium",
                changeType === "increase" && "text-green-600",
                changeType === "decrease" && "text-red-600",
                changeType === "neutral" && "text-gray-500"
              )}
            >
              {changeType === "increase" && "↑ "}
              {changeType === "decrease" && "↓ "}
              {change}
            </p>
          )}
        </div>
        <div className={cn("p-2 rounded-xl", iconBgColor)}>
          <Icon className={cn("w-6 h-6 ", iconColor)} />
        </div>
      </div>
    </div>
  );
}
