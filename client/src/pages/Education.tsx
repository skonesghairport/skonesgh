import { ArrowUpRight, BookOpenCheck, GraduationCap, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tracks = [
  {
    title: "Security Foundations",
    level: "Start here",
    duration: "4 learning blocks",
    description: "Build a practical baseline in threat awareness, privacy, vulnerabilities, and defensive habits.",
    resources: ["Cisco Introduction to Cybersecurity", "Microsoft Learn fundamentals"],
  },
  {
    title: "Operational Readiness",
    level: "Applied practice",
    duration: "5 learning blocks",
    description: "Connect cyber hygiene to physical security operations, incident reporting, and responsible escalation.",
    resources: ["NIST NICE learning directory", "Skones Security field notes"],
  },
  {
    title: "Certification Pathways",
    level: "Next step",
    duration: "Self-paced",
    description: "Compare entry-level pathways and understand which completion records, exams, or certificates require separate conditions.",
    resources: ["Cisco Cybersecurity Essentials", "ISC2 CC status page", "Coursera catalog"],
  },
] as const;

const specialistResources = [
  {
    provider: "Ghana Airports Company Limited",
    title: "Aviation Security Training School",
    detail: "Official Ghana airport-security reference · private security and non-security staff scope described",
    label: "Provider confirmation required",
    href: "https://www.gacl.com.gh/aviation-security-training-school/",
  },
  {
    provider: "Ghana Civil Aviation Training Academy",
    title: "Aviation and security course catalog",
    detail: "Official Ghana aviation training reference · security, safety, dangerous goods, and operations",
    label: "Provider-priced / confirm",
    href: "https://www.gcaa.com.gh/gata/gata-courses/",
  },
  {
    provider: "Ghana Immigration Service",
    title: "Risk analysis and intelligence-led border management",
    detail: "Official government context · immigration and border-management capacity building",
    label: "Reference only",
    href: "https://gis.gov.gh/gis-begin-shift-sponsored-training-in-risk-analysis-and-intelligence-led-border-management/",
  },
  {
    provider: "ICAO",
    title: "Aviation Security Training Packages",
    detail: "Basic AVSEC, airport supervisors, air cargo, inspectors, managers, and behaviour detection",
    label: "International provider / confirm",
    href: "https://www.icao.int/isd-security/packages",
  },
  {
    provider: "G4S Academy",
    title: "Private-security learning and industry expertise",
    detail: "Official G4S reference · guarding, CCTV, door supervision, and close-protection examples vary by market",
    label: "G4S-owned / no Skones affiliation claimed",
    href: "https://www.g4s.com/en-za/what-we-do/g4s-academy",
  },
  {
    provider: "ASIS International",
    title: "Security professional education",
    detail: "Official international reference · webinars, certificates, executive education, and CPE pathways",
    label: "Free and paid options / confirm",
    href: "https://www.asisonline.org/professional-development/education/",
  },
] as const;

const onlineResources = [
  {
    provider: "Cisco Skills for All",
    title: "Introduction to Cybersecurity",
    detail: "Beginner · free learning access · practical labs",
    href: "https://skillsforall.com/course/introduction-to-cybersecurity",
  },
  {
    provider: "Microsoft Learn",
    title: "Describe the concepts of cybersecurity",
    detail: "Beginner · free learning path · no prerequisites",
    href: "https://learn.microsoft.com/en-us/training/paths/describe-basic-concepts-of-cybersecurity/",
  },
  {
    provider: "NIST NICE",
    title: "Online cybersecurity learning directory",
    detail: "All levels · official free and low-cost directory",
    href: "https://www.nist.gov/itl/applied-cybersecurity/nice/resources/online-learning-content",
  },
] as const;

export default function Education() {
  return (
    <main className="min-h-screen bg-[#f7fbfc] text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="/resources" className="flex items-center gap-3 text-sm font-semibold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 p-1">
              <img src="/images/skones-security-logo.png" alt="Skones Security Limited logo" className="h-7 w-7 object-contain" />
            </span>
            <span>Skones Security Desk</span>
          </a>
          <nav className="flex items-center gap-2 text-sm">
            <a href="/resources" className="rounded-full px-3 py-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-900 dark:hover:text-white">
              Resources
            </a>
            <a href="/education" className="rounded-full bg-cyan-100 px-3 py-2 font-semibold text-cyan-950 dark:bg-cyan-950 dark:text-cyan-200">
              College & Education
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-14 pt-16 sm:px-8 sm:pt-24">
        <div className="max-w-3xl">
          <Badge className="border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-200">
            Skones Security College
          </Badge>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Learn the habits that make security work sharper.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            A Skones Security learning hub for guided foundations, operational readiness, and carefully labeled online education resources. Content is credited to Skones Security; external courses open at their official provider sites.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200">
              <a href="#tracks">Explore learning tracks</a>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-5">
              <a href="/resources">View full resource directory</a>
            </Button>
          </div>
        </div>

        <div id="tracks" className="mt-16 grid gap-5 lg:grid-cols-3">
          {tracks.map(track => (
            <Card key={track.title} className="border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-cyan-300 dark:bg-cyan-950">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <Badge variant="secondary">{track.level}</Badge>
                </div>
                <CardTitle className="pt-3 text-xl">{track.title}</CardTitle>
                <CardDescription>{track.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{track.description}</p>
                <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
                  {track.resources.map(resource => (
                    <div key={resource} className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
                      <BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                      <span>{resource}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-20 border-t border-slate-200 pt-12 dark:border-slate-800">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">Ghana aviation & international security</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Specialist pathways, official sources only.</h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
              These references connect learners to Ghana airport and aviation training, immigration and border-management context, ICAO packages, and international private-security professional development. They are not sold, delivered, or endorsed by Skones Security unless a written agreement is publicly confirmed.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {specialistResources.map(resource => (
              <Card key={resource.title} className="border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{resource.provider}</p>
                      <h3 className="mt-1 font-semibold">{resource.title}</h3>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-[10px]">{resource.label}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{resource.detail}</p>
                  <Button asChild size="sm" variant="outline" className="mt-4 rounded-full">
                    <a href={resource.href} target="_blank" rel="noreferrer">
                      Official source <ArrowUpRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-8 border-t border-slate-200 pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">Online Education</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Official resources, clearly labeled.</h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
              Use the directory to compare free-first learning access with certification pathways. Provider terms change, so verify enrollment, exam, trial, and certificate conditions before committing time or money.
            </p>
          </div>
          <div className="space-y-3">
            {onlineResources.map(resource => (
              <Card key={resource.title} className="border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70">
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{resource.provider}</p>
                    <h3 className="mt-1 font-semibold">{resource.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{resource.detail}</p>
                  </div>
                  <Button asChild size="sm" variant="outline" className="shrink-0 rounded-full">
                    <a href={resource.href} target="_blank" rel="noreferrer">
                      Open <ArrowUpRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-amber-200 bg-amber-50/70 px-5 py-6 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          <p className="font-semibold">Exchange, cross-deployment, and airport partnerships</p>
          <p className="mt-2">Skones Security may explore future exchange programs, international private-security partnerships, and cross-deployment pathways with qualified firms and airports. These are opportunity concepts—not current programs, affiliate claims, job placements, or immigration arrangements. Participation would require written agreements, local licensing, airport authorization, safeguarding, and provider confirmation.</p>
        </section>

        <footer className="mt-20 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Skones Security College and Online Education are presented by Skones Security. External providers own their courses, data, access terms, pricing, and credentials.
        </footer>
      </section>
    </main>
  );
}
