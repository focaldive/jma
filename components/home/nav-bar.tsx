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
      className={`fixed text-white top-4 w-full  z-[1000] transition-all duration-500  ${
        isScrolled ? "" : "bg-transparent"
      }`}
    >
      <div className="container w-full mx-auto px-4 gap-6">
        <nav
          className={`flex mx-auto items-center justify-between p-4 rounded-full transition-all duration-500 ${
            isScrollingDown
              ? "bg-black/55 backdrop-blur-sm shadow-sm h-20 w-[1100px]"
              : "w-[1300px]"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-4 transition-all duration-500"
          >
            <Image
              src="/assets/logo.png"
              alt="Jaffna Muslim Assoc Logo"
              width={50}
              height={40}
              priority
            />
            <span
              className={`font-bold text-black text-xl   ${
                isScrollingDown ? " text-white" : "text-white"
              }`}
            >
              Jaffna Muslim Association UK
            </span>
          </Link>

          {/* Desktop and Tablet Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center font-bold space-x-6 ">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <Link href="/donate" className="">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full transition-all duration-800">
                DONATE
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-[#1F294A]">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[360px] bg-white">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/assets/logo.png"
                  alt="Jaffna Muslim Assoc Logo"
                  width={50}
                  height={40}
                  priority
                  className="w-auto h-10"
                />
                <span className="text-lg font-semibold text-[#1F294A]">
                  JAFFNA MUSLIM ASSOC
                </span>
              </Link>

              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-base font-medium text-[#1F294A] hover:text-[#2a3761] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/donate" className="mt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                    DONATE
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </nav>

        {/* Mobile Navigation Menu Items */}
        {/* <div className="md:hidden flex items-center justify-between h-14 -mt-1 border-t">
          <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-2">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-[#1F294A] hover:text-[#2a3761] transition-colors whitespace-nowrap px-2"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Button
            className="bg-[#1F294A] hover:bg-[#2a3761] text-white"
            size="sm"
          >
            DONATE
          </Button>
        </div> */}
      </div>
    </header>
  );
}
