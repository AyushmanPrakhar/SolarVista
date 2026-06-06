import { motion } from "framer-motion";
import { ArrowRight, BatteryCharging, Gauge, Leaf, MapPinned } from "lucide-react";

const metrics = [
  ["Parks monitored", "128+"],
  ["Capacity modeled", "42.6 GW"],
  ["AQI districts", "610"],
  ["EPC assets", "2,400+"],
];

function HeroEnergyScene() {
  const particles = [
    [118, 126, 0],
    [184, 104, 0.5],
    [302, 137, 1],
    [458, 112, 1.4],
    [594, 128, 0.8],
    [708, 104, 1.7],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.15 }}
      className="relative"
    >
      <div className="absolute -inset-10 rounded-[3rem] bg-[radial-gradient(circle_at_26%_20%,rgba(16,185,129,.35),transparent_30%),radial-gradient(circle_at_78%_30%,rgba(56,189,248,.22),transparent_34%),radial-gradient(circle_at_48%_92%,rgba(245,158,11,.22),transparent_34%)] blur-3xl" />
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/68 p-3 shadow-[0_42px_120px_rgba(15,23,42,.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[0_42px_130px_rgba(0,0,0,.5)]">
        <div className="relative overflow-hidden rounded-[1.65rem] border border-slate-200/70 bg-slate-950 text-white dark:border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(16,185,129,.20),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(56,189,248,.16),transparent_30%),linear-gradient(180deg,rgba(15,23,42,.95),rgba(2,6,23,1))]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.24)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.24)_1px,transparent_1px)] [background-size:30px_30px]" />
          <motion.div
            className="absolute left-0 top-16 h-24 w-full bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"
            animate={{ x: ["-80%", "80%"], opacity: [0, 0.85, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              Utility grid live
            </span>
          </div>

          <div className="relative p-5">
            <svg viewBox="0 0 820 520" className="h-auto w-full" role="img" aria-label="Animated utility-scale renewable energy operating system visual">
              <defs>
                <linearGradient id="beamGradient" x1="0" x2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="48%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="panelGradient" x1="0" x2="1">
                  <stop offset="0%" stopColor="#0f766e" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              <g fill="none" stroke="rgba(148,163,184,.32)" strokeWidth="2">
                <path d="M46 412h724" />
                <path d="M74 444c180-34 322-28 440-9s196 25 282-3" />
              </g>

              <g>
                {[72, 182, 292, 402].map((x, index) => (
                  <g key={x} transform={`translate(${x} ${310 + (index % 2) * 18}) skewX(-18)`}>
                    <rect width="96" height="58" rx="6" fill="url(#panelGradient)" opacity="0.88" />
                    <path d="M0 19h96M0 38h96M24 0v58M48 0v58M72 0v58" stroke="rgba(255,255,255,.42)" strokeWidth="1" />
                    <motion.rect
                      width="96"
                      height="58"
                      rx="6"
                      fill="white"
                      opacity="0.16"
                      animate={{ x: [-80, 100] }}
                      transition={{ duration: 4.8, repeat: Infinity, delay: index * 0.25, ease: "easeInOut" }}
                    />
                  </g>
                ))}
              </g>

              <g fill="none" stroke="rgba(148,163,184,.55)" strokeWidth="3">
                <path d="M560 410l50-154 50 154M583 322h54M573 366h74" />
                <path d="M704 410l38-122 38 122M722 344h40M714 382h58" />
                <path d="M620 255c30-35 76-34 112 1" />
                <path d="M80 410V300h90v110M103 300v-44h44v44" />
                <path d="M188 410V278h62v132M202 300h34M202 330h34M202 360h34" />
              </g>

              <g fill="none" stroke="url(#beamGradient)" strokeWidth="4">
                <motion.path
                  d="M116 296C220 178 378 184 512 268s194 69 260-42"
                  strokeDasharray="14 18"
                  animate={{ strokeDashoffset: [0, -160] }}
                  transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                  d="M128 394h480c62 0 104-22 146-72"
                  strokeDasharray="10 14"
                  animate={{ strokeDashoffset: [0, -130] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
              </g>

              <g>
                {particles.map(([cx, cy, delay]) => (
                  <motion.circle
                    key={`${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="#fde68a"
                    animate={{ opacity: [0.2, 1, 0.2], y: [0, -10, 0], scale: [0.8, 1.3, 0.8] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay }}
                  />
                ))}
              </g>

              <motion.circle
                cx="650"
                cy="108"
                r="28"
                fill="#fcd34d"
                animate={{ opacity: [0.72, 1, 0.72], scale: [1, 1.06, 1] }}
                transition={{ duration: 4.2, repeat: Infinity }}
              />
              <path d="M650 54v24M650 138v24M596 108h24M680 108h24M612 70l18 18M670 128l18 18M612 146l18-18M670 88l18-18" stroke="#fcd34d" strokeWidth="4" strokeLinecap="round" />

              <g>
                {[
                  ["PV output", "7.84 GW", 72, 94],
                  ["Storage reserve", "82%", 522, 320],
                  ["Grid pulse", "91%", 626, 190],
                ].map(([label, value, x, y], index) => (
                  <foreignObject key={label} x={x} y={y} width="160" height="78">
                    <motion.div
                      className="rounded-2xl border border-white/10 bg-white/10 p-3 text-white backdrop-blur-xl"
                      animate={{ y: [0, index % 2 ? 8 : -8, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, delay: index * 0.3 }}
                    >
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-300">{label}</div>
                      <div className="mt-1 text-xl font-semibold">{value}</div>
                    </motion.div>
                  </foreignObject>
                ))}
              </g>
            </svg>
          </div>
        </div>

        <motion.div
          className="absolute -left-7 top-20 hidden rounded-3xl border border-white/80 bg-white/86 p-4 shadow-[0_25px_70px_rgba(15,23,42,.16)] backdrop-blur-2xl md:block dark:border-white/10 dark:bg-slate-950/80"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
              <Gauge size={18} />
            </span>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Plant efficiency</p>
              <p className="text-xl font-semibold text-slate-950 dark:text-white">94.8%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute -right-6 bottom-14 hidden rounded-3xl border border-white/80 bg-white/86 p-4 shadow-[0_25px_70px_rgba(15,23,42,.16)] backdrop-blur-2xl md:block dark:border-white/10 dark:bg-slate-950/80"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4.4, repeat: Infinity, delay: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-amber-100 p-2 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
              <BatteryCharging size={18} />
            </span>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Storage reserve</p>
              <p className="text-xl font-semibold text-slate-950 dark:text-white">82%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function EnergyGridVisual() {
  return (
    <svg viewBox="0 0 900 260" className="h-auto w-full" role="img" aria-label="Animated renewable-energy skyline">
      <defs>
        <linearGradient id="heroLine" x1="0" x2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="55%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 dark:text-white/15">
        <path d="M35 215h830" />
        <path d="M92 215l42-110 42 110M112 158h44M103 188h62" />
        <path d="M230 215l56-68h94l-56 68zM326 215l56-68h94l-56 68z" />
        <path d="M535 215V118h82v97M554 147h44M554 176h44M558 118V85h40v33" />
        <path d="M678 215l43-110 43 110M698 158h46M689 188h64" />
        <path d="M812 215V91h28v124M789 91h74M798 66h56" />
      </g>
      <g fill="none" stroke="url(#heroLine)" strokeWidth="3">
        <motion.path d="M74 121C184 38 306 68 420 116s233 77 386-22" strokeDasharray="10 16" animate={{ strokeDashoffset: [0, -140] }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }} />
        <motion.path d="M132 231c148-30 270-26 386-5s216 25 309-6" strokeDasharray="8 14" animate={{ strokeDashoffset: [0, -120] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
      </g>
      <motion.circle cx="635" cy="58" r="18" className="fill-amber-300" animate={{ opacity: [0.75, 1, 0.75], scale: [1, 1.08, 1] }} transition={{ duration: 3.5, repeat: Infinity }} />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden pb-24 pt-32 sm:pt-40">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_14%,rgba(16,185,129,.18),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(56,189,248,.16),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#ffffff_48%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_16%_14%,rgba(16,185,129,.16),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(56,189,248,.13),transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_52%,#020617_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[.88fr_1.12fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/68 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200">
            <Leaf size={16} className="text-emerald-500" />
            Climate-tech command center for renewable operators
          </div>
          <h1 className="max-w-4xl text-6xl font-semibold leading-[0.94] tracking-tight text-slate-950 dark:text-white sm:text-7xl lg:text-[5.8rem]">
            The intelligence layer for solar infrastructure.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            SolarVista turns generation, AQI, EPC progress, and grid telemetry into a premium operating system for utility-scale renewable-energy teams.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#dashboard-preview" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(15,23,42,.20)] transition hover:-translate-y-0.5 hover:bg-emerald-700 dark:bg-white dark:text-slate-950">
              View platform <ArrowRight size={18} />
            </a>
            <a href="#map" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-6 py-4 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-emerald-300 dark:border-white/10 dark:bg-white/[0.05] dark:text-white">
              Explore network <MapPinned size={18} />
            </a>
          </div>
        </motion.div>

        <HeroEnergyScene />
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-3 rounded-[2rem] border border-white/70 bg-white/55 p-3 shadow-[0_24px_80px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(([label, value], index) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="rounded-3xl border border-slate-200/60 bg-white/72 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
              <p className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</p>
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-5 sm:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/45 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]">
          <EnergyGridVisual />
        </div>
      </div>
    </section>
  );
}
