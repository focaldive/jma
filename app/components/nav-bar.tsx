"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "HOME" },
    { href: "/about", label: "ABOUT" },
    // { href: "/general-meetings", label: "GENERAL MEETINGS" },
    { href: "/news", label: "NEWS" },
    { href: "/projects", label: "PROJECTS" },
    { href: "/gallery", label: "GALLERY" },
    { href: "/contact", label: "CONTACT" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/assets/logo.png"
              alt="Jaffna Muslim Org Logo"
              width={50}
              height={40}
              priority
              className="w-auto h-10"
            />
            <span className="text-lg font-semibold text-[#1F294A]">
              JAFFNA MUSLIM ORG
            </span>
          </Link>

          {/* Desktop and Tablet Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-6 mr-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-[#1F294A] hover:text-[#2a3761] transition-colors whitespace-nowrap"
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
                  alt="Jaffna Muslim Org Logo"
                  width={50}
                  height={40}
                  priority
                  className="w-auto h-10"
                />
                <span className="text-lg font-semibold text-[#1F294A]">
                  JAFFNA MUSLIM ORG
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
                <Button className="bg-[#1F294A] hover:bg-[#2a3761] text-white w-full">
                  DONATE
                </Button>
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
