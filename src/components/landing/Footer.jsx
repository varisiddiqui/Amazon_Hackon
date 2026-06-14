import Logo from "./Logo";
import { SocialIcon, SOCIAL_LINKS } from "./SocialIcons";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/login?next=/dashboard" },
      { label: "AI Assistant", href: "/#ai-brief" },
      { label: "Timetable", href: "/#features" },
      { label: "Assignments", href: "/#features" },
      { label: "Attendance", href: "/#features" },
      { label: "Placement Hub", href: "/#placement" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Demo", href: "/#demo" },
      { label: "FAQs", href: "/#faq" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "#" },
      { label: "Report Issue", href: "#" },
      { label: "Feedback", href: "#" },
      { label: "Help Center", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-black/5 bg-surface-container-low">
      <div className="mx-auto max-w-6xl px-margin-mobile py-12 md:px-margin-desktop md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo variant="footer" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-on-surface-variant">
              Your AI Operating System for Student Life
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border border-black/8 bg-white text-on-surface-variant shadow-sm transition-all ${social.hoverClass}`}
                >
                  <SocialIcon name={social.icon} className={`h-[18px] w-[18px] ${social.iconClass}`} />
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
                        className="text-sm text-on-surface-variant transition-colors hover:text-primary"
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
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-1 px-margin-mobile py-6 md:px-margin-desktop">
          <p className="text-center text-xs text-on-surface-variant">
            © 2026 CampusFlow
          </p>
        </div>
      </div>
    </footer>
  );
}
