import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white font-bold">
            $
          </span>
          <span>Stop the $3 Minimum</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/report" className="hover:text-primary transition">
            Report
          </Link>
          <Link href="/docs/know-your-rights" className="hover:text-primary transition">
            Know Your Rights
          </Link>
          <Link href="/docs/how-to-report-directly" className="hover:text-primary transition">
            How to Report
          </Link>
          <Link href="/admin/login" className="hover:text-primary transition">
            Admin
          </Link>
        </nav>
        <Link
          href="/report"
          className="ml-4 inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:translate-y-[-1px] transition"
        >
          Report a Store
        </Link>
      </div>
    </header>
  );
}
