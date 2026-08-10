"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ToastProvider";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/quotes", label: "Get Quote" },
  { href: "/admin/orders", label: "Track Orders" },
  { href: "/admin/newsletter", label: "Newsletter" },
];

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [loggingOut, setLoggingOut] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      success("Logged out");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toastError("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f7f5f2]">
      <aside className="w-56 shrink-0 border-r border-black/10 bg-white p-4">
        <Link href="/admin" className="font-serif text-xl tracking-wide">
          MH Admin
        </Link>
        <nav className="mt-6 space-y-1 text-sm">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-2 py-2 ${active ? "bg-black text-white" : "hover:bg-black/5"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="mt-8 px-2 text-xs uppercase tracking-widest text-red-700 disabled:opacity-50"
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
        <Link href="/" className="mt-4 block px-2 text-xs text-neutral-500">
          View site →
        </Link>
      </aside>
      <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
