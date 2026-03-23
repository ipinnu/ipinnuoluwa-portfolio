import Link from "next/link";

const footerLinks = {
  Work: [
    { href: "/work", label: "Portfolio" },
    { href: "/services", label: "Services" },
    { href: "/hire", label: "Hire Me" },
  ],
  Explore: [
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ],
};

const socialLinks = [
  { href: "https://twitter.com/ipinnuoluwa", label: "Twitter" },
  { href: "https://linkedin.com/in/ipinnuoluwa-oladipo", label: "LinkedIn" },
  { href: "https://github.com/ipinnuoluwa", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="max-w-content mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="font-syne font-bold text-2xl text-accent block mb-4"
            >
              ipi.
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Flutter & product engineer based in Lagos, Nigeria. Building
              mobile apps and web products for startups and businesses
              worldwide.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-4">
                {section}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary text-sm hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-xs text-text-tertiary">
            © {new Date().getFullYear()} Ipinnuoluwa Oladipo. Built by me.
          </p>
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-text-tertiary hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
