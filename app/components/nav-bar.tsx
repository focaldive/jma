"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function NavBar() {
  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 h-20">
        <nav className="flex items-center justify-between h-full">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/assets/logo.png"
              alt="One Drop Logo"
              width={50}
              height={40}
              priority
            />
            <span className="text-lg uppercase font-semibold text-[#1F294A]">
              Jaffna Muslim Org
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-semibold text-[#1F294A] hover:text-teal-600 transition-colors"
            >
              HOME
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-[#1F294A] hover:text-teal-600 transition-colors"
            >
              ABOUT
            </Link>
            <Link
              href="/general-meetings"
              className="text-sm font-semibold text-[#1F294A] hover:text-teal-600 transition-colors"
            >
              GENERAL MEETINGS
            </Link>
            <Link
              href="/news"
              className="text-sm font-semibold text-[#1F294A] hover:text-teal-600 transition-colors"
            >
              NEWS
            </Link>
            <Link
              href="/projects"
              className="text-sm font-semibold text-[#1F294A] hover:text-teal-600 transition-colors"
            >
              PROJECTS
            </Link>
            <Link
              href="/gallery"
              className="text-sm font-semibold text-[#1F294A] hover:text-teal-600 transition-colors"
            >
              GALLERY
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-[#1F294A] hover:text-teal-600 transition-colors"
            >
              CONTACT
            </Link>
            <Button className="bg-[#1F294A] hover:bg-[#2a3761] text-white">
              DONATE
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
