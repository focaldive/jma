import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ActivityItemProps {
  avatar?: string
  name: string
  action: string
  time: string
  type?: "donation" | "event" | "news" | "janaza" | "default"
}

const typeColors = {
  donation: "bg-green-100 text-green-600",
  event: "bg-purple-100 text-purple-600",
  news: "bg-blue-100 text-blue-600",
  janaza: "bg-gray-100 text-gray-600",
  default: "bg-gray-100 text-gray-600",
}

export function ActivityItem({
  avatar,
  name,
  action,
  time,
  type = "default",
}: ActivityItemProps) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 -mx-2 rounded-lg transition-colors">
      <Avatar className="w-10 h-10">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className={cn("text-sm font-medium", typeColors[type])}>
          {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        <p className="text-sm text-gray-500 truncate">{action}</p>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
    </div>
  )
}
