import { motion } from "framer-motion";
import { Activity, BatteryCharging, Factory, Gauge, Network, RadioTower, Wrench, Zap } from "lucide-react";

const epcMetrics = [
  ["Plant efficiency", "94.8%", Gauge],
  ["Inverter uptime", "99.2%", BatteryCharging],
  ["Maintenance alerts", "18", Wrench],
  ["Project tracked", "312 MW", Factory],
  ["Grid nodes", "41", RadioTower],
];

function EpcIllustration() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-5 text-white shadow-[0_35px_100px_rgba(15,23,42,.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(16,185,129,.25),transparent_32%),radial-gradient(circle_at_86%_78%,rgba(56,189,248,.18),transparent_30%)]" />
      <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:30px_30px]" />
      <svg viewBox="0 0 820 410" className="relative h-auto w-full" role="img" aria-label="EPC engineering renewable infrastructure illustration">
        <g fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600">
          <path d="M68 318h690" />
          <path d="M128 318l78-102h126l-78 102zM278 318l78-102h126l-78 102zM428 318l78-102h126l-78 102z" />
          <path d="M604 318l48-139 48 139M626 247h52M616 286h72" />
          <path d="M85 318V184h82v134M106 184v-42h39v42" />
          <path d="M731 318V132h32v186M700 132h94M713 96h68" />
          <path d="M654 179c28-40 72-40 100 0M704 145v173" />
        </g>
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <motion.path
            d="M113 164C224 70 374 97 488 160s172 89 297-35"
            className="text-emerald-400"
            strokeDasharray="12 15"
            animate={{ strokeDashoffset: [0, -140] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M205 245h426"
            className="text-sky-300"
            strokeDasharray="8 12"
            animate={{ strokeDashoffset: [0, -100] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
          />
        </g>
        {[205, 355, 505, 631].map((cx, index) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy="245"
            r="8"
            className={index % 2 ? "fill-sky-300" : "fill-amber-300"}
            animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.25, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.3 }}
          />
        ))}
      </svg>
    </div>
  );
}

function ForecastIntelligencePanel() {
  const kpis = [
    ["Forecast confidence", "94%"],
    ["Irradiance trend", "Stable"],
    ["AQI attenuation", "Moderate"],
    ["Grid availability", "High"],
    ["Renewable utilization", "89%"],
  ];

  return (
    <section id="dashboard-preview" className="mt-24">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-600 dark:text-emerald-300">SaaS showcase</p>
          <h3 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Analytics, AQI, EPC, and forecast views.
          </h3>
        </div>
        <p className="max-w-lg text-slate-600 dark:text-slate-300">
          Enterprise renewable forecasting with irradiance, cloud cover, AQI attenuation, and grid availability context.
        </p>
      </div>

      <div className="overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/64 p-3 shadow-[0_35px_100px_rgba(15,23,42,.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.045]">
        <div className="rounded-[1.65rem] border border-slate-200/70 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950">
          <div className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
              <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(15,23,42,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.08)_1px,transparent_1px)] [background-size:32px_32px] dark:opacity-20 dark:[background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Renewable forecasting intelligence</p>
                  <p className="mt-1 text-3xl font-semibold text-slate-950 dark:text-white">14-day operational outlook</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                  Forecast active
                </span>
              </div>

              <div className="relative mt-8 h-[330px]">
                <svg viewBox="0 0 760 320" className="relative h-full w-full" role="img" aria-label="Animated renewable forecasting chart">
                  <defs>
                    <linearGradient id="forecastArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.36" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="forecastLine" x1="0" x2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="55%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <path d="M34 270h690M34 212h690M34 154h690M34 96h690M34 38h690" stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeWidth="1" />
                  <motion.path
                    d="M40 232 C108 210 132 174 194 184 C262 195 282 126 346 138 C414 150 438 88 502 98 C574 110 598 72 724 58 L724 288 L40 288 Z"
                    fill="url(#forecastArea)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  />
                  <motion.path
                    d="M40 232 C108 210 132 174 194 184 C262 195 282 126 346 138 C414 150 438 88 502 98 C574 110 598 72 724 58"
                    fill="none"
                    stroke="url(#forecastLine)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                  />
                  <motion.path
                    d="M40 186 C136 178 198 210 280 190 C366 170 420 194 512 168 C604 142 648 154 724 132"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="8 10"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.25 }}
                  />
                  <motion.path
                    d="M40 118 C116 132 172 112 242 122 C326 134 402 118 484 128 C590 142 640 116 724 126"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="5 9"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.4 }}
                  />
                  {[
                    [194, 184, "Cloud cover"],
                    [346, 138, "AQI attenuation"],
                    [502, 98, "Irradiance stable"],
                    [724, 58, "Peak output"],
                  ].map(([cx, cy, label], index) => (
                    <g key={label}>
                      <motion.circle
                        cx={cx}
                        cy={cy}
                        r="6"
                        fill="#f8fafc"
                        stroke="#10b981"
                        strokeWidth="3"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.75, 1, 0.75] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.25 }}
                      />
                    </g>
                  ))}
                </svg>
                <div className="absolute left-6 top-8 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Forecast confidence</p>
                  <p className="text-2xl font-semibold text-slate-950 dark:text-white">94%</p>
                </div>
                <div className="absolute bottom-8 right-6 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Variance range</p>
                  <p className="text-2xl font-semibold text-slate-950 dark:text-white">+/- 4.8%</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              {kpis.map(([label, value], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]"
                >
                  <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-sky-400 to-amber-300"
                      initial={{ width: "18%" }}
                      whileInView={{ width: `${72 + index * 5}%` }}
                      viewport={{ once: true }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function EpcSection() {
  return (
    <section id="epc" className="relative py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
              <Network size={16} className="text-emerald-500" />
              EPC engineering surface
            </div>
            <h2 className="text-5xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
              Infrastructure operations with boardroom-grade clarity.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              A premium engineering visualization layer for plant efficiency, inverter monitoring, maintenance alerts, project execution, and transmission analytics.
            </p>
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {epcMetrics.map(([label, value, Icon]) => (
                <div key={label} className="rounded-3xl border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <Icon size={22} className="text-emerald-500" />
                    <Activity size={17} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div>
            <EpcIllustration />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Substations", "Offshore energy", "Grid systems"].map((label) => (
                <div key={label} className="rounded-3xl border border-white/70 bg-white/60 p-5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
                  <Zap size={18} className="mb-4 text-emerald-500" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <ForecastIntelligencePanel />
      </div>
    </section>
  );
}
