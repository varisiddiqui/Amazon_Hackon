import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import HeroSplineSection from "./HeroSplineSection";
import DemoModal from "./DemoModal";
import { useAuth, getDashboardPath } from "../../context/AuthContext";
import { useStudentNav } from "../../context/StudentNavContext";

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Assistant",
    description: "CampusGPT answers questions about classes, assignments, events & placement — 24/7.",
  },
  {
    icon: "📅",
    title: "Smart Timetable",
    description: "Dynamic schedule that syncs with your calendar and alerts you to changes.",
  },
  {
    icon: "📝",
    title: "Assignment Tracker",
    description: "Never miss a deadline — priority alerts for urgent submissions.",
  },
  {
    icon: "📊",
    title: "Attendance Analytics",
    description: "Track your percentage and get AI advice to stay above the threshold.",
  },
  {
    icon: "🎉",
    title: "Event Hub",
    description: "Discover, register & track hackathons, workshops & college fests.",
  },
  {
    icon: "🏆",
    title: "Placement Hub",
    description: "Resume analyzer, interview prep & Amazon-ready career roadmaps.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create Account",
    description: "Sign up in 30 seconds with your college email.",
  },
  {
    step: "02",
    title: "Connect Academic Profile",
    description: "Link your timetable, assignments & attendance data.",
  },
  {
    step: "03",
    title: "Let AI Organize Your Student Life",
    description: "CampusFlow AI handles the rest — briefs, reminders & recommendations.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Never missed an assignment again.",
    author: "Student",
    dept: "CSE · 3rd Year",
  },
  {
    quote: "CampusFlow simplified my academic life.",
    author: "Student",
    dept: "ECE · 2nd Year",
  },
];

