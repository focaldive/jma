"use client";

import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export function Footer() {
  const footerSections = {
    explore: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Events", href: "/events" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
    ],
    resources: [
      { label: "Donations", href: "/donate" },
      { label: "Janaza Notices", href: "/janaza" },
      { label: "Community Support", href: "/community" },
      { label: "Volunteer", href: "/volunteer" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Mission & Vision", href: "/mission" },
      { label: "Annual Reports", href: "/reports" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Responsible Disclosure", href: "/disclosure" },
      { label: "GDPR Info", href: "/gdpr" },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 text-white">
      <div className="container mx-auto px-14 py-12 md:py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* JMA Brand Section - Left Side */}
          <div className="w-3/4 ">
            <h3 className="text-xl md:text-2xl font-medium mb-4">JMA</h3>
            <p className="text-teal-100 text-sm leading-relaxed mb-6">
              Jaffna Muslim Association is dedicated to serving the community
              through various initiatives and programs.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-teal-100">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="break-all">contact@jaffnamuslim.org</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                +94 123 456 789
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                Jaffna, Sri Lanka
              </p>
            </div>

            {/* Social Media */}
            <div className="flex gap-3 mt-6">
              <Link
                href="#"
                className="rounded-full bg-white/10 p-2.5 transition-all hover:bg-white/20 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="rounded-full bg-white/10 p-2.5 transition-all hover:bg-white/20 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="rounded-full bg-white/10 p-2.5 transition-all hover:bg-white/20 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Side - All Navigation Sections */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* EXPLORE Section */}
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-teal-300 mb-4">
                EXPLORE
              </h4>
              <ul className="space-y-3">
                {footerSections.explore.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-teal-100 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* RESOURCES Section */}
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-teal-300 mb-4">
                RESOURCES
              </h4>
              <ul className="space-y-3">
                {footerSections.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-teal-100 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COMPANY Section */}
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-teal-300 mb-4">
                COMPANY
              </h4>
              <ul className="space-y-3">
                {footerSections.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-teal-100 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* LEGAL Section */}
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-teal-300 mb-4">
                LEGAL
              </h4>
              <ul className="space-y-3">
                {footerSections.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-teal-100 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-teal-200" suppressHydrationWarning>
              © {new Date().getFullYear()} Jaffna Muslim Association. All rights
              reserved.
            </p>
            <div className="flex gap-6 text-sm text-teal-200">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
