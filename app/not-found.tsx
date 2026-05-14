import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl font-bold text-gray-200 mb-6 select-none">404</p>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">
        Page not found
      </h1>
      <p className="text-sm text-gray-500 mb-8 max-w-xs">
        This policy or version does not exist. It may have been moved or the URL
        is incorrect.
      </p>
      <Link
        href="/"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Browse all policies
      </Link>
    </div>
  );
}
