import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  CloudSun,
  Cpu,
  Database,
  Gauge,
  Layers,
  Leaf,
  Network,
  Satellite,
  ShieldCheck,
  Zap,
} from "lucide-react";

const kpis = [
  ["42.6 GW", "modeled renewable capacity"],
  ["610", "AQI districts monitored"],
  ["128+", "solar parks indexed"],
  ["2400+", "infrastructure assets tracked"],
];

const features = [
  [
    "Solar Generation Analytics",
    "Monitor state-wise generation output, seasonal variability, plant utilization trends, and renewable production efficiency through centralized operational dashboards.",
    BarChart3,
    "from-emerald-400/20 to-lime-300/10",
  ],
  [
    "AQI Intelligence",
    "Analyze aerosol concentration, particulate exposure, and atmospheric attenuation patterns that influence photovoltaic generation efficiency.",
    Activity,
    "from-sky-400/20 to-cyan-300/10",
  ],
  [
    "EPC Monitoring",
    "Track commissioning readiness, infrastructure milestones, contractor execution progress, and transmission dependency visibility across utility-scale projects.",
    Gauge,
    "from-amber-300/25 to-orange-200/10",
  ],
  [
    "Renewable Forecasting",
    "Estimate generation behavior using irradiance conditions, historical production patterns, cloud movement, and environmental exposure indicators.",
    CloudSun,
    "from-teal-300/20 to-sky-300/10",
  ],
  [
    "Operational Insights",
    "Detect operational irregularities, prioritize maintenance signals, and evaluate renewable infrastructure performance trends.",
    Cpu,
    "from-violet-300/18 to-fuchsia-300/10",
  ],
  [
    "Climate Intelligence",
    "Combine AQI overlays, atmospheric datasets, renewable telemetry, and infrastructure analytics into one operational intelligence layer.",
    Satellite,
    "from-lime-300/20 to-emerald-300/10",
  ],
];

const tickerItems = [
  "Rajasthan generation +6.4%",
  "AQI load elevated in NCR",
  "Tamil Nadu forecast stable",
  "Western grid utilization 91%",
  "Dust attenuation moderate",
  "Plant efficiency 94.2%",
];

const pipeline = [
  [
    "AQI APIs",
    "Ingest particulate concentration, aerosol exposure, and atmospheric quality indicators.",
    Activity,
  ],
  [
    "Environmental Processing",
    "Normalize environmental conditions including irradiance exposure, weather indicators, and aerosol density.",
    CloudSun,
  ],
  [
    "Generation Analytics",
    "Aggregate renewable generation trends, plant utilization patterns, and operational performance metrics.",
    BarChart3,
  ],
  [
    "Forecast Layer",
    "Estimate generation variability using irradiance, weather conditions, and historical renewable output.",
    Layers,
  ],
  [
    "Infrastructure Monitoring",
    "Track EPC progress indicators, transmission-linked infrastructure, and operational asset visibility.",
    Network,
  ],
  [
    "Operational Intelligence",
    "Convert infrastructure and environmental datasets into analytical visibility for renewable operations.",
    ShieldCheck,
  ],
];

const models = [
  ["Generation Forecast Model", "Estimate renewable generation trends using irradiance exposure and historical production patterns."],
  ["AQI Impact Scoring", "Evaluate atmospheric attenuation and particulate concentration impact on photovoltaic performance."],
  ["Operational Variance Detection", "Identify deviations between expected and observed renewable generation behavior."],
  ["Maintenance Priority Signals", "Surface infrastructure requiring inspection using operational and environmental indicators."],
  ["EPC Readiness Evaluation", "Track commissioning dependencies and infrastructure execution progress."],
  ["Grid Stability Monitoring", "Analyze renewable integration indicators and transmission-linked operational variability."],
];

const insights = [
  ["Generation Monitoring", "Monitor renewable output variability and regional generation behavior."],
  ["Environmental Exposure Tracking", "Evaluate aerosol concentration and atmospheric impact across operational regions."],
  ["EPC Coordination", "Track commissioning progress, execution readiness, and infrastructure dependencies."],
  ["Infrastructure Visibility", "Maintain centralized visibility into renewable assets, grid connectivity, and operational indicators."],
];

const modelStatuses = ["LIVE MODEL", "FORECAST ACTIVE", "AQI TRACKING", "GRID ONLINE"];

const dataSources = [
  [
    "NASA POWER API",
    "Solar irradiance, temperature, and atmospheric exposure indicators for renewable forecasting and environmental analytics.",
  ],
  [
    "OpenWeather AQI API",
    "Real-time AQI scoring, particulate concentration, and atmospheric pollution indicators.",
  ],
  [
    "Open-Meteo API",
    "Weather-aware renewable forecasting using cloud cover, temperature, and environmental conditions.",
  ],
  [
    "MNRE Renewable Statistics",
    "Renewable generation capacity, state infrastructure records, and operational solar datasets.",
  ],
  [
    "SECI Infrastructure Records",
    "Utility-scale solar park information and renewable infrastructure visibility.",
  ],
  [
    "CEA Operational Data",
    "Grid-linked renewable generation and national electricity statistics.",
  ],
];

function SectionLabel({ icon: Icon = Zap, children }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
      <Icon size={15} className="text-emerald-500" />
      {children}
    </div>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div className={`rounded-[2rem] border border-white/70 bg-white/64 shadow-[0_18px_60px_rgba(15,23,42,.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] ${className}`}>
      {children}
    </div>
  );
}

