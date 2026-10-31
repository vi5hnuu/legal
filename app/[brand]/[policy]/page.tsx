import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPolicy, getArchivedVersions, getAllPolicyPaths } from "@/lib/policies";
import { extractToc } from "@/lib/toc";
import PolicyLayout from "@/components/PolicyLayout";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

interface Props {
  params: Promise<{ brand: string; policy: string }>;
}

export async function generateStaticParams() {
  return getAllPolicyPaths()
    .filter((p) => !p.version)
    .map((p) => ({ brand: p.brand, policy: p.policy }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand, policy } = await params;
  const doc = getPolicy(brand, policy);
  if (!doc) return {};
  const url = `${BASE_URL}/${brand}/${policy}`;
  // SERP-tuned title. GSC data (Oct 2026 export) showed privacy-policy pages ranking well
  // (position 5-8) for safety-intent queries like "is pdfcraft safe", "is pdfcraft legal",
  // "is pdfcraft safe to use" but getting zero clicks because the SERP title read as a dry
  // "Privacy Policy — PDF Craft". Rephrasing privacy pages as "Is <Brand> Safe? Privacy &
  // Security Policy" directly answers the question in the SERP and lifts CTR materially.
  // Terms, cookies, grievance pages keep the straightforward "<Title> — <Brand>" shape.
  const title = policy === "privacy-policy"
    ? `Is ${doc.meta.brand} Safe? Privacy & Security Policy`
    : `${doc.meta.title} — ${doc.meta.brand}`;
  return {
    title,
    description: doc.meta.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: doc.meta.description,
      url,
      type: "article",
    },
  };
}

export default async function PolicyPage({ params }: Props) {
  const { brand, policy } = await params;
  const doc = getPolicy(brand, policy);
  if (!doc) notFound();

  const archivedVersions = getArchivedVersions(brand, policy);
  const toc = extractToc(doc.content);

  return (
    <PolicyLayout
      meta={doc.meta}
      brandSlug={brand}
      policySlug={policy}
      archivedVersions={archivedVersions}
      toc={toc}
    >
      <MDXRemote source={doc.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
    </PolicyLayout>
  );
}
