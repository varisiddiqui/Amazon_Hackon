import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PROFILE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYptRMxH-gikJBcJ7TgTD-DqfxgY6CNZPunmzJVMVQ9l8ABNmOmxRJsSFfl4uORNoP5IqbgJqDvxcfVQ4woWQEYh8Q7LFmRQ88KINEj62j81r9SHn_NjGHRvbeFJUrBLtXdV-bO70Se_5Baj8e0hpfC0FV2OrqVU2TFOdQ7tStdeKPZv_LNhDB8sdQRChfR7DudtR1mOwtuUnQJPGcirhz0X1-CNIMDoJHfljObbTTCU9j6wrEPIbqjYyGRMiLA00Yhox00MX2OA4";

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

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Profile menu"
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-gradient-to-br from-indigo-500 to-purple-600 sm:h-9 sm:w-9"
      >
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.fullName}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={PROFILE_IMAGE}
            alt={user?.fullName || "Profile"}
            className="h-full w-full object-cover"
          />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-black/5 bg-white py-1 shadow-xl">
          <div className="border-b border-black/5 px-4 py-3">
            <p className="text-sm font-semibold text-on-background">
              👤 {user?.fullName}
            </p>
            <p className="truncate text-xs text-on-surface-variant">
              {user?.email}
            </p>
            {user?.isGuest && (
              <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                Guest Mode
              </span>
            )}
          </div>
          {[
            { label: "Dashboard", to: "/dashboard", icon: "dashboard" },
            { label: "My Profile", to: "/dashboard", icon: "person" },
            { label: "Settings", to: "/dashboard", icon: "settings" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant transition-colors hover:bg-indigo-50 hover:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">
                {item.icon}
              </span>
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
