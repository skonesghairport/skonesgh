import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ExternalLink,
  GraduationCap,
  LockKeyhole,
  Plane,
  Radar,
  ShieldCheck,
} from "lucide-react";

const destinations = [
  {
    title: "Security College",
    eyebrow: "Student portal",
    description:
      "Follow guided security foundations, operational readiness, and certification pathways curated by Skones Security.",
    href: "/education",
    icon: GraduationCap,
    tone: "bg-cyan-50 text-cyan-950 border-cyan-200",
    iconTone: "bg-cyan-950 text-cyan-200",
  },
  {
    title: "Resource directory",
    eyebrow: "Learn and verify",
    description:
      "Search free-first cybersecurity learning, provider-owned courses, and official links without embedding private content.",
    href: "/resources",
    icon: BookOpen,
    tone: "bg-white text-slate-950 border-slate-200",
    iconTone: "bg-slate-950 text-cyan-200",
  },
  {
    title: "Aviation awareness",
    eyebrow: "Official launch points",
    description:
      "Explore regional airline context and official FlightRadar24 airport quick views for responsible situational awareness.",
    href: "/resources#flight-tracker",
    icon: Plane,
    tone: "bg-slate-950 text-white border-slate-800",
    iconTone: "bg-cyan-300 text-slate-950",
  },
  {
    title: "Partnership pathways",
    eyebrow: "Future opportunities",
    description:
      "Review Ghana airport, immigration, G4S, ASIS, ICAO, exchange, and cross-deployment references with clear provider boundaries.",
    href: "/education#partnerships",
    icon: Building2,
    tone: "bg-amber-50 text-amber-950 border-amber-200",
    iconTone: "bg-amber-950 text-amber-200",
  },
] as const;

const principles = [
  {
    icon: ShieldCheck,
    title: "Skones-curated",
    description: "Original orientation, navigation, and learning guidance presented by Skones Security.",
  },
  {
    icon: ExternalLink,
    title: "Provider-owned",
    description: "External courses, data, prices, credentials, and enrollment terms remain with each provider.",
  },
  {
    icon: LockKeyhole,
    title: "Permission-aware",
    description: "Partnerships, affiliate claims, airport access, and cross-deployment require written authorization.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 p-1 dark:bg-white">
              <img
                src="/images/skones-security-logo.png"
                alt="Skones Security Limited logo"
                className="h-8 w-8 object-contain"
              />
            </span>
            <span>Skones Security Management</span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/resources"
              className="hidden text-sm text-slate-500 transition-colors hover:text-slate-950 sm:inline-flex dark:text-slate-300 dark:hover:text-white"
            >
              Explore resources
            </a>
            <Button asChild size="sm" className="rounded-full bg-slate-950 text-white hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200">
              <a href="/login">Management sign in</a>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-200">
              <Radar className="h-3.5 w-3.5" /> One management app
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-7xl dark:text-white">
              Manage operations. Learn deliberately. Observe responsibly.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A single Skones Security workspace for protected operations, student learning, official aviation awareness, and carefully labeled international security pathways.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200">
                <a href="/education">
                  Open student portal <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-5">
                <a href="/resources">Browse directory</a>
              </Button>
            </div>
          </div>

          <div className="border-l-2 border-cyan-300 pl-6 lg:mb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Skones Security Limited</p>
            <p className="mt-4 text-2xl font-medium leading-9 tracking-tight text-slate-900 dark:text-slate-100">
              A connected front door for the SOC, the student, and the responsible observer.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Public learning and awareness pages are open for discovery. Operational dashboards remain protected behind management sign-in.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {destinations.map((destination) => {
            const Icon = destination.icon;
            return (
              <a
                key={destination.title}
                href={destination.href}
                className={`group flex min-h-[210px] flex-col justify-between border p-6 transition-transform hover:-translate-y-1 ${destination.tone}`}
              >
                <div className="flex items-start justify-between gap-6">
                  <span className={`grid h-11 w-11 place-items-center rounded-2xl ${destination.iconTone}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-5 w-5 opacity-50 transition-transform group-hover:translate-x-1" />
                </div>
                <div className="mt-8">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-60">{destination.eyebrow}</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">{destination.title}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 opacity-75">{destination.description}</p>
                </div>
              </a>
            );
          })}
        </div>

        <section className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">How the hub stays trustworthy</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">One interface, clear ownership.</h2>
            </div>
            <a href="/education" className="inline-flex items-center text-sm font-semibold text-cyan-800 hover:text-cyan-950 dark:text-cyan-300 dark:hover:text-cyan-200">
              Read the education boundary notes <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <div key={principle.title} className="border-t border-slate-300 pt-4 dark:border-slate-700">
                  <Icon className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
                  <h3 className="mt-4 font-semibold">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{principle.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="mt-16 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:text-slate-400">
          <span>Presented by Skones Security Limited.</span>
          <span>External providers own their content, data, pricing, enrollment, and credentials.</span>
        </footer>
      </section>
    </main>
  );
}
