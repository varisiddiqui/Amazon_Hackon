import { Link } from "react-router-dom";

export default function Logo({ variant = "header", className = "", to = "/" }) {
  const base =
    "font-[Geist] font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent";

  const content =
    variant === "footer" ? (
      <span className={`${base} text-xl ${className}`}>CampusFlow</span>
    ) : (
      <span className={`${base} text-xl sm:text-2xl ${className}`}>CampusFlow</span>
    );

  return (
    <Link
      to={to}
      className="inline-block shrink-0 transition-opacity hover:opacity-80"
      aria-label="Go to home"
    >
      {content}
    </Link>
  );
}
