import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import HeroSplineSection from "./HeroSplineSection";
import { useAuth, getDashboardPath } from "../../context/AuthContext";

const TESTIMONIAL_AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAPTvvT3HKsDMxFYdoy_mVnp-pd2Xtlv_OJfzRwS5KWZV-KHyyqdBLsWYQcU7EijWmROP1SCC6tVYZJsG2-cyNxxQVGoaEPVBP7S9pi08JbJV-b0PjKb2UZQ-LGFENW3fUX9gurzJpz8XNeeKzfs5ZaAlFWsGAv-ISYq9NlviybhCLbLvAyL4OtjVbKVieS1TP6cOeoZd0k0HhYrj3MZH3vo8MXM1Xoi8jgG4ThGYpT4tzmgp_SDpeHSmSP7wKDgQtjuMaizdbuHEs",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC96mgX4vDx3xLGqLieCbjGLme8wqNBam10hXZz8CUHaqVm5jpPUxo7H3rv3jT9bDF0CYzpfmKaQeKPinw2qr6rlsT3ggTcRCpTQ9aJ3cM6iVjdbEjW9mc38YbY_Vl_1VSZSa90fNHO8nH4nA69El7nJQa4L0QYBu4dIVGEzztVnirL4RrDukV37s6tmAFLphoUYzvLQP3LvE42DaAe44AHETvsiv8Dx7sbEFobpscHvl-oZtIMJ_oih6tUzaAZFs0Y2_ARIpbzZzc",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBMBigFHBUml2D1-Q8BcKBmaM1s-FoqcFZAxoDKHtgaHZ8RBNc6IymmcwU5WM0j-oO47CQ7v_OlvBSUCmMNBC0iyjJcRc31b5oLdpfneMvWq4kVwaicLwYr2BIMgCanuCRxONUZjw8NWcdblw12fNpiR-UMd38I6-zryvraLYSTw9utG6n1HLZ_EXUDpT9Mbu9qckqhsfbVSLu63wyH7LUHrsNTViSswCIH51gu0ocwWQSBSJDB0KvaN4ChtnfbW6KkmDdgWeo58Ko",
];

const FEATURES = [
  {
    icon: "calendar_today",
    filled: true,
    title: "Smart Timetable",
    description:
      "Dynamic schedule that auto-syncs with your academic calendar and adapts to sudden changes.",
    large: true,
    accent: "primary",
  },
  {
    icon: "how_to_reg",
    title: "Attendance Tracker",
    description:
      "Predictive alerts to ensure you never fall below the threshold.",
    accent: "secondary",
  },
  {
    icon: "work",
    title: "Placement Hub",
    description:
      "AI-driven mock interviews and resume scoring optimized for top tech firms.",
    accent: "tertiary",
  },
  {
    icon: "psychology",
    filled: true,
    title: "CampusGPT",
    description:
      "Your dedicated 24/7 academic advisor for instant policy clarifications and doubt solving.",
    accent: "primary",
    highlight: true,
  },
];

