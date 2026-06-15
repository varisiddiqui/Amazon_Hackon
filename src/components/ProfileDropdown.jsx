import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate("/");
  }

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarSrc = user?.imageUrl;

  return (
    <div className="relative flex items-center gap-2" ref={ref}>
      <span className="hidden max-w-[120px] truncate text-sm font-medium text-on-background lg:inline">
        {user?.fullName?.split(" ")[0]}
      </span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Profile menu"
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-gradient-to-br from-indigo-500 to-purple-600 sm:h-9 sm:w-9"
      >
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={user.fullName}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-xs font-bold text-white">{initials || "ST"}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-black/5 bg-white py-1 shadow-xl">
          <div className="border-b border-black/5 px-4 py-3">
            <div className="flex items-center gap-3">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user.fullName}
                  className="h-10 w-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-on-background">
                  {user?.fullName}
                </p>
                <p className="truncate text-xs text-on-surface-variant">{user?.email}</p>
              </div>
            </div>
            {user?.isGuest && (
              <span className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                Guest Mode
              </span>
            )}
            {user?.authProvider === "google" && (
              <span className="mt-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                Google Account
              </span>
            )}
          </div>
          {[
            { label: "Dashboard", to: "/dashboard", icon: "dashboard" },
            { label: "Events", to: "/dashboard?section=events", icon: "celebration" },
            { label: "Settings", to: "/dashboard?section=settings", icon: "settings" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant transition-colors hover:bg-indigo-50 hover:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 border-t border-black/5 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
