import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPolicy, getArchivedVersions, getAllPolicyPaths } from "@/lib/policies";
import PolicyLayout from "@/components/PolicyLayout";
import type { Metadata } from "next";

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
  return {
    title: `${doc.meta.title} — ${doc.meta.brand}`,
    description: doc.meta.description,
  };
}

export default async function PolicyPage({ params }: Props) {
  const { brand, policy } = await params;
  const doc = getPolicy(brand, policy);
  if (!doc) notFound();

  const archivedVersions = getArchivedVersions(brand, policy);

  return (
    <PolicyLayout
      meta={doc.meta}
      brandSlug={brand}
      policySlug={policy}
      archivedVersions={archivedVersions}
    >
      <MDXRemote source={doc.content} />
    </PolicyLayout>
  );
}
