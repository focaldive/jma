import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";

const events = [
  {
    title: "Community Gathering 2024",
    date: "Jan 15, 2024",
    description: "Join us for our annual community gathering event.",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fG1lZXRpbmdzfGVufDB8MHwwfHx8Mg%3D%3D",
  },
  {
    title: "Eid Appeal",
    date: "Feb 1, 2024",
    description: "Support our Eid charity drive for those in need.",
    image:
      "https://images.unsplash.com/photo-1547119879-c379a507fd2a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aWZ0YXJ8ZW58MHwwfDB8fHwy",
  },
  {
    title: "Youth Workshop",
    date: "Feb 15, 2024",
    description: "Educational workshop for young community members.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8eW91dGglMjB3b3Jrc2hvcHxlbnwwfDB8MHx8fDI%3D",
  },
];

export function NewsEvents() {
  return (
    <section className="py-12 md:py-16 lg:py-36 mx-auto">
      <div className="container px-4 mx-auto">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-6xl">
            Latest News and Events
          </h2>
          <p className="text-lg text-muted-foreground">
            Stay updated with our community activities and upcoming events
          </p>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <Card key={index} className="flex h-full flex-col overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {event.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-2 text-sm text-muted-foreground sm:text-base">
                  {event.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
