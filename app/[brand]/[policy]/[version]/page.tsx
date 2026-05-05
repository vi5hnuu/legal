import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPolicy, getArchivedVersions, getAllPolicyPaths } from "@/lib/policies";
import PolicyLayout from "@/components/PolicyLayout";
import VersionBanner from "@/components/VersionBanner";
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
    title: `${doc.meta.title} (${version}) — ${doc.meta.brand}`,
    description: doc.meta.description,
    robots: { index: false }, // don't index archived versions
  };
}

export default async function PolicyVersionPage({ params }: Props) {
  const { brand, policy, version } = await params;
  const doc = getPolicy(brand, policy, version);
  if (!doc) notFound();

  const archivedVersions = getArchivedVersions(brand, policy);

  return (
    <PolicyLayout
      meta={doc.meta}
      brandSlug={brand}
      policySlug={policy}
      archivedVersions={archivedVersions}
      isArchived
    >
      <VersionBanner brandSlug={brand} policySlug={policy} version={version} />
      <MDXRemote source={doc.content} />
    </PolicyLayout>
  );
}