function useScrollReveal() {
  const mainRef = useRef(null);

  useEffect(() => {
    const cards = mainRef.current?.querySelectorAll(".glass-card");
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
      card.classList.add(
        "transition-all",
        "duration-700",
        "opacity-0",
        "translate-y-4",
      );
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

  function handleGetStarted() {
    if (isSignedIn) {
      navigate(getDashboardPath(user?.role));
    } else {
      navigate("/login");
    }
  }

  return (
    <div className="landing-page min-h-screen bg-background font-[Inter] text-base text-on-background selection:bg-primary/20">
      <Header />

      <main ref={mainRef} className="relative pb-32 pt-24 md:pb-24">
        <div className="floating-orb absolute right-[-50px] top-[-50px] h-[300px] w-[300px] bg-indigo-200" />
        <div className="floating-orb absolute bottom-[20%] left-[-100px] h-[400px] w-[400px] bg-purple-200" />

        {/* Hero */}
        <section className="relative z-10 space-y-6 px-margin-mobile text-center md:px-margin-desktop">
          <div className="glass-card mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[14px]">
              auto_awesome
            </span>
            The Future of Learning is Here
          </div>

          <h1 className="mx-auto max-w-2xl text-[32px] font-bold leading-tight tracking-tight text-on-background md:text-[48px] md:leading-[1.1]">
            Your <span className="gradient-text">AI Operating System</span> for
            Student Life
          </h1>

          <p className="mx-auto max-w-lg text-base text-on-surface-variant">
            Organize schedules, assignments, notices, and placement prep in one
            intelligent hub.
          </p>

          <div className="flex flex-col gap-4 px-4 pt-4 sm:flex-row sm:justify-center sm:px-0">
            <button
              type="button"
              onClick={handleGetStarted}
              className="btn-primary rounded-xl px-8 py-4 text-sm font-bold text-white"
            >
              Get Started
            </button>
            <button
              type="button"
              className="btn-ghost flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-medium"
            >
              <span className="material-symbols-outlined">play_circle</span>
              Watch Demo
            </button>
          </div>
        </section>

        <HeroSplineSection />

        {/* Stats */}
        <section className="relative z-10 mt-20 px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 md:max-w-4xl md:grid-cols-4">
            <div className="glass-card rounded-2xl p-4 text-center">
              <div className="text-2xl font-semibold text-primary">10k+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Active Students
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <div className="text-2xl font-semibold text-secondary">98%</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Efficiency Gain
              </div>
            </div>
            <div className="glass-card hidden rounded-2xl p-4 text-center md:block">
              <div className="text-2xl font-semibold text-tertiary">24/7</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                AI Support
              </div>
            </div>
            <div className="glass-card hidden rounded-2xl p-4 text-center md:block">
              <div className="text-2xl font-semibold text-primary">50+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Campus Partners
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="relative z-10 mt-20 px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-2xl font-semibold tracking-tight text-on-background">
              Intelligent Core
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {FEATURES.map((feature) =>
                feature.large ? (
                  <div
                    key={feature.title}
                    className="glass-card space-y-6 rounded-3xl border-indigo-100 bg-indigo-50/50 p-6 md:col-span-2 md:p-8"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-primary">
                      <span
                        className={`material-symbols-outlined ${feature.filled ? "filled" : ""}`}
                      >
                        {feature.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-primary-fixed">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-on-surface-variant">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={feature.title}
                    className={`glass-card flex items-start gap-6 rounded-3xl p-6 ${
                      feature.highlight
                        ? "border-purple-100 bg-purple-50/50"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        feature.accent === "secondary"
                          ? "bg-purple-100 text-secondary"
                          : feature.accent === "tertiary"
                            ? "bg-blue-100 text-tertiary"
                            : "bg-indigo-100 text-primary"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined ${feature.filled ? "filled" : ""}`}
                      >
                        {feature.icon}
                      </span>
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          feature.accent === "secondary"
                            ? "text-secondary-fixed"
                            : feature.accent === "tertiary"
                              ? "text-tertiary-fixed"
                              : "text-primary"
                        }`}
                      >
                        {feature.title}
                      </h4>
                      <p className="mt-1 text-xs text-on-surface-variant">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="relative z-10 mt-24 px-margin-mobile md:px-margin-desktop">
          <div className="absolute inset-0 -z-10 rounded-full bg-indigo-50 blur-3xl" />
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <div className="mb-4 flex justify-center -space-x-3">
              {TESTIMONIAL_AVATARS.map((src, i) => (
                <img
                  key={i}
                  alt={`User ${i + 1}`}
                  className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
                  src={src}
                />
              ))}
            </div>
            <p className="text-lg italic leading-relaxed text-on-surface md:text-xl">
              &ldquo;CampusFlow completely transformed my senior year. I went
              from scattered sticky notes to a fully automated academic
              life.&rdquo;
            </p>
            <div className="text-sm">
              <span className="font-bold text-primary">Alex Rivers</span>
              <span className="ml-2 text-on-surface-variant">
                Computer Science Senior
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      <BottomNav />
    </div>
  );
}
