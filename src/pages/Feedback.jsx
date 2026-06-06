import {
  Code2,
  ExternalLink,
  Mail,
  MessageSquareText,
  Send,
  Users,
} from "lucide-react";

const feedbackFormUrl = "https://forms.gle/CBnVFrtQB5HtAxND7";

const contactLinks = [
  {
    label: "Email",
    value: "ayushmanprakhar@gmail.com",
    href: "mailto:ayushmanprakhar@gmail.com",
    icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/ayushmanprakhar",
    href: "https://www.linkedin.com/in/ayushmanprakhar",
    icon: Users,
    external: true,
  },
  {
    label: "GitHub",
    value: "github.com/AyushmanPrakhar",
    href: "https://github.com/AyushmanPrakhar",
    icon: Code2,
    external: true,
  },
];

function ContactLink({ link }) {
  const Icon = link.icon;

  return (
    <a
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noreferrer" : undefined}
      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-amber-300 hover:text-slate-950 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-amber-400/40 dark:hover:bg-slate-800"
    >
      <span className="flex min-w-0 items-center gap-3">
        <Icon size={17} className="shrink-0 text-amber-600 dark:text-amber-300" />
        <span>{link.label}</span>
      </span>
      <span className="flex min-w-0 items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span className="hidden truncate sm:inline">{link.value}</span>
        {link.external && <ExternalLink size={14} className="shrink-0" />}
      </span>
    </a>
  );
}

export default function Feedback() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12 text-slate-900 dark:text-slate-100">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-amber-50 dark:bg-amber-400/10" />
        <div className="absolute bottom-0 left-0 h-28 w-28 rounded-tr-full bg-emerald-50 dark:bg-emerald-400/10" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_0.45fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
              <MessageSquareText size={14} />
              SolarVista feedback
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              Share Your Feedback
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
              Your feedback helps improve SolarVista and supports the development of future renewable energy, climate intelligence, and geospatial analytics features.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Share what works well, what needs refinement, and which platform capabilities would be most useful for your research, learning, or planning workflow.
            </p>
            <a
              href={feedbackFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-md"
            >
              <Send size={17} />
              Open Feedback Form
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/70">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-amber-400 dark:bg-white dark:text-slate-950">
              <MessageSquareText size={28} />
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Product Input
            </p>
            <p className="mt-2 text-xl font-bold tracking-tight text-[#0F172A] dark:text-white leading-snug">
              Help shape a clearer renewable intelligence dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-300">
          Developer Contact
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-[#0F172A] dark:text-white">
          Ayushman Prakhar
        </h2>
        <div className="mt-6 grid gap-3">
          {contactLinks.map((link) => (
            <ContactLink key={link.label} link={link} />
          ))}
        </div>
      </section>
    </div>
  );
}
