import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Filter,
  MapPin,
  Plane,
  RotateCcw,
  Search,
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
    credentialType: "Learning access",
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
    credentialType: "Certification pathway",
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
    credentialType: "Achievement option",
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
    credentialType: "Preview / trial",
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
    credentialType: "Credential status",
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
    credentialType: "Directory",
    description:
      "A government-maintained directory of learning content, career resources, and cybersecurity education options.",
    href: "https://www.nist.gov/itl/applied-cybersecurity/nice/resources/online-learning-content",
    accent: "emerald",
  },
] as const;

const flightViews = [
  {
    id: "global",
    label: "Global map",
    detail: "Live worldwide traffic",
    href: "https://www.flightradar24.com/",
    regions: ["all"],
  },
  {
    id: "atl",
    label: "ATL airport",
    detail: "Atlanta / Hartsfield–Jackson",
    href: "https://www.flightradar24.com/data/airports/atl",
    regions: ["all", "north-america"],
  },
  {
    id: "jfk",
    label: "JFK airport",
    detail: "New York / John F. Kennedy",
    href: "https://www.flightradar24.com/data/airports/jfk",
    regions: ["all", "north-america"],
  },
  {
    id: "yyz",
    label: "YYZ airport",
    detail: "Toronto Pearson",
    href: "https://www.flightradar24.com/data/airports/yyz",
    regions: ["all", "north-america"],
  },
  {
    id: "mex",
    label: "MEX airport",
    detail: "Mexico City International",
    href: "https://www.flightradar24.com/data/airports/mex",
    regions: ["all", "north-america", "latin-america"],
  },
  {
    id: "lhr",
    label: "LHR airport",
    detail: "London Heathrow",
    href: "https://www.flightradar24.com/data/airports/lhr",
    regions: ["all", "europe"],
  },
  {
    id: "cdg",
    label: "CDG airport",
    detail: "Paris Charles de Gaulle",
    href: "https://www.flightradar24.com/data/airports/cdg",
    regions: ["all", "europe"],
  },
  {
    id: "fra",
    label: "FRA airport",
    detail: "Frankfurt Airport",
    href: "https://www.flightradar24.com/data/airports/fra",
    regions: ["all", "europe"],
  },
  {
    id: "ams",
    label: "AMS airport",
    detail: "Amsterdam Schiphol",
    href: "https://www.flightradar24.com/data/airports/ams",
    regions: ["all", "europe"],
  },
  {
    id: "dxb",
    label: "DXB airport",
    detail: "Dubai International",
    href: "https://www.flightradar24.com/data/airports/dxb",
    regions: ["all", "middle-east"],
  },
  {
    id: "doh",
    label: "DOH airport",
    detail: "Hamad International",
    href: "https://www.flightradar24.com/data/airports/doh",
    regions: ["all", "middle-east"],
  },
  {
    id: "hnd",
    label: "HND airport",
    detail: "Tokyo Haneda",
    href: "https://www.flightradar24.com/data/airports/hnd",
    regions: ["all", "asia-pacific"],
  },
  {
    id: "sin",
    label: "SIN airport",
    detail: "Singapore Changi",
    href: "https://www.flightradar24.com/data/airports/sin",
    regions: ["all", "asia-pacific"],
  },
  {
    id: "syd",
    label: "SYD airport",
    detail: "Sydney Kingsford Smith",
    href: "https://www.flightradar24.com/data/airports/syd",
    regions: ["all", "asia-pacific"],
  },
  {
    id: "gru",
    label: "GRU airport",
    detail: "São Paulo Guarulhos",
    href: "https://www.flightradar24.com/data/airports/gru",
    regions: ["all", "latin-america"],
  },
  {
    id: "jnb",
    label: "JNB airport",
    detail: "O. R. Tambo International",
    href: "https://www.flightradar24.com/data/airports/jnb",
    regions: ["all", "africa"],
  },
] as const;

