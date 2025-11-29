import Link from "next/link";
import { StatsSnapshot } from "../components/StatsSnapshot";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-12">
      <section className="bg-gradient-to-b from-dark via-black to-gray-900 text-white">
        <div className="container-page py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-100">
                Consumer justice
              </p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Stop the $3 Minimum
              </h1>
              <p className="text-lg text-gray-200">
                Debit minimums are illegal. Everyday people are being overcharged every time they swipe. Here&apos;s how
                we fight back.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/report"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:translate-y-[-2px]"
                >
                  Report a Store
                </Link>
                <Link
                  href="/docs/know-your-rights"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Know Your Rights
                </Link>
              </div>
              <p className="text-sm text-gray-300">
                Together we document patterns, notify networks, and push for enforcement.
              </p>
            </div>
            <div className="card bg-white text-gray-900 shadow-2xl">
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">What we&apos;re seeing</h2>
                <p className="text-gray-700">
                  Debit minimums hit low-income, Black, and working-class communities the hardest. We collect evidence
                  to stop it.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    Debit minimums are not allowed by card networks.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    Credit card minimums up to $10 can be legal, but most stores stretch beyond.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    We log reports, surface patterns, and escalate to AGs, networks, and media.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-primary">How it works</p>
            <h2 className="text-3xl font-bold text-gray-900">See a sign. Report it. We escalate.</h2>
            <p className="text-gray-700">
              A simple 3-step workflow built for everyday people. We keep it quick, mobile-friendly, and anonymous by
              default.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "See a sign", body: "$3 minimum to use your card." },
              { title: "Submit a report", body: "Fill our 1-minute form with store info + photo link." },
              { title: "We document & escalate", body: "We log patterns and share with networks, AGs, and media." }
            ].map((step, idx) => (
              <div key={step.title} className="card flex flex-col gap-2 p-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold">
                  {idx + 1}
                </span>
                <p className="font-semibold text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-700">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="container-page space-y-6 py-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-primary">Why it matters</p>
              <h2 className="text-3xl font-bold text-gray-900">Debit minimums are not allowed. Period.</h2>
              <ul className="space-y-3 text-gray-700">
                <li>Card networks explicitly ban minimums on debit transactions.</li>
                <li>Credit card minimums up to $10 can be legal, but stores often misuse that rule.</li>
                <li>Low-income, Black, and working-class neighborhoods get hit hardest by predatory fees.</li>
              </ul>
            </div>
            <StatsSnapshot />
          </div>
        </div>
      </section>

      <section className="container-page">
        <div className="card grid gap-6 p-6 md:grid-cols-2 md:items-center">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">Take action</p>
            <h3 className="text-2xl font-bold text-gray-900">Found a sign like this? Report it and tag us.</h3>
            <p className="text-gray-700">
              Every report helps us map the problem, push networks to enforce their own rules, and keep communities
              informed.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-800">
              <span className="rounded-full bg-gray-100 px-3 py-1">@stop3min on TikTok</span>
              <span className="rounded-full bg-gray-100 px-3 py-1">@stop3min on Instagram</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl bg-gray-900 p-6 text-white">
            <p className="text-lg font-semibold">Ready to file?</p>
            <p className="text-sm text-gray-200">We keep it quick. Evidence helps. Shareable links are fine.</p>
            <Link
              href="/report"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-2px]"
            >
              Start a report
            </Link>
            <Link href="/docs/know-your-rights" className="text-sm text-gray-200 underline">
              Read the rights guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
