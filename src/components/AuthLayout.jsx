import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

export default function AuthLayout({ title, subtitle, children, footer }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
      {/* Top bar with back button */}
      <div className="sticky top-0 z-20 flex w-full items-center gap-4 border-b border-black/5 bg-white/90 px-4 py-3.5 backdrop-blur-xl sm:px-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Go back"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-indigo-50 hover:text-primary"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <div className="hidden h-5 w-px bg-black/10 sm:block" />
        <Logo variant="header" to="/" />
      </div>

      {/* Main content */}
      <div className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-6 sm:hidden">
            <Logo variant="header" to="/" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-base leading-relaxed text-on-surface-variant">
              {subtitle}
            </p>
          )}
        </div>

        <div className="auth-card w-full rounded-2xl p-6 sm:p-8">{children}</div>

        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  );
}
