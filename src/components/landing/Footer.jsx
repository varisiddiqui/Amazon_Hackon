import Logo from "./Logo";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "AI Planner", href: "#" },
      { label: "Smart Timetable", href: "#" },
      { label: "CampusGPT", href: "#" },
      { label: "Career Prep", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Partners", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Community", href: "#" },
      { label: "Status", href: "#" },
      { label: "Report a Bug", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "GDPR", href: "#" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Twitter", icon: "public", href: "#" },
  { label: "LinkedIn", icon: "work", href: "#" },
  { label: "Instagram", icon: "photo_camera", href: "#" },
  { label: "YouTube", icon: "play_circle", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-black/5 bg-surface-container-low">
      <div className="mx-auto max-w-6xl px-margin-mobile py-12 md:px-margin-desktop md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo variant="footer" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-on-surface-variant">
              Your AI operating system for student life. Organize schedules,
              assignments, notices, and placement prep in one intelligent hub.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/8 bg-white text-on-surface-variant shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-indigo-50 hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h4 className="mb-4 text-sm font-semibold text-on-surface">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-on-surface-variant transition-colors duration-200 hover:text-primary"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-margin-mobile py-6 md:flex-row md:px-margin-desktop">
          <p className="text-center text-xs text-on-surface-variant md:text-left">
            © {new Date().getFullYear()} CampusFlow. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a
              href="#"
              className="text-xs text-on-surface-variant transition-colors hover:text-primary"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-on-surface-variant transition-colors hover:text-primary"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-xs text-on-surface-variant transition-colors hover:text-primary"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
