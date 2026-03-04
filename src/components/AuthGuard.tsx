"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = useAppStore((s) => s.token);
  const loading = useAppStore((s) => s.loading);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-accent" />
          <p className="text-sm text-zinc-500">Loading…</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">
          Sign in to continue
        </h2>
        <p className="max-w-sm text-center text-sm text-zinc-600">
          You need to be logged in to access this page. Sign in or create an
          account to start tracking your English learning progress.
        </p>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
