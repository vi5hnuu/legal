import { notFound } from "next/navigation";
import Link from "next/link";
import { getPolicy, getArchivedVersions, getAllPolicyPaths } from "@/lib/policies";
import { diffLines } from "@/lib/diff";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ brand: string; policy: string; version: string }>;
}

export async function generateStaticParams() {
  return getAllPolicyPaths()
    .filter((p) => !!p.version)
    .map((p) => ({ brand: p.brand, policy: p.policy, version: p.version! }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand, policy, version } = await params;
  const doc = getPolicy(brand, policy, version);
  if (!doc) return {};
  return {
    title: `Changes in ${version} — ${doc.meta.title}`,
    robots: { index: false },
  };
}

export default async function DiffPage({ params }: Props) {
  const { brand, policy, version } = await params;

  const archived = getPolicy(brand, policy, version);
  const current = getPolicy(brand, policy);
  if (!archived || !current) notFound();

  const archivedVersions = getArchivedVersions(brand, policy);
  const versionIndex = archivedVersions.indexOf(version);
  const previousVersion =
    versionIndex + 1 < archivedVersions.length
      ? archivedVersions[versionIndex + 1]
      : null;

  const oldContent = previousVersion
    ? (getPolicy(brand, policy, previousVersion)?.content ?? "")
    : "";
  const newContent = archived.content;

  const lines = diffLines(oldContent, newContent);
  const hasChanges = lines.some((l) => l.type !== "equal");

  const removedCount = lines.filter((l) => l.type === "remove").length;
  const addedCount = lines.filter((l) => l.type === "add").length;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href={`/${brand}/${policy}/${version}`} className="text-sm text-gray-500 hover:text-gray-800">
            ← Back to {version}
          </Link>
          <Link href={`/${brand}/${policy}`} className="text-sm text-gray-500 hover:text-gray-800">
            View current →
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">{archived.meta.brand}</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {archived.meta.title}
          </h1>
          <p className="text-sm text-gray-500">
            {previousVersion ? (
              <>
                Changes introduced in version <strong>{version}</strong>{" "}
                compared to <strong>{previousVersion}</strong>
              </>
            ) : (
              <>
                Version <strong>{version}</strong> — initial version (nothing to compare against)
              </>
            )}
          </p>
          {hasChanges && (
            <div className="mt-3 flex gap-4 text-sm">
              <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded">
                +{addedCount} added
              </span>
              <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded">
                −{removedCount} removed
              </span>
            </div>
          )}
        </div>

        {!hasChanges || !previousVersion ? (
          <div className="text-gray-400 text-sm border border-gray-100 rounded-md px-4 py-8 text-center">
            {previousVersion
              ? "No textual differences between these versions."
              : "This is the first version — no previous version to compare against."}
          </div>
        ) : (
          <div className="font-mono text-xs border border-gray-200 rounded-md overflow-auto">
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, i) => {
                  if (line.type === "equal") {
                    return (
                      <tr key={i} className="text-gray-500">
                        <td className="w-6 select-none text-gray-300 pl-2 pr-3 text-right border-r border-gray-100 align-top py-0.5">
                          {" "}
                        </td>
                        <td className="pl-3 py-0.5 whitespace-pre-wrap break-all">
                          {line.text}
                        </td>
                      </tr>
                    );
                  }
                  if (line.type === "remove") {
                    return (
                      <tr key={i} className="bg-red-50">
                        <td className="w-6 select-none text-red-400 pl-2 pr-3 text-right border-r border-red-100 align-top py-0.5 font-bold">
                          −
                        </td>
                        <td className="pl-3 py-0.5 text-red-800 whitespace-pre-wrap break-all">
                          {line.text}
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={i} className="bg-green-50">
                      <td className="w-6 select-none text-green-500 pl-2 pr-3 text-right border-r border-green-100 align-top py-0.5 font-bold">
                        +
                      </td>
                      <td className="pl-3 py-0.5 text-green-800 whitespace-pre-wrap break-all">
                        {line.text}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
