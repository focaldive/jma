"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { EmblaCarouselType } from "embla-carousel";

const causes = [
  {
    title: "Zakat Al-Fitr",
    description:
      "When you give Zakat al-Fitrah, your fasting is increased in reward.",
    image:
      "https://images.unsplash.com/photo-1512358958014-b651a7ee1773?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bW9uZXklMjBnaXZpbmd8ZW58MHwwfDB8fHwy",
  },
  {
    title: "Sadaqah Jariyah",
    description:
      "Your generosity can not only give people living in extreme poverty the help",
    image:
      "https://images.unsplash.com/photo-1619149769183-01fc5bccc153?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fG1vbmV5JTIwZ2l2aW5nfGVufDB8MHwwfHx8Mg%3D%3D",
  },
  {
    title: "Medical Help",
    description: "Provide help for medical related issues for the needy",
    image:
      "https://images.unsplash.com/photo-1542884841-9f546e727bca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1lZGljYWx8ZW58MHwwfDB8fHwy",
  },
  {
    title: "Orphans & Widows",
    description:
      "Across the world, millions of families have been torn apart by the death of...",
    image:
      "https://images.unsplash.com/photo-1497655392221-e645087843da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b3JwaGFuJTIwJTI2JTIwd2lkb3dzfGVufDB8MHwwfHx8Mg%3D%3D",
  },
  {
    title: "Water for All",
    description: "Every 2 minutes a child dies from a water-related disease",
    image:
      "https://media.istockphoto.com/id/600999260/photo/hands-of-poor-african-children-asking-for-drinking-water.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ev7WU39mC-XPkcsfhRBRJv6cKSeEsR01-yrcuQYUa_0=",
  },
];

export function GetInvolved() {
  const [api, setApi] = useState<EmblaCarouselType | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-12 md:py-16 lg:py-24">
      <div className="container px-4 mx-auto">
        <h2 className="mb-8 text-center text-2xl capitalize font-bold tracking-tight sm:text-3xl md:mb-12 md:text-4xl lg:text-6xl">
          Get involved, here are some great
          <br />
          ways to make a difference
        </h2>

        <div className="relative mx-auto max-w-6xl">
          <Carousel
            setApi={(api) => setApi(api || null)}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {causes.map((cause, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[50px]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                      style={{ backgroundImage: `url(${cause.image})` }}
                    >
                      <div className="absolute inset-0 bg-black/50" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                      <h3 className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl">
                        {cause.title}
                      </h3>
                      <p className="mb-6 max-w-md text-sm text-white/90 md:text-base lg:text-lg">
                        {cause.description}
                      </p>
                      <Button
                        size="lg"
                        className="bg-blue-600 uppercase text-white hover:bg-blue-700"
                      >
                        Donate
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 md:left-8" />
            <CarouselNext className="right-4 md:right-8" />
          </Carousel>

          {/* Dots Navigation */}
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  current === index
                    ? "w-6 bg-primary"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