const airlineRegions = [
  { id: "all", label: "All regions", airlines: "Global network" },
  {
    id: "north-america",
    label: "North America",
    airlines: "Delta · American · United · Air Canada",
  },
  {
    id: "europe",
    label: "Europe",
    airlines: "British Airways · Air France · Lufthansa · KLM",
  },
  {
    id: "middle-east",
    label: "Middle East",
    airlines: "Emirates · Qatar Airways · Etihad",
  },
  {
    id: "asia-pacific",
    label: "Asia-Pacific",
    airlines: "ANA · Singapore Airlines · Qantas · Cathay Pacific",
  },
  {
    id: "latin-america",
    label: "Latin America",
    airlines: "LATAM · Aeroméxico · Avianca · Copa Airlines",
  },
  {
    id: "africa",
    label: "Africa",
    airlines: "South African Airways · Ethiopian · Kenya Airways",
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
  children: ReactNode;
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
  const [query, setQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState("All providers");
  const [levelFilter, setLevelFilter] = useState("All levels");
  const [credentialFilter, setCredentialFilter] = useState(
    "All credential paths"
  );
  const [flightViewId, setFlightViewId] =
    useState<(typeof flightViews)[number]["id"]>("global");
  const [airlineRegionId, setAirlineRegionId] = useState("all");

  const providers = useMemo(
    () => [
      "All providers",
      ...Array.from(new Set(courses.map(course => course.provider))),
    ],
    []
  );
  const levels = useMemo(
    () => [
      "All levels",
      ...Array.from(new Set(courses.map(course => course.level))),
    ],
    []
  );
  const credentialTypes = useMemo(
    () => [
      "All credential paths",
      ...Array.from(new Set(courses.map(course => course.credentialType))),
    ],
    []
  );

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return courses.filter(course => {
      const searchableText =
        `${course.provider} ${course.title} ${course.description} ${course.format} ${course.credential}`.toLowerCase();
      return (
        (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
        (providerFilter === "All providers" ||
          course.provider === providerFilter) &&
        (levelFilter === "All levels" || course.level === levelFilter) &&
        (credentialFilter === "All credential paths" ||
          course.credentialType === credentialFilter)
      );
    });
  }, [credentialFilter, levelFilter, providerFilter, query]);

  const hasActiveFilters = Boolean(
    query ||
      providerFilter !== "All providers" ||
      levelFilter !== "All levels" ||
      credentialFilter !== "All credential paths"
  );
  const visibleFlightViews = useMemo(
    () =>
      flightViews.filter(view =>
        view.regions.some(region => region === airlineRegionId)
      ),
    [airlineRegionId]
  );
  const selectedFlightView =
    visibleFlightViews.find(view => view.id === flightViewId) ??
    visibleFlightViews[0] ??
    flightViews[0];
  const selectedAirlineRegion =
    airlineRegions.find(region => region.id === airlineRegionId) ??
    airlineRegions[0];

  function resetFilters() {
    setQuery("");
    setProviderFilter("All providers");
    setLevelFilter("All levels");
    setCredentialFilter("All credential paths");
  }

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
              Choose a quick view, then open the official tracker in a new tab.
              This app does not mirror or scrape flight data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-200">
                  Regional airline filter
                </span>
                <select
                  data-testid="airline-region-filter"
                  value={airlineRegionId}
                  onChange={event => setAirlineRegionId(event.target.value)}
                  className="h-9 w-full rounded-lg border border-white/15 bg-slate-900 px-2 text-xs text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                >
                  {airlineRegions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </label>
              <p
                data-testid="airline-region-summary"
                className="mt-2 text-[11px] leading-4 text-slate-400"
              >
                Representative carriers: {selectedAirlineRegion.airlines}
              </p>
            </div>
            <div
              className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1"
              role="group"
              aria-label="Flight tracker quick views"
            >
              {visibleFlightViews.map(view => (
                <button
                  key={view.id}
                  type="button"
                  data-testid={`flight-quick-view-${view.id}`}
                  onClick={() => setFlightViewId(view.id)}
                  aria-pressed={flightViewId === view.id}
                  className={`rounded-xl border px-3 py-2 text-left text-xs transition-colors ${flightViewId === view.id ? "border-cyan-300 bg-cyan-300/15 text-white" : "border-white/15 bg-white/5 text-slate-300 hover:border-cyan-300/50 hover:bg-white/10"}`}
                >
                  <span className="block font-semibold">{view.label}</span>
                  <span className="mt-0.5 block text-[11px] text-slate-400">
                    {view.detail}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-cyan-300" />{" "}
                {selectedFlightView.detail}
              </div>
              <Button
                asChild
                className="bg-white text-slate-950 hover:bg-cyan-50"
              >
                <a
                  href={selectedFlightView.href}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="flight-tracker-link"
                  className="inline-flex items-center gap-1.5"
                >
                  Open {selectedFlightView.label}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </Button>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-400">
              Coverage and features are controlled by FlightRadar24. Quick views
              are official provider URLs.
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

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <label className="min-w-0 flex-1">
              <span className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                <Search className="h-3.5 w-3.5" /> Search resources
              </span>
              <input
                data-testid="resource-search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Try “beginner”, “labs”, or “certificate”"
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none ring-offset-2 transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Provider
              </span>
              <select
                data-testid="provider-filter"
                value={providerFilter}
                onChange={event => setProviderFilter(event.target.value)}
                className="h-10 w-full min-w-44 rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                {providers.map(provider => (
                  <option key={provider}>{provider}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Level
              </span>
              <select
                data-testid="level-filter"
                value={levelFilter}
                onChange={event => setLevelFilter(event.target.value)}
                className="h-10 w-full min-w-36 rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                {levels.map(level => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Credential path
              </span>
              <select
                data-testid="credential-filter"
                value={credentialFilter}
                onChange={event => setCredentialFilter(event.target.value)}
                className="h-10 w-full min-w-44 rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                {credentialTypes.map(type => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <Button
              type="button"
              variant="ghost"
              disabled={!hasActiveFilters}
              onClick={resetFilters}
              className="h-10 gap-2 text-slate-600 dark:text-slate-300"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span
              data-testid="resource-count"
              className="inline-flex items-center gap-1.5"
            >
              <Filter className="h-3.5 w-3.5" /> Showing{" "}
              {filteredCourses.length} of {courses.length} resources
            </span>
            {hasActiveFilters && <span>Filters update instantly</span>}
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {filteredCourses.map(course => (
              <Card
                data-testid="resource-card"
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
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="font-semibold text-slate-900 dark:text-white">
              No resources match those filters.
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Try a broader search or reset the filters to see the full catalog.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="mt-5 gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Clear filters
            </Button>
          </div>
        )}
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
