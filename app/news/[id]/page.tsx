"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const scaleUp = {
  initial: { scale: 0.95 },
  animate: { scale: 1 },
  transition: { duration: 0.3 },
};

export default function NewsArticle() {
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-20 lg:py-40 bg-gray-5"
    >
      {/* Back Button */}
      <motion.div variants={fadeIn} className="mb-6">
        <Button variant="ghost" className="group" asChild>
          <Link href="/news">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to News
          </Link>
        </Button>
      </motion.div>

      {/* Article Header */}
      <motion.div variants={fadeIn} className="space-y-4 mb-8">
        <Badge>Events</Badge>
        <h1 className="text-4xl font-bold tracking-tight">
          JMA UK Annual Gathering 2024
        </h1>
        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>January 15, 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>5 min read</span>
          </div>
        </div>
      </motion.div>

      {/* Featured Image */}
      <motion.div
        variants={scaleUp}
        className="relative h-[400px] mb-8 rounded-xl overflow-hidden"
      >
        <Image
          src="https://media.istockphoto.com/id/1041155582/photo/blurred-group-of-people-meeting-in-motivation-seminar-event-at-convention-hall-speaker.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ph_hSFcSju27CuoTZQaSwcHERdXLkfe_mqOwUvchsmg="
          alt="JMA UK Annual Gathering"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Author Card */}
      <motion.div variants={fadeIn} className="mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>JA</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">JMA Admin</p>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </div>
            <div className="ml-auto flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Article Content */}
      <motion.div variants={fadeIn} className="prose prose-lg max-w-none">
        <p className="text-lg leading-relaxed mb-6">
          Assalamualaikum dearest brothers and sisters, JMA UK is honoured to
          invite you to our annual Gathering! InshaAllah, it will be a warm and
          wonderful time for family and friends to enjoy.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Event Details</h2>
        <p className="mb-6">
          Join us for an inspiring day filled with knowledge, connection, and
          community spirit. Our annual gathering brings together members and
          supporters from across the UK to celebrate our achievements and plan
          for an even more impactful future.
        </p>

        <div className="bg-muted p-6 rounded-lg my-8">
          <h3 className="text-xl font-semibold mb-4">Event Highlights</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Keynote speeches from distinguished guests</li>
            <li>Interactive workshops and sessions</li>
            <li>Networking opportunities</li>
            <li>Children&apos;s activities and entertainment</li>
            <li>Delicious refreshments and lunch provided</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">How to Participate</h2>
        <p className="mb-6">
          Registration is required for all attendees. Please ensure you register
          early as spaces are limited. Family tickets and group discounts are
          available.
        </p>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="my-8"
        >
          <Button className="w-ful" size="lg">
            Register Now
          </Button>
        </motion.div>
      </motion.div>

      {/* Related Articles */}
      <motion.div variants={fadeIn} className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <Card>
                <CardContent className="p-4">
                  <div className="relative h-48 mb-4 rounded-md overflow-hidden">
                    <Image
                      src="https://media.istockphoto.com/id/1041155582/photo/blurred-group-of-people-meeting-in-motivation-seminar-event-at-convention-hall-speaker.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ph_hSFcSju27CuoTZQaSwcHERdXLkfe_mqOwUvchsmg="
                      alt="Related Article"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <Badge className="mb-2">Events</Badge>
                  <h3 className="font-semibold mb-2 group-hover:text-primary">
                    Previous JMA UK Gatherings
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Relive the moments from our previous successful gatherings
                    and community events.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
