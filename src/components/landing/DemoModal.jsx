import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

const SLIDE_META = [
  { id: "problem", label: "The Problem", duration: 7000, accent: "from-red-950 to-neutral-950" },
  { id: "solution", label: "The Solution", duration: 7000, accent: "from-indigo-950 to-purple-950" },
  { id: "dashboard", label: "Dashboard", duration: 8000, accent: "from-emerald-950 to-slate-950" },
  { id: "ai", label: "AI Assistant", duration: 8000, accent: "from-purple-950 to-indigo-950" },
  { id: "timetable", label: "Timetable", duration: 7000, accent: "from-blue-950 to-slate-950" },
  { id: "placement", label: "Placement Hub", duration: 8000, accent: "from-amber-950 to-orange-950" },
  { id: "end", label: "Get Started", duration: 7000, accent: "from-indigo-950 via-purple-950 to-slate-950" },
];

function SlideContent({ id }) {
  switch (id) {
    case "problem":
      return (
        <div className="demo-slide-inner text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-red-400">The Problem</p>
          <h3 className="mt-4 text-2xl font-bold leading-snug text-white sm:text-3xl">
            Students miss critical updates
          </h3>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {["💬 WhatsApp", "📧 Email", "🌐 Portals"].map((src) => (
              <span
                key={src}
                className="inline-block rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white"
              >
                {src}
              </span>
            ))}
          </div>
          <p className="demo-body-text">
            Scattered across apps — assignments, events, and deadlines get lost every day.
          </p>
        </div>
      );

    case "solution":
      return (
        <div className="demo-slide-inner text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">The Solution</p>
          <h3 className="mt-4 text-3xl font-bold text-white">CampusFlow AI</h3>
          <p className="demo-body-text">
            One intelligent hub for your entire student life — powered by AI.
          </p>
          <div className="mx-auto mt-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl shadow-xl shadow-indigo-500/40">
            🤖
          </div>
        </div>
      );

    case "dashboard":
      return (
        <div className="demo-slide-inner">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-emerald-400">
            Dashboard
          </p>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <p className="text-sm font-semibold text-indigo-600">Good Morning Avinash 👋</p>
            <p className="mt-1 text-lg font-bold text-slate-900">AI Daily Brief</p>
            <ul className="mt-4 space-y-2">
              {[
                ["📝", "2 Assignments Due"],
                ["📊", "Attendance 78%"],
                ["🎉", "Workshop Today"],
              ].map(([icon, text]) => (
                <li
                  key={text}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-700"
                >
                  <span>{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    case "ai":
      return (
        <div className="demo-slide-inner">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-purple-400">
            AI Assistant
          </p>
          <div className="mt-5 space-y-3">
            <div className="ml-auto w-fit max-w-full rounded-2xl rounded-tr-sm bg-indigo-600 px-4 py-3 text-sm text-white">
              What is my next class?
            </div>
            <div className="w-fit max-w-full rounded-2xl rounded-tl-sm border border-white/20 bg-white/10 px-4 py-3 text-sm text-white">
              🤖 DBMS at 11:00 AM
              <span className="mt-1 block text-neutral-300">Room 204 · Block A</span>
            </div>
          </div>
        </div>
      );

    case "timetable":
      return (
        <div className="demo-slide-inner">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-blue-400">
            Timetable
          </p>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
            <p className="mb-3 text-sm font-bold text-slate-900">Weekly View</p>
            {[
              { day: "Mon", cls: "DSA · 9 AM" },
              { day: "Tue", cls: "DBMS · 11 AM", live: true },
              { day: "Wed", cls: "AI Lab · 2 PM" },
              { day: "Thu", cls: "Web Dev · 4 PM" },
            ].map((r) => (
              <div
                key={r.day}
                className={`mb-2 flex items-center justify-between rounded-xl px-4 py-2.5 text-sm ${
                  r.live
                    ? "bg-indigo-100 font-semibold text-indigo-700"
                    : "bg-slate-50 text-slate-700"
                }`}
              >
                <span className="font-bold">{r.day}</span>
                <span>{r.cls}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "placement":
      return (
        <div className="demo-slide-inner text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Placement Hub</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: "📄", label: "Resume Analyzer" },
              { icon: "🎤", label: "Interview Prep" },
              { icon: "🗺️", label: "Roadmaps" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/20 bg-white/10 p-3 text-center"
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-2 text-[11px] font-semibold leading-snug text-white">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      );

    case "end":
      return (
        <div className="demo-slide-inner text-center">
          <div className="text-5xl">🎓</div>
          <h3 className="mt-4 text-3xl font-bold text-white">CampusFlow</h3>
          <p className="demo-body-text">Your AI Operating System for Student Life</p>
          <Link
            to="/signup"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-500"
          >
            Get Started Free
          </Link>
        </div>
      );

    default:
      return null;
  }
}

export default function DemoModal({ open, onClose }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  const slide = SLIDE_META[index];
  const slidePct = Math.min(100, (progress / slide.duration) * 100);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1 >= SLIDE_META.length ? 0 : i + 1));
    setProgress(0);
  }, []);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 < 0 ? SLIDE_META.length - 1 : i - 1));
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!open) {
      setIndex(0);
      setProgress(0);
      setPaused(false);
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open || paused) return;
    const tick = 50;
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = p + tick;
        if (next >= SLIDE_META[index].duration) {
          goNext();
          return 0;
        }
        return next;
      });
    }, tick);
    return () => clearInterval(timer);
  }, [open, index, paused, goNext]);

  if (!open) return null;

  return createPortal(
    <div
      className="demo-modal-root fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="CampusFlow product demo"
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-neutral-900 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="hidden gap-1.5 sm:flex">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">CampusFlow Demo</p>
              <p className="text-xs text-neutral-400">
                Slide {index + 1} of {SLIDE_META.length} · {slide.label}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close demo"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Slide stage — block layout only */}
        <div className={`demo-slide-stage bg-gradient-to-br ${slide.accent}`}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12),transparent_65%)]" />
          <SlideContent id={slide.id} />
        </div>

        {/* Controls — single progress bar */}
        <div className="border-t border-white/10 bg-neutral-900 px-5 py-4">
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-100"
              style={{ width: `${slidePct}%` }}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-1.5">
              {SLIDE_META.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    setProgress(0);
                  }}
                  title={s.label}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-7 bg-indigo-500" : "w-2 bg-white/25 hover:bg-white/40"
                  }`}
                  aria-label={s.label}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-300 hover:bg-white/10"
                aria-label={paused ? "Play" : "Pause"}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {paused ? "play_arrow" : "pause"}
                </span>
              </button>
              <button
                type="button"
                onClick={goPrev}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-neutral-300 hover:bg-white/10"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={goNext}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
