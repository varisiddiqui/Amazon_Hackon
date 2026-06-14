import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../context/AuthContext";

const PUBLIC_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "AI Assistant", href: "/#features" },
  { label: "Events", href: "/#features" },
  { label: "About", href: "/#features" },
];

const APP_LINKS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Events", to: "/dashboard" },
  { label: "Placements", to: "/dashboard" },
  { label: "AI Assistant", to: "/dashboard" },
];

const PLACEHOLDERS = {
  "/": "Search features, AI tools, campus info...",
  "/dashboard": "Search assignments, events, faculty...",
  "/faculty-dashboard": "Search classes, students, notices...",
  "/admin-dashboard": "Search events, clubs, registrations...",
};

export default function Header({ showMenuButton, onMenuToggle }) {
  const { isSignedIn } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const location = useLocation();

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const placeholder = PLACEHOLDERS[location.pathname] ?? "Search campus...";

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

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
        {isSignedIn && showMenuButton && (
          <button
            type="button"
            aria-label="Open menu"
            onClick={onMenuToggle}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-on-background transition-colors hover:bg-indigo-50 sm:h-10 sm:w-10"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        )}
        <Logo variant="header" />

        <nav className="hidden items-center gap-6 md:flex">
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
            : APP_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {!isSignedIn ? (
          <>
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
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

            <ProfileDropdown />
          </>
        )}
      </div>
    </header>
  );
}
