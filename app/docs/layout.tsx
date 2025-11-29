import Link from "next/link";

const links = [
  { href: "/docs/know-your-rights", label: "Know Your Rights" },
  { href: "/docs/how-to-report-directly", label: "How to Report Directly" },
  { href: "/docs/for-store-owners", label: "For Store Owners" }
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page py-12">
      <div className="grid gap-8 lg:grid-cols-[240px,1fr]">
        <aside className="card h-fit p-4">
          <p className="mb-3 text-sm font-semibold text-gray-800">Docs</p>
          <nav className="space-y-2 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-lg px-3 py-2 hover:bg-gray-100">
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
