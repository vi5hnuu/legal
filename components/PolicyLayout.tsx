import Link from "next/link";
import type { PolicyMeta } from "@/lib/policies";
import PrintButton from "@/components/PrintButton";

interface Props {
  meta: PolicyMeta;
  brandSlug: string;
  policySlug: string;
  children: React.ReactNode;
  archivedVersions: string[];
  isArchived?: boolean;
}

export default function PolicyLayout({
  meta,
  brandSlug,
  policySlug,
  children,
  archivedVersions,
  isArchived = false,
}: Props) {
  const formattedDate = new Date(meta.effectiveDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top nav */}
      <header className="border-b border-gray-200 px-6 py-4 print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">
            ← All policies
          </Link>
          <PrintButton />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 lg:flex lg:gap-16">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 print:hidden">
          <div className="sticky top-10 space-y-6 text-sm">
            <div>
              <p className="font-semibold text-gray-800 mb-1">{meta.brand}</p>
              <p className="text-gray-500 capitalize">{policySlug.replace(/-/g, " ")}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Effective date
              </p>
              <p className="text-gray-700">{formattedDate}</p>
            </div>

            {archivedVersions.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Previous versions
                </p>
                <ul className="space-y-1">
                  {archivedVersions.map((v) => (
                    <li key={v}>
                      <Link
                        href={`/${brandSlug}/${policySlug}/${v}`}
                        className="text-gray-500 hover:text-gray-800 hover:underline"
                      >
                        {v}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-500 mb-1">{meta.brand}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {meta.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>Effective: {formattedDate}</span>
              {meta.lastUpdated !== meta.effectiveDate && (
                <span>
                  Updated:{" "}
                  {new Date(meta.lastUpdated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {isArchived && (
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-medium">
                  Archived
                </span>
              )}
            </div>
          </div>

          {/* MDX prose */}
          <div className="prose prose-gray max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h3:text-base prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-li:my-0.5">
            {children}
          </div>

          {/* Footer */}
          <div className="mt-16 pt-6 border-t border-gray-200 text-xs text-gray-400 print:hidden">
            <p>
              {meta.brand} · {meta.title} · Effective {formattedDate}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
