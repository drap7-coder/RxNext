export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#080b12] px-6 text-white">
      <section className="w-full max-w-4xl border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/30 sm:p-14">
        <div className="mb-20 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-white/50">
          <span>RxNext</span>
          <span className="flex items-center gap-2">
            <i className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_#34d399]" />
            Ready
          </span>
        </div>
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-violet-300">A clean foundation</p>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">The next thing starts here.</h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-white/55 sm:text-lg">
          RxNext is connected, deployed, and ready to become whatever comes next.
        </p>
        <div className="mt-14 h-px bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400" />
        <footer className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/35">
          <span>Next.js</span><span>TypeScript</span><span>Tailwind CSS</span><span>Vercel</span>
        </footer>
      </section>
    </main>
  );
}
