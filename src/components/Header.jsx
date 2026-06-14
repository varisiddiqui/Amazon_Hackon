import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import ProfileDropdown from "./ProfileDropdown";
import NotificationBell from "./notifications/NotificationBell";
import { useAuth, loginRedirectState } from "../context/AuthContext";
import { useStudentNav } from "../context/StudentNavContext";

const PUBLIC_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "AI Assistant", href: "/#ai-brief" },
  { label: "Events", href: "/#features" },
  { label: "Placements", href: "/#placement" },
  { label: "About Us", href: "/#testimonials" },
];

const MOBILE_PUBLIC_LINKS = [
  { label: "Dashboard", to: "/login", loginRedirect: "/dashboard", icon: "dashboard" },
  { label: "Features", href: "/#features", icon: "grid_view" },
  { label: "AI Assistant", href: "/#ai-brief", icon: "smart_toy" },
  { label: "Events", href: "/#features", icon: "celebration" },
  { label: "Placements", href: "/#placement", icon: "work" },
];

const APP_LINKS = [
  { label: "Dashboard", section: "home" },
  { label: "Events", section: "events" },
  { label: "Placements", section: "placement" },
  { label: "AI Assistant", section: "ai" },
];

const PLACEHOLDERS = {
  "/": "Search features, AI tools, campus info...",
  "/dashboard": "Search assignments, events, faculty...",
  "/faculty-dashboard": "Search classes, students, notices...",
  "/admin-dashboard": "Search events, clubs, registrations...",
};

export default function Header({
  showMenuButton,
  onMenuToggle,
  activeSection,
  onSectionNav,
  notifications,
  onNotificationRead,
  onViewAllNotifications,
}) {
  const { isSignedIn, user } = useAuth();
  const studentNav = useStudentNav();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const location = useLocation();

  const isLanding = location.pathname === "/";
  const showPublicMobileMenu = !isSignedIn && isLanding;
  const isStudent = isSignedIn && user?.role === "student";

  const menuEnabled = isStudent || showMenuButton;
  const handleMenuToggle =
    onMenuToggle ?? (isStudent ? studentNav?.toggleMenu : undefined);

  const bellNotifications = notifications ?? studentNav?.notifications;
  const handleNotificationRead =
    onNotificationRead ?? studentNav?.markNotificationRead;
  const handleViewAllNotifications =
    onViewAllNotifications ?? studentNav?.viewAllNotifications;

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const placeholder = PLACEHOLDERS[location.pathname] ?? "Search campus...";

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  function toggleSearch() {
    setSearchOpen((open) => {
      if (open) setQuery("");
      return !open;
    });
  }

  if (isAuthPage) {
    return (
      <header className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center px-margin-mobile py-4 md:px-margin-desktop">
          <Logo variant="header" />
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-black/5 bg-white/80 px-margin-mobile py-4 shadow-[0_1px_12px_rgba(0,0,0,0.06)] backdrop-blur-xl md:px-margin-desktop">
      <div className="flex items-center gap-3 lg:gap-6">
        {(menuEnabled && handleMenuToggle) || showPublicMobileMenu ? (
          <button
            type="button"
            aria-label="Open menu"
            onClick={() =>
              showPublicMobileMenu ? setMobileMenuOpen((o) => !o) : handleMenuToggle?.()
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-on-background transition-colors hover:bg-indigo-50 sm:h-10 sm:w-10"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        ) : null}
        <Logo variant="header" />

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
          {!isSignedIn
            ? PUBLIC_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))
            : APP_LINKS.map((link) => {
                const isActive =
                  link.section === "ai" && location.pathname === "/" && studentNav?.homeAiOpen
                    ? true
                    : (activeSection ?? studentNav?.activeSection) === link.section;
                const className = `text-sm font-medium transition-colors ${
                  isActive
                    ? "font-semibold text-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`;

                if (location.pathname === "/dashboard" && (onSectionNav || isStudent)) {
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() =>
                        onSectionNav
                          ? onSectionNav(link.section)
                          : studentNav?.handleNavigate(link.section)
                      }
                      className={className}
                    >
                      {link.label}
                    </button>
                  );
                }

                if (location.pathname === "/" && isStudent && link.section === "ai") {
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => studentNav?.openHomeAI()}
                      className={className}
                    >
                      {link.label}
                    </button>
                  );
                }

                const to =
                  link.section === "home"
                    ? "/dashboard"
                    : `/dashboard?section=${link.section}`;

                return (
                  <Link key={link.label} to={to} className={className}>
                    {link.label}
                  </Link>
                );
              })}
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {!isSignedIn ? (
          <>
            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary sm:inline-block"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold text-white sm:px-5 sm:py-2.5"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            {/* Search — logged in only */}
            <div className="flex items-center justify-end">
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                aria-label="Search"
                className={`h-9 rounded-full border border-black/10 bg-white text-sm text-on-background shadow-sm outline-none transition-all duration-300 ease-out placeholder:text-on-surface-variant focus:border-primary/40 focus:ring-2 focus:ring-primary/20 sm:h-10 ${
                  searchOpen
                    ? "mr-2 w-32 border-opacity-100 px-3 opacity-100 sm:w-44 md:w-52"
                    : "pointer-events-none w-0 border-transparent p-0 opacity-0"
                }`}
              />
              <button
                type="button"
                aria-label={searchOpen ? "Close search" : "Search"}
                onClick={toggleSearch}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 active:scale-95 sm:h-10 sm:w-10 ${
                  searchOpen
                    ? "bg-indigo-50 text-primary"
                    : "text-primary hover:bg-indigo-50"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {searchOpen ? "close" : "search"}
                </span>
              </button>
            </div>

            {bellNotifications ? (
              <NotificationBell
                notifications={bellNotifications}
                onMarkRead={handleNotificationRead}
                onViewAll={handleViewAllNotifications}
              />
            ) : (
              <button
                type="button"
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-primary transition-colors hover:bg-indigo-50 sm:h-10 sm:w-10"
              >
                <span className="material-symbols-outlined text-[22px] sm:text-[24px]">
                  notifications
                </span>
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-secondary-container ring-2 ring-white" />
              </button>
            )}

            <ProfileDropdown />
          </>
        )}
      </div>

      {showPublicMobileMenu && mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-[70] flex h-full w-[260px] flex-col border-r border-black/5 bg-white shadow-xl lg:hidden">
            <div className="flex items-center justify-between border-b border-black/5 px-4 py-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-50"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3">
              {MOBILE_PUBLIC_LINKS.map((link) =>
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    state={loginRedirectState(link.loginRedirect)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                    {link.label}
                  </a>
                )
              )}
            </nav>
            <div className="space-y-2 border-t border-black/5 px-3 py-4">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-on-background hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary block w-full rounded-xl py-2.5 text-center text-sm font-semibold text-white"
              >
                Sign Up
              </Link>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
