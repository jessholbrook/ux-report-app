import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          UX Research Reports
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Create shareable reports with before/after screenshot comparisons
          and interactive annotations. Present your findings with clarity.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/demo">Try the Demo</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>

      <div className="mt-20 grid max-w-4xl gap-8 sm:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Before & After</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Compare designs with an interactive slider or side-by-side view.
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Annotations</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Pin findings, implications, and changes directly on screenshots.
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Share Instantly</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Generate a public link or invite team members by email.
          </p>
        </div>
      </div>
    </div>
  );
}
