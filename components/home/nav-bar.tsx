"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [passedHero, setPassedHero] = useState(false);
  const [open, setOpen] = useState(false);

  // Handle scroll effect with direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight; // Hero section is typically full viewport height

      // Check if scrolled from top
      setIsScrolled(currentScrollY > 0);

      // Check if passed hero section
      const hasPassed = currentScrollY > heroHeight * 0.8; // Trigger at 80% of hero height
      setPassedHero(hasPassed);

      // Detect scroll direction and position
      // Keep navbar scrolled state based on position, not direction
      if (hasPassed) {
        // Past hero section - use scrolled down state
        setIsScrollingDown(true);
      } else {
        // Back in hero section - return to expanded state
        setIsScrollingDown(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { href: "/about", label: "ABOUT" },
    // { href: "/general-meetings", label: "GENERAL MEETINGS" },
    { href: "/news", label: "NEWS" },
    { href: "/projects", label: "PROJECTS" },
    { href: "/gallery", label: "GALLERY" },
    { href: "/contact", label: "CONTACT" },
  ];

  return (
    <header
      className={`fixed text-white top-2 sm:top-4 w-full  z-[1000] rounded-full  transition-all duration-500 ${
        isScrolled ? "" : "bg-black/55 backdrop-blur-sm"
      }`}
    >
      <div className="container w-full mx-auto px-2 sm:px-4">
        <nav
          className={`flex mx-auto items-center justify-between p-2 sm:p-3 md:p-2 rounded-full transition-all duration-500 ${
            isScrollingDown
              ? "bg-black/55 backdrop-blur-sm shadow-sm h-16 sm:h-18 md:h-20 w-full sm:w-[95%] md:w-[90%] lg:w-[1100px]"
              : "w-full sm:w-[90%] md:w-[90%] lg:w-[1300px]"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 transition-all duration-500"
          >
            <Image
              src="/assets/logo.png"
              alt="Jaffna Muslim Assoc Logo"
              width={50}
              height={40}
              priority
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-2"
            />
            <span
              className={`font-bold text-sm sm:text-base md:text-lg lg:text-xl transition-all duration-500 ${
                isScrollingDown ? "text-white" : "text-white"
              }`}
            >
              <span className="hidden sm:inline">
                Jaffna Muslim Association UK
              </span>
              <span className="sm:hidden">JMA UK</span>
            </span>
          </Link>

          {/* Desktop and Tablet Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center font-bold space-x-4 xl:space-x-6 text-sm xl:text-base">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="hover:text-gray-300 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Donate Button - Hidden on mobile, visible on md+ */}
          <div className="hidden md:block">
            <Link href="/donate">
              <Button className="bg-blue-600 hover:bg-blue-700  mx-2 rounded-full text-white transition-all duration-500 text-xs md:text-sm lg:text-base px-3 md:px-4 lg:px-6 py-1.5 md:py-2">
                DONATE
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Dropdown - Outside nav element */}
        <div
          className={`lg:hidden transition-all duration-700 ease-in-out overflow-hidden ${
            open
              ? "max-h-96 opacity-100 translate-y-0 mt-3"
              : "max-h-0 opacity-0 -translate-y-3 mt-0"
          }`}
        >
          <div className="bg-black/45 backdrop-blur-sm rounded-2xl shadow-lg p-4 mx-2 sm:mx-4">
            <div className="flex flex-col gap-2 items-center ">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-base font-medium text-white hover:text-blue-700 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <Link href="/donate" onClick={() => setOpen(false)}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-2">
                  DONATE
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
