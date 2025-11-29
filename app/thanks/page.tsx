import Link from "next/link";

export default function ThanksPage() {
  return (
    <div className="container-page py-16">
      <div className="card mx-auto max-w-xl space-y-6 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Report received. You just helped your community.</h1>
        <p className="text-gray-700">
          We log every report, look for patterns, and push networks and regulators to enforce the rules.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/report"
            className="inline-flex justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px]"
          >
            Report another store
          </Link>
          <Link href="/" className="inline-flex justify-center rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