function OperationsTicker() {
  const repeatedItems = [...tickerItems, ...tickerItems];

  return (
    <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-3 shadow-[0_25px_80px_rgba(15,23,42,.16)] dark:border-white/10">
      <div className="relative overflow-hidden rounded-[1.45rem] border border-white/10 bg-white/[0.05] py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-slate-950 to-transparent" />
        <motion.div
          className="flex min-w-max gap-3 px-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {repeatedItems.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-slate-200"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,.85)]" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function PipelineSection() {
  return (
    <GlassCard className="mt-16 overflow-hidden p-3">
      <div className="relative rounded-[1.55rem] border border-slate-200/70 bg-slate-50 p-7 dark:border-white/10 dark:bg-slate-950">
        <div className="absolute inset-0 rounded-[1.55rem] opacity-40 [background-image:linear-gradient(rgba(15,23,42,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.08)_1px,transparent_1px)] [background-size:30px_30px] dark:opacity-20 dark:[background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)]" />
        <div className="pointer-events-none absolute left-10 top-10 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,.8)]" />
        <motion.div
          className="pointer-events-none absolute right-12 top-16 h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,.75)]"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -8, 0] }}
          transition={{ duration: 3.8, repeat: Infinity }}
        />
        <div className="relative">
          <div className="max-w-3xl">
            <SectionLabel icon={Layers}>PIPELINE ARCHITECTURE</SectionLabel>
            <h3 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Renewable infrastructure processing pipeline
            </h3>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
              SolarVista processes environmental, operational, and infrastructure datasets into analytical outputs supporting renewable planning and operational monitoring.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-6">
            {pipeline.map(([label, description, Icon], index) => (
              <div key={label} className="relative">
                {index < pipeline.length - 1 && (
                  <motion.div
                    className="absolute left-[calc(100%-2px)] top-14 z-0 hidden h-px w-4 bg-gradient-to-r from-emerald-400 to-sky-300 lg:block"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.15 }}
                  />
                )}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="relative z-10 h-full rounded-3xl border border-white/80 bg-white/72 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                    <Icon size={20} />
                  </div>
                  <p className="mt-5 text-sm font-semibold leading-6 text-slate-950 dark:text-white">{label}</p>
                  <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-white/10" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-4xl"
        >
          <SectionLabel>SOLARVISTA PLATFORM</SectionLabel>
          <h2 className="text-5xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
            Operational analytics for utility-scale renewable infrastructure
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            SolarVista combines generation analytics, AQI intelligence, EPC monitoring, and infrastructure visibility into a unified operational platform for renewable-energy systems.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map(([value, label], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-white/70 bg-white/64 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]"
            >
              <p className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</p>
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            </motion.div>
          ))}
        </div>

        <OperationsTicker />

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, description, Icon, gradient], index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/66 p-7 shadow-[0_18px_60px_rgba(15,23,42,.06)] backdrop-blur-xl transition dark:border-white/10 dark:bg-white/[0.045]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`} />
              <div className="relative">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/70 text-slate-950 shadow-sm dark:border-white/10 dark:bg-white/[0.08] dark:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h3>
                <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{description}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <PipelineSection />

        <div className="mt-16 grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}>
            <SectionLabel icon={Cpu}>ANALYTICAL MODELS</SectionLabel>
            <h3 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Data-assisted renewable operational intelligence
            </h3>
            <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">
              SolarVista applies analytical scoring, forecasting logic, and operational trend evaluation across renewable infrastructure systems.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {modelStatuses.map((status) => (
                <span
                  key={status}
                  className="rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
                >
                  {status}
                </span>
              ))}
            </div>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2">
            {models.map(([title, description], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="rounded-3xl border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]"
              >
                <span className="mb-5 block h-1.5 w-12 rounded-full bg-gradient-to-r from-emerald-400 to-sky-300" />
                <h4 className="font-semibold text-slate-950 dark:text-white">{title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-3 shadow-[0_35px_100px_rgba(15,23,42,.22)]">
          <div className="rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_18%_12%,rgba(16,185,129,.18),transparent_30%),radial-gradient(circle_at_80%_50%,rgba(56,189,248,.12),transparent_28%)] p-7">
            <div className="max-w-3xl text-white">
              <SectionLabel icon={ShieldCheck}>DECISION INTELLIGENCE</SectionLabel>
              <Leaf size={28} className="text-emerald-300" />
              <h3 className="mt-6 text-3xl font-semibold tracking-tight">
                Operational visibility for renewable infrastructure teams
              </h3>
              <p className="mt-4 leading-7 text-slate-300">
                SolarVista converts renewable generation, atmospheric exposure, and infrastructure datasets into centralized operational visibility for engineering and planning workflows.
              </p>
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {insights.map(([title, description], index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 text-white backdrop-blur"
                >
                  <Network size={20} className="text-emerald-300" />
                  <h4 className="mt-5 font-semibold">{title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <GlassCard className="mt-16 p-7">
          <div className="grid gap-8 lg:grid-cols-[.68fr_1.32fr]">
            <div>
              <SectionLabel icon={Database}>INTEGRATED DATA SOURCES</SectionLabel>
              <Database size={28} className="text-emerald-500" />
              <h3 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Connected renewable intelligence ecosystem
              </h3>
              <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
                SolarVista integrates environmental indicators, renewable generation records, infrastructure datasets, and operational telemetry into a centralized analytical workspace.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {dataSources.map(([source, description], index) => (
                <motion.div
                  key={source}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.72)]" />
                    <h4 className="font-semibold text-slate-950 dark:text-white">{source}</h4>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
