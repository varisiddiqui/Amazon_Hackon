const NAV_ITEMS = [
  { icon: "grid_view", label: "Home", active: true },
  { icon: "calendar_today", label: "Schedule", active: false },
  { icon: "auto_awesome", label: "AI", active: false, filled: true },
  { icon: "auto_stories", label: "Courses", active: false },
  { icon: "person", label: "Profile", active: false },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 z-50 flex h-16 w-full items-center justify-around rounded-t-xl border-t border-black/5 bg-white/90 px-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:hidden">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.label}
          type="button"
          className={`relative flex flex-col items-center justify-center text-xs font-semibold transition-all duration-200 active:scale-90 ${
            item.active
              ? "text-primary after:absolute after:-bottom-1 after:h-1 after:w-1 after:rounded-full after:bg-primary after:content-['']"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <span
            className={`material-symbols-outlined ${item.filled ? "filled" : ""}`}
          >
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
