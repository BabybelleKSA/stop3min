"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/reports", label: "Reports" }
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 text-sm font-medium text-gray-700">
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-3 py-2 transition ${
              active ? "bg-primary text-white" : "hover:bg-gray-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
