"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const heroContent = [
  {
    image: {
      src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Woman collecting water",
    },
    title: "Clean Water Initiative",
    description:
      "Help us provide clean and safe drinking water to communities in need. Your support can transform lives and improve health outcomes for thousands.",
    cta: "Support Clean Water",
    link: "/water-initiative",
  },
  {
    image: {
      src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Children in classroom",
    },
    title: "Education for All",
    description:
      "Empower the next generation through education. Your contribution helps build schools, provide supplies, and support teachers in underserved areas.",
    cta: "Empower Education",
    link: "/education-program",
  },
  {
    image: {
      src: "https://images.unsplash.com/photo-1617450365226-9bf28c04e130?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Medical aid",
    },
    title: "Healthcare Access",
    description:
      "Bring vital medical care to those who need it most. Your donation supports mobile clinics, essential medicines, and healthcare professionals in remote areas.",
    cta: "Support Healthcare",
    link: "/healthcare-program",
  },
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === heroContent.length - 1 ? 0 : prevIndex + 1))
    }, 6000)
  }

  useEffect(() => {
    if (isAutoPlaying) {
      startAutoPlay()
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isAutoPlaying])

  const handlePrev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? heroContent.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => (prevIndex === heroContent.length - 1 ? 0 : prevIndex + 1))
  }

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={heroContent[currentIndex].image.src || "/placeholder.svg"}
              alt={heroContent[currentIndex].image.alt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 md:px-6 h-screen flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium"
              >
                <span className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse" />
                FEATURED INITIATIVE
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                {heroContent[currentIndex].title}
              </h1>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                {heroContent[currentIndex].description}
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link href={heroContent[currentIndex].link}>
                  <Button
                    size="lg"
                    className="text-white border-0 rounded-full px-8 py-6 text-lg  hover:bg-white/10 backdrop-blur-sm transition-all duration-300" 
                  >
                    {heroContent[currentIndex].cta}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>

                {/* <Button
                  size="lg"
                  className="text-white border-white/30 rounded-full px-8 py-6 text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                >
                  Learn More
                </Button> */}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-4 mt-16">
            <Button
              size="icon"
              onClick={handlePrev}
              className="rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {heroContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === index ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              size="icon"
              onClick={handleNext}
              className="rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
    </section>
  )
}

export default HeroSection

