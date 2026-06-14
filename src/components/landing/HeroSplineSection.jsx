import { SplineScene } from "@/components/ui/spline";
import { Spotlight } from "@/components/ui/spotlight";

export default function HeroSplineSection() {
  return (
    <section className="relative left-1/2 mt-12 w-screen -translate-x-1/2 overflow-hidden">
      <div className="relative h-[560px] w-full bg-[#0a0a0a] sm:h-[600px] md:h-[640px]">
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="white"
        />

        <div className="relative flex h-full flex-col md:flex-row">
          {/* Left — text, padding only on left */}
          <div className="relative z-10 flex shrink-0 flex-col justify-center py-8 pl-margin-mobile md:w-[42%] md:max-w-[560px] md:py-10 md:pl-margin-desktop lg:w-[45%]">
            <h2 className="text-left text-3xl font-bold leading-tight tracking-tight text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text sm:text-4xl md:text-5xl">
              Never Miss What Matters
            </h2>
            <p className="mt-4 max-w-lg text-left text-sm leading-relaxed text-neutral-300 sm:text-base">
              CampusFlow brings together schedules, assignments, attendance,
              events, hostel updates, and placement opportunities into one
              AI-powered experience.
            </p>
          </div>

          {/* Right — Spline fills all the way to right edge */}
          <div className="relative min-h-[320px] flex-1 bg-[#0a0a0a] md:min-h-0">
            <div className="spline-wrap absolute inset-0 overflow-hidden">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="h-full w-full scale-[1.08] md:scale-[1.12] md:origin-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
