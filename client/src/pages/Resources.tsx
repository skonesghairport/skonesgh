import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const courses = [
  {
    provider: "Cisco Skills for All",
    title: "Introduction to Cybersecurity",
    level: "Beginner",
    format: "Free course · about 6 hours · 7 labs",
    credential:
      "Free learning access; confirm the current completion record after sign-in",
    description:
      "A practical first step covering privacy, threats, vulnerabilities, and everyday defensive habits.",
    href: "https://skillsforall.com/course/introduction-to-cybersecurity",
    accent: "cyan",
  },
  {
    provider: "Cisco Skills for All",
    title: "Cybersecurity Essentials",
    level: "Beginner",
    format: "Free course",
    credential:
      "Prepares learners for the entry-level CCST Cybersecurity certification; the exam is separate",
    description:
      "Builds foundational knowledge for securing devices, networks, and organizations.",
    href: "https://skillsforall.com/course/cybersecurity-essentials?courseLang=en-US",
    accent: "blue",
  },
  {
    provider: "Microsoft Learn",
    title: "Describe the concepts of cybersecurity",
    level: "Beginner",
    format: "Free learning path · no prerequisites",
    credential:
      "Microsoft Learn achievement-code option is shown on the official path; certification is separate",
    description:
      "Learn the fundamentals of threats, cryptography, network security, device security, and application security.",
    href: "https://learn.microsoft.com/en-us/training/paths/describe-basic-concepts-of-cybersecurity/",
    accent: "violet",
  },
  {
    provider: "Coursera",
    title: "Cybersecurity course catalog",
    level: "Mixed",
    format: "Free previews; some programs offer a trial",
    credential:
      "Certificates generally require paid access or approved financial aid",
    description:
      "Compare Google, IBM, Microsoft, ISC2, and university-led cybersecurity courses in one catalog.",
    href: "https://www.coursera.org/courses?query=cybersecurity",
    accent: "amber",
  },
  {
    provider: "ISC2",
    title: "Certified in Cybersecurity (CC) transition page",
    level: "Entry-level",
    format: "Program status and credential information",
    credential:
      "The free One Million CC enrollment is closed; previously issued course access and exam codes may remain valid through the stated deadlines",
    description:
      "Use the official transition page to verify whether an existing free CC course or exam code is still active before relying on it.",
    href: "https://www.isc2.org/landing/1mcc",
    accent: "rose",
  },
  {
    provider: "NIST NICE",
    title: "Online cybersecurity learning directory",
    level: "All levels",
    format: "Free and low-cost resource directory",
    credential:
      "Credential status varies by provider; verify each course before enrolling",
    description:
      "A government-maintained directory of learning content, career resources, and cybersecurity education options.",
    href: "https://www.nist.gov/itl/applied-cybersecurity/nice/resources/online-learning-content",
    accent: "emerald",
  },
] as const;

const accentClasses = {
  cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  violet:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

function ExternalResourceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5"
    >
      {children}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  );
}

export default function Resources() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8fb] text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <section className="relative border-b border-slate-200/80 bg-white/85 dark:border-slate-800 dark:bg-slate-950/85">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_32%)]" />
        <div className="container relative py-10 sm:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <ShieldCheck className="h-4 w-4" />
              </span>
              Skones Security Desk
            </a>
            <Badge
              variant="outline"
              className="border-slate-300 bg-white/70 px-3 py-1 text-xs font-medium dark:border-slate-700 dark:bg-slate-900/70"
            >
              Checked August 22, 2026
            </Badge>
          </div>

          <div className="mt-14 max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" /> Field guide
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl dark:text-white">
              Tools, airspace, and learning paths for a sharper security
              practice.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
              A clean launchpad for operational awareness and cybersecurity
              education. External services open in a new tab; no credentials or
              private course content are embedded here.
            </p>
          </div>
        </div>
      </section>

      <section className="container grid gap-5 py-8 md:grid-cols-2">
        <Card className="overflow-hidden border-slate-200 bg-slate-950 text-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:shadow-none">
          <CardHeader className="relative pb-3">
            <div className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-300">
              <Plane className="h-6 w-6" />
            </div>
            <Badge className="w-fit border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/10">
              Live aviation context
            </Badge>
            <CardTitle className="mt-4 text-2xl tracking-tight">
              FlightRadar24
            </CardTitle>
            <CardDescription className="max-w-md text-slate-300">
              Open the official live flight tracker for situational awareness
              around airports, routes, and active traffic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="bg-white text-slate-950 hover:bg-cyan-50"
            >
              <ExternalResourceLink href="https://www.flightradar24.com/">
                Open flight tracker
              </ExternalResourceLink>
            </Button>
            <p className="mt-4 text-xs leading-5 text-slate-400">
              Availability, coverage, and features are controlled by the
              provider. This app does not mirror or scrape flight data.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <CardHeader className="pb-3">
            <Badge className="w-fit border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
              Course discovery
            </Badge>
            <CardTitle className="mt-4 text-2xl tracking-tight text-slate-950 dark:text-white">
              Coursera cybersecurity catalog
            </CardTitle>
            <CardDescription className="max-w-md text-slate-600 dark:text-slate-300">
              Compare beginner-to-intermediate cybersecurity courses from
              Google, IBM, Microsoft, ISC2, and universities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className="border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
            >
              <ExternalResourceLink href="https://www.coursera.org/courses?query=cybersecurity">
                Browse Coursera
              </ExternalResourceLink>
            </Button>
            <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Coursera currently describes free previews and trials;
              certificates generally require paid access or approved financial
              aid.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="container pb-16 pt-4">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end dark:border-slate-800">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
              Verified learning board
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Free-first cybersecurity courses
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              “Free” means the learning content is listed as free or publicly
              accessible. A completion certificate, exam, or professional
              credential may still have separate conditions.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Official
            source links only
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {courses.map(course => (
            <Card
              key={course.title}
              className="group border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {course.provider}
                    </p>
                    <CardTitle className="mt-2 text-xl tracking-tight text-slate-950 dark:text-white">
                      {course.title}
                    </CardTitle>
                  </div>
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${accentClasses[course.accent]}`}
                  >
                    <BookOpen className="h-5 w-5" />
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary">{course.level}</Badge>
                  <Badge
                    variant="outline"
                    className="border-slate-300 dark:border-slate-700"
                  >
                    {course.format}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {course.description}
                </p>
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                  <strong className="font-semibold text-slate-800 dark:text-slate-100">
                    Credential note:
                  </strong>{" "}
                  {course.credential}
                </div>
                <a
                  href={course.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-200"
                >
                  Open official resource{" "}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-950/70">
        <div className="container flex flex-col gap-3 py-6 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
          <span>
            Resource facts are time-sensitive. Re-check provider terms before
            enrolling or paying.
          </span>
          <span>External links open in a new tab.</span>
        </div>
      </footer>
    </main>
  );
}
