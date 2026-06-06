import { ExternalLink, Network, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/70 bg-white/70 py-12 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
      <div className="absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(rgba(15,23,42,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.06)_1px,transparent_1px)] [background-size:34px_34px] dark:opacity-20 dark:[background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-28 w-2/3 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-white/70 bg-white/54 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-amber-300 dark:bg-white dark:text-emerald-700">
              <span className="absolute inset-0 rounded-full bg-emerald-400/25 blur-md" />
              <Zap size={20} className="relative" />
            </span>
            <div>
              <p className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">SolarVista</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Renewable infrastructure intelligence platform.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"
            >
              <ExternalLink size={16} />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"
            >
              <Network size={16} />
              LinkedIn
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
          <p>Built for renewable infrastructure intelligence</p>
          <p>© 2026 SolarVista. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
