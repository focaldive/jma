import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const projects = [
  {
    title: "Youth Education",
    description:
      "Supporting educational initiatives for young community members",
    image: "/project-1.jpg",
    progress: 75,
  },
  {
    title: "Community Support",
    description: "Providing essential support to families in need",
    image: "/project-2.jpg",
    progress: 60,
  },
  {
    title: "Cultural Programs",
    description: "Preserving and celebrating our cultural heritage",
    image: "/project-3.jpg",
    progress: 85,
  },
];

export function Projects() {
  return (
    <section className="py-12 md:py-16 lg:py-36">
      <div className="container px-4 mx-auto">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-6xl">
            Our Projects
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover the initiatives making a difference in our community
          </p>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Card key={index} className="flex h-full flex-col overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1 text-lg sm:text-xl">
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm sm:text-base">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button className="w-full">Support This Project</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
