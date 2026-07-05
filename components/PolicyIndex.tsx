"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface IndexPolicy {
  policySlug: string;
  title: string;
  effectiveDate: string | null;
  description: string;
}

export interface IndexBrand {
  brandSlug: string;
  brandName: string;
  policies: IndexPolicy[];
}

const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-indigo-600",
  "from-fuchsia-500 to-pink-600",
  "from-lime-500 to-emerald-600",
];

function gradientFor(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PolicyIcon({ slug }: { slug: string }) {
  const isPrivacy = slug.includes("privacy");
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-hover/row:bg-blue-50 group-hover/row:text-blue-600 transition-colors">
      {isPrivacy ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.8}>
          <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.5 12l1.8 1.8L15 10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.8}>
          <path d="M7 3h7l4 4v14H7V3z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 3v4h4M9.5 12h5M9.5 15.5h5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

export default function PolicyIndex({ brands }: { brands: IndexBrand[] }) {
  const [query, setQuery] = useState("");

  const totalDocs = useMemo(
    () => brands.reduce((n, b) => n + b.policies.length, 0),
    [brands]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;
    return brands
      .map((b) => {
        const brandMatch = b.brandName.toLowerCase().includes(q);
        const policies = brandMatch
          ? b.policies
          : b.policies.filter(
              (p) =>
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q)
            );
        return { ...b, policies };
      })
      .filter((b) => b.policies.length > 0);
  }, [brands, query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-gray-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 text-white">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.8}>
                <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="font-semibold tracking-tight">Legal Center</span>
          </div>
          <span className="hidden text-sm text-gray-400 sm:block">
            {brands.length} apps · {totalDocs} documents
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Official legal documents
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Privacy &amp; Terms,
            <br className="hidden sm:block" /> all in one place.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-500">
            Browse the privacy policies and terms of service for every one of our
            apps. Each document lists its effective date and full version history.
          </p>
        </div>

        {/* Search */}
        <div className="mt-8 max-w-xl">
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps or documents…"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 py-20 text-center">
            <p className="text-gray-500">No documents match “{query}”.</p>
            <button
              onClick={() => setQuery("")}
              className="mt-3 text-sm font-medium text-blue-600 hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((brand) => (
              <div
                key={brand.brandSlug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
              >
                {/* Card header */}
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradientFor(
                      brand.brandSlug
                    )} text-sm font-semibold text-white shadow-sm`}
                  >
                    {initials(brand.brandName)}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-gray-900">
                      {brand.brandName}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {brand.policies.length}{" "}
                      {brand.policies.length === 1 ? "document" : "documents"}
                    </p>
                  </div>
                </div>

                {/* Policy rows */}
                <div className="flex flex-1 flex-col p-2">
                  {brand.policies.map((p) => (
                    <Link
                      key={p.policySlug}
                      href={`/${brand.brandSlug}/${p.policySlug}`}
                      className="group/row flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-gray-50"
                    >
                      <PolicyIcon slug={p.policySlug} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800 group-hover/row:text-blue-600">
                          {p.title}
                        </p>
                        {formatDate(p.effectiveDate) && (
                          <p className="text-xs text-gray-400">
                            Effective {formatDate(p.effectiveDate)}
                          </p>
                        )}
                      </div>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4 shrink-0 text-gray-300 transition-all group-hover/row:translate-x-0.5 group-hover/row:text-blue-500"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-gray-400 sm:flex-row">
          <p>© {new Date().getFullYear()} · Legal Center</p>
          <p>All documents are provided for informational purposes.</p>
        </div>
      </footer>
    </div>
  );
}
