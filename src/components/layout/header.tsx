"use client";

import Link from "next/link";
import { AuthButton } from "./auth-button";

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          UX Report
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/demo"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Demo
          </Link>
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
