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
  return {
    title: `${doc.meta.title} — ${doc.meta.brand}`,
    description: doc.meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${doc.meta.title} — ${doc.meta.brand}`,
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
