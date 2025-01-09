import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 py-8 text-white sm:py-12">
      <div className="container px-4 mx-auto">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
              About Us
            </h3>
            <p className="text-sm text-slate-300 sm:text-base">
              Jaffna Muslim Association is dedicated to serving the community
              through various initiatives and programs.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
              Contact
            </h3>
            <div className="space-y-2 text-sm text-slate-300 sm:text-base">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                contact@jaffnamuslim.org
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +94 123 456 789
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Jaffna, Sri Lanka
              </p>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-slate-300 sm:text-base">
              <li>
                <a href="#" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Projects
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-white/10 pt-6 text-center text-xs text-slate-400 sm:mt-8 sm:pt-8 sm:text-sm">
          <p>
            &copy; {new Date().getFullYear()} Jaffna Muslim Association. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
