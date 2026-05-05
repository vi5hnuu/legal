import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface PolicyMeta {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  brand: string;
  brandSlug: string;
  description: string;
  versions: { date: string; label: string }[];
}

export interface Policy {
  meta: PolicyMeta;
  content: string;
  brandSlug: string;
  policySlug: string;
  version: string | null; // null = current
}

export function getAllBrands(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR).filter((f) =>
    fs.statSync(path.join(CONTENT_DIR, f)).isDirectory()
  );
}

export function getPoliciesForBrand(brandSlug: string): string[] {
  const brandDir = path.join(CONTENT_DIR, brandSlug);
  if (!fs.existsSync(brandDir)) return [];
  return fs.readdirSync(brandDir).filter((f) =>
    fs.statSync(path.join(brandDir, f)).isDirectory()
  );
}

export function getPolicy(
  brandSlug: string,
  policySlug: string,
  version?: string
): Policy | null {
  const filename = version ? `${version}.mdx` : "current.mdx";
  const filePath = path.join(CONTENT_DIR, brandSlug, policySlug, filename);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: data as PolicyMeta,
    content,
    brandSlug,
    policySlug,
    version: version ?? null,
  };
}

export function getArchivedVersions(
  brandSlug: string,
  policySlug: string
): string[] {
  const dir = path.join(CONTENT_DIR, brandSlug, policySlug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f !== "current.mdx" && f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""))
    .sort()
    .reverse();
}

export function getAllPolicyPaths(): {
  brand: string;
  policy: string;
  version?: string;
}[] {
  const paths: { brand: string; policy: string; version?: string }[] = [];

  for (const brand of getAllBrands()) {
    for (const policy of getPoliciesForBrand(brand)) {
      paths.push({ brand, policy });
      for (const version of getArchivedVersions(brand, policy)) {
        paths.push({ brand, policy, version });
      }
    }
  }

  return paths;
}
