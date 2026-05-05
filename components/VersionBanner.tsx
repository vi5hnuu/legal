import Link from "next/link";

interface Props {
  brandSlug: string;
  policySlug: string;
  version: string;
}

export default function VersionBanner({ brandSlug, policySlug, version }: Props) {
  return (
    <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-md px-4 py-3 mb-8 flex items-start gap-3 text-sm print:hidden">
      <span className="text-amber-500 mt-0.5">⚠</span>
      <span>
        You are viewing an <strong>archived version</strong> from {version}.{" "}
        <Link
          href={`/${brandSlug}/${policySlug}`}
          className="underline font-medium hover:text-amber-700"
        >
          View current version →
        </Link>
      </span>
    </div>
  );
}
