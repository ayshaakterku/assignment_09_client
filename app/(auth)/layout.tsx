import Image from "next/image";

// Split layout for auth pages (register, signin, ...):
// left: info card with image + tips (lg and up), right: white card holding the page (form).

const tips = [
  { title: "Use a real email", text: "Updates and resets are sent there." },
  { title: "Strong password", text: "8+ characters, letters and numbers." },
  { title: "Pick the right role", text: "Tutors and students get different dashboards." },
  { title: "Complete your profile", text: "Better profiles get better matches." },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-white px-4 py-6">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
        {/* Left: info card (hidden below lg) */}
        <aside className="relative hidden flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-sky-900 via-blue-950 to-teal-600 p-5 text-white shadow-2xl shadow-blue-950/25 lg:flex">
          {/* decorative glow */}
          <div className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full bg-white/15 blur-2xl" />

          <div className="relative flex flex-1 flex-col">
            {/* badge */}
            <div className="mt-4 flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-semibold backdrop-blur">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5l8-3z" />
              </svg>
              Create your account
            </div>

            <h2 className="mt-5 text-4xl font-extrabold tracking-tight">
              Join Mentor<span className="text-pink-200">Lagbe</span>
            </h2>
            <p className="mt-3 max-w-sm text-xs leading-6 text-white/85">
              Create a tutor or student account in a few steps and start using
              your dashboard right away.
            </p>

            {/* image card */}
            <div className="relative mt-5 min-h-72 flex-1 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
              <Image
                src="/sign-up.png"
                alt="Sign up illustration"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 0px"
                className="object-contain p-4"
              />
            </div>

            {/* tips, two columns */}
            <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
              {tips.map((t) => (
                <li key={t.title} className="flex gap-2">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-teal-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold">{t.title}</p>
                    <p className="text-[11px] leading-4 text-white/70">{t.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Right: form card */}
        <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/70 sm:p-6">
          {children}
        </section>
      </div>
    </main>
  );
}