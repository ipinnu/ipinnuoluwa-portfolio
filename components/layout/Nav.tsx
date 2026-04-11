"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/my-world", label: "My World" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-bg-primary/90 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        )}
      >
        <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-syne font-bold text-xl text-accent hover:opacity-80 transition-opacity"
          >
            ipi.
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative group",
                  pathname === link.href
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/2348133754181?text=Hi%20Ipinnuoluwa%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.%20Brief%20overview%3A%20"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 bg-accent text-bg-primary text-sm font-semibold px-4 py-2 rounded-[3px] hover:bg-accent-dim transition-colors"
            >
              Start a Project →
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 w-6 h-5 justify-center"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="block h-px w-6 bg-text-primary origin-center transition-colors"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block h-px w-6 bg-text-primary"
              />
              <motion.span
                animate={
                  menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
                }
                className="block h-px w-6 bg-text-primary origin-center"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-bg-primary flex flex-col"
          >
            <div className="flex flex-col justify-center items-start px-8 h-full gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block font-syne font-bold text-4xl transition-colors py-2",
                      pathname === link.href
                        ? "text-accent"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: navLinks.length * 0.06, duration: 0.3 }}
                className="mt-8"
              >
                <a
                  href="https://wa.me/2348133754181?text=Hi%20Ipinnuoluwa%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.%20Brief%20overview%3A%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent text-bg-primary font-semibold px-6 py-3 rounded-sm"
                >
                  Start a Project →
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
