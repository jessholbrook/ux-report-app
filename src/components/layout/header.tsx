"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "./auth-button";
import { cn } from "@/lib/utils";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === "/" || (pathname.startsWith("/reports") && !pathname.startsWith("/ai-reports"))
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "text-sm transition-colors",
        isActive
          ? "text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          UX Report
        </Link>
        <nav className="flex items-center gap-4">
          <NavLink href="/">Reports</NavLink>
          <NavLink href="/ai-reports">AI Reports</NavLink>
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