function useScrollReveal() {
  const mainRef = useRef(null);

  useEffect(() => {
    const cards = mainRef.current?.querySelectorAll(".reveal-card");
    if (!cards?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-4");
          }
        });
      },
      { threshold: 0.1 },
    );

    cards.forEach((card) => {
      card.classList.add("transition-all", "duration-700", "opacity-0", "translate-y-4");
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return mainRef;
}

export default function LandingPage() {
  const mainRef = useScrollReveal();
  const navigate = useNavigate();
  const { isSignedIn, user } = useAuth();
  const studentNav = useStudentNav();
  const [demoOpen, setDemoOpen] = useState(false);
  const isStudent = isSignedIn && user?.role === "student";
  const showAiFab = isStudent && !studentNav?.homeAiOpen;

  function handleGetStarted() {
    if (isSignedIn) {
      navigate(getDashboardPath(user?.role));
    } else {
      navigate("/signup");
    }
  }

  return (
    <div className="landing-page min-h-screen bg-background font-[Inter] text-base text-on-background selection:bg-primary/20">
      <Header />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <main ref={mainRef} className="relative pb-16 pt-24">
        <div className="floating-orb absolute right-[-50px] top-[-50px] h-[300px] w-[300px] bg-indigo-200" />
        <div className="floating-orb absolute bottom-[20%] left-[-100px] h-[400px] w-[400px] bg-purple-200" />

        {/* Hero */}
        <section className="relative z-10 space-y-6 px-margin-mobile text-center md:px-margin-desktop">
          <div className="reveal-card mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            Built for Amazon HackOn
          </div>

          <h1 className="reveal-card mx-auto max-w-3xl text-[32px] font-bold leading-tight tracking-tight text-on-background md:text-[52px] md:leading-[1.1]">
            Your <span className="gradient-text">AI Operating System</span> for Student Life
          </h1>

          <p className="reveal-card mx-auto max-w-lg text-base text-on-surface-variant md:text-lg">
            Organize schedules, assignments, notices, events, and placement prep in one
            intelligent hub — powered by CampusFlow AI.
          </p>

          <div className="reveal-card flex flex-col gap-4 px-4 pt-4 sm:flex-row sm:justify-center sm:px-0">
            <button
              type="button"
              onClick={handleGetStarted}
              className="btn-primary rounded-xl px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200"
            >
              Get Started
            </button>
            <button
              type="button"
              id="demo"
              onClick={() => setDemoOpen(true)}
              className="btn-ghost flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-sm font-medium shadow-sm"
            >
              <span className="material-symbols-outlined">play_circle</span>
              Watch Demo
            </button>
          </div>
        </section>

        {/* 3D Robot */}
        <HeroSplineSection />

        {/* Features — 6 Cards */}
        <section id="features" className="relative z-10 mt-20 px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto max-w-6xl">
            <div className="reveal-card mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Features</p>
              <h2 className="mt-2 text-2xl font-bold text-on-background md:text-3xl">
                Everything You Need in One Place
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="reveal-card rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="text-3xl">{f.icon}</span>
                  <h3 className="mt-3 text-base font-bold text-on-background">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative z-10 mt-24 px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto max-w-4xl">
            <div className="reveal-card mb-12 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                How CampusFlow Works
              </p>
              <h2 className="mt-2 text-2xl font-bold text-on-background md:text-3xl">
                3 Simple Steps
              </h2>
            </div>
            <div className="flex flex-col items-center gap-4">
              {STEPS.map((step, i) => (
                <div key={step.step} className="w-full">
                  <div className="reveal-card flex items-start gap-5 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-white p-6 shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-bold text-white">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-on-background">{step.title}</h3>
                      <p className="mt-1 text-sm text-on-surface-variant">{step.description}</p>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex justify-center py-2 text-2xl text-indigo-300">↓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Daily Brief Preview */}
        <section id="ai-brief" className="relative z-10 mt-24 px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto max-w-4xl">
            <div className="reveal-card mb-8 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                AI Daily Brief
              </p>
              <h2 className="mt-2 text-2xl font-bold text-on-background">
                Your Morning Dashboard, Automated
              </h2>
            </div>
            <div className="reveal-card overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 shadow-lg md:p-8">
              <p className="text-sm font-semibold text-indigo-600">Good Morning Avinash 👋</p>
              <h3 className="mt-1 text-xl font-bold text-on-background">AI Daily Brief</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: "📝", text: "2 Assignments Due" },
                  { icon: "📊", text: "Attendance 78%" },
                  { icon: "🎉", text: "Workshop Today" },
                  { icon: "🏆", text: "Amazon HackOn Tomorrow" },
                ].map((item) => (
                  <li
                    key={item.text}
                    className="flex items-center gap-3 rounded-xl bg-white/80 px-4 py-3 text-sm font-medium text-on-background shadow-sm"
                  >
                    <span>{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl border border-indigo-100 bg-white/90 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Recommended Action
                </p>
                <p className="mt-1 text-sm text-on-background">
                  Complete DBMS assignment before 8 PM. Register for Amazon HackOn — closes
                  tomorrow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Placement Hub Preview */}
        <section id="placement" className="relative z-10 mt-24 px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto max-w-4xl">
            <div className="reveal-card mb-8 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-600">
                Placement Hub
              </p>
              <h2 className="mt-2 text-2xl font-bold text-on-background">
                AI Career Copilot
              </h2>
            </div>
            <div className="reveal-card grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: "📄",
                  title: "Resume Analyzer",
                  desc: "ATS score & Amazon-ready feedback",
                  color: "border-purple-100 bg-purple-50",
                },
                {
                  icon: "🎤",
                  title: "Interview Prep",
                  desc: "Mock questions for SDE roles",
                  color: "border-indigo-100 bg-indigo-50",
                },
                {
                  icon: "🗺️",
                  title: "Roadmaps",
                  desc: "Amazon SDE intern learning path",
                  color: "border-blue-100 bg-blue-50",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`rounded-2xl border p-6 text-center shadow-sm ${item.color}`}
                >
                  <span className="text-4xl">{item.icon}</span>
                  <h3 className="mt-3 text-sm font-bold text-on-background">{item.title}</h3>
                  <p className="mt-1 text-xs text-on-surface-variant">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="relative z-10 mt-24 px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto max-w-4xl">
            <div className="reveal-card mb-8 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                About Us
              </p>
              <h2 className="mt-2 text-2xl font-bold text-on-background">
                Loved by Students
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {TESTIMONIALS.map((t) => (
                <blockquote
                  key={t.quote}
                  className="reveal-card rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
                >
                  <p className="text-base italic leading-relaxed text-on-background md:text-lg">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-4 text-sm">
                    <span className="font-bold text-primary">— {t.author}</span>
                    <span className="ml-2 text-on-surface-variant">{t.dept}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ anchor (minimal) */}
        <section id="faq" className="sr-only" aria-hidden>
          FAQs
        </section>

        {/* Final CTA */}
        <section className="relative z-10 mt-24 px-margin-mobile md:px-margin-desktop">
          <div className="reveal-card mx-auto max-w-3xl rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-600 to-purple-700 p-10 text-center text-white shadow-xl">
            <h2 className="text-2xl font-bold md:text-3xl">
              Ready to Transform Your Student Life?
            </h2>
            <p className="mt-3 text-indigo-100">
              Join thousands of students using CampusFlow AI for smarter academic management.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={handleGetStarted}
                className="rounded-xl bg-white px-8 py-4 text-sm font-bold text-indigo-700 shadow-md hover:bg-indigo-50"
              >
                Get Started Free
              </button>
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="rounded-xl border border-white/40 px-8 py-4 text-sm font-semibold text-white hover:bg-white/10"
              >
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      {showAiFab && (
        <button
          type="button"
          onClick={() => studentNav?.openHomeAI()}
          className="fixed bottom-6 right-6 z-[300] flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-300/40 transition-all hover:scale-105 hover:shadow-xl"
        >
          <span className="text-lg">🤖</span>
          <span className="hidden sm:inline">Ask CampusFlow AI</span>
        </button>
      )}
    </div>
  );
}
