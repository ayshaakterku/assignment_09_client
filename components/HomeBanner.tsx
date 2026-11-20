import Image from "next/image";
import Link from "next/link";

// Sample data: replace with real counts from your API / database.
const divisions = [
  { name: "Dhaka", count: 12480 },
  { name: "Chattogram", count: 4932 },
  { name: "Rajshahi", count: 1876 },
  // `live` adds the small red indicator dot shown in the design.
  { name: "Khulna", count: 2213, live: true },
  { name: "Barishal", count: 763 },
  { name: "Sylhet", count: 1540 },
  { name: "Rangpur", count: 1122 },
  { name: "Mymensingh", count: 987 },
];

// Image file names contain spaces, so they are URL-encoded here.
// (Renaming them to e.g. tuition-student-training.png is cleaner.)
const HERO_IMG = "/tuition%20student%20training.png";
const JOBS_IMG = "/summer%20vacation%20teache.png";

const ctaClass =
  "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8a1f8a] to-[#4c0d52] px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_24px_-6px_rgba(138,31,138,0.55)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#150a24]";

export default function Banner() {
  return (
    <>
      {/* animations: slow vertical float + horizontal marquee */}
      <style>{`
        @keyframes float-y {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-14px); }
        }
        @keyframes marquee-x {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .float-y        { animation: float-y 4s ease-in-out infinite alternate; }
        .float-y-slow   { animation: float-y 5s ease-in-out infinite alternate; animation-delay: -2s; }
        .marquee-track  { animation: marquee-x 28s linear infinite; }
        .marquee:hover .marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .float-y, .float-y-slow, .marquee-track { animation: none; }
        }
      `}</style>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f3f6fd] via-[#eef2fb] to-[#e8eefb] dark:from-[#1a0f2e] dark:via-[#150a24] dark:to-[#12081f]">
        {/* decorative soft shapes */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-40 size-[520px] rounded-full bg-[#dfe8fb] dark:bg-fuchsia-800/15" />
          <div className="absolute -right-4 -top-52 size-[380px] rounded-full bg-[#e9effc] dark:bg-purple-800/10" />
          <div className="absolute -left-32 bottom-4 size-80 rounded-full bg-[#e3eafa] dark:bg-purple-900/15" />
        </div>

        {/* white wave into the next section */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-background sm:h-32"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
        >
          <path fill="currentColor" d="M0 160C480 150 960 90 1440 24V160H0Z" />
        </svg>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 px-4 pt-8 pb-20 sm:px-6 sm:pt-10 sm:pb-24 md:grid-cols-[1.1fr_0.9fr] lg:px-8">
          {/* text */}
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-[40px]">
              <span className="text-purple-800 dark:text-purple-300">Best</span>{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Tutoring Platform
              </span>
              <br />
              <span className="text-fuchsia-800 dark:text-fuchsia-400">
                for Home &amp; Online Tuitions
              </span>
            </h1>

            <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <svg
                className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
              </svg>
              Find the Right Tutor in Your Area
            </p>

            <Link href="/find-tutor" className={`mt-5 ${ctaClass}`}>
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
              </svg>
              Find a tutor
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
              </svg>
            </Link>

            {/* divisional tutors marquee */}
            <p className="mt-6 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
              Divisional Tutors:
            </p>
            <div
              className="marquee mt-2 overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
              }}
            >
              <div className="marquee-track flex w-max gap-3">
                {[...divisions, ...divisions].map((d, i) => (
                  <span
                    key={`${d.name}-${i}`}
                    aria-hidden={i >= divisions.length}
                    className="flex min-w-[150px] items-center justify-center gap-2 whitespace-nowrap rounded-full border border-zinc-200 bg-white px-6 py-2 text-[11px] font-bold text-purple-900 shadow-sm sm:min-w-[160px] dark:border-white/10 dark:bg-white/10 dark:text-purple-100"
                  >
                    {d.name}: {d.count.toLocaleString()}
                    {"live" in d && d.live ? (
                      <span
                        aria-hidden
                        className="size-1.5 shrink-0 rounded-full bg-red-500"
                      />
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* floating image (kept unchanged) */}
          <div className="float-y relative mx-auto h-48 w-full max-w-sm sm:h-60 md:h-64 md:max-w-md md:justify-self-end">
            <Image
              src={HERO_IMG}
              alt="Tuition student training illustration"
              fill
              preload
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* ================= SEARCH JOBS ================= */}
      <section className="bg-background py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-[22px] font-extrabold uppercase tracking-[0.08em] text-[#0f2747] sm:text-[26px] dark:text-white">
              Search Tutoring Jobs
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base dark:text-slate-400">
              Find Your Tuition Jobs, in your area
            </p>
          </div>

          <div className="mt-10 grid items-center gap-8 md:grid-cols-2">
            {/* floating image (kept unchanged) */}
            <div className="float-y-slow relative mx-auto h-64 w-full max-w-lg sm:h-80">
              <Image
                src={JOBS_IMG}
                alt="Summer vacation teacher illustration"
                fill
                sizes="(min-width: 768px) 45vw, 90vw"
                className="object-contain"
              />
            </div>

            {/* text */}
            <div className="text-center">
              <h3 className="mx-auto max-w-md text-base font-bold text-[#0f2747] sm:text-lg dark:text-white">
                Looking for interesting tuition jobs to excel your teaching
                experience?
              </h3>
              <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-slate-500 sm:text-sm dark:text-slate-400">
                If teaching interests you, you are in the right place. Whether you
                are starting your career as a tuition teacher or you are an expert
                in your field, you can search and apply to the tuition jobs that
                best fit your skills, favorable location, class and subjects.
              </p>

              <Link
                href="/browse-tuitions"
                className="mt-6 inline-flex items-center gap-2 rounded bg-gradient-to-r from-[#8a1f8a] to-[#4c0d52] px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_24px_-6px_rgba(76,13,82,0.5)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
                </svg>
                Search tuition
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
