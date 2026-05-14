import type { MetadataRoute } from "next";
import { getAllPolicyPaths, getPolicy } from "@/lib/policies";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  for (const { brand, policy, version } of getAllPolicyPaths()) {
    if (version) continue; // archived versions are noindex — exclude from sitemap

    const doc = getPolicy(brand, policy);
    entries.push({
      url: `${BASE_URL}/${brand}/${policy}`,
      lastModified: doc?.meta.lastUpdated
        ? new Date(doc.meta.lastUpdated)
        : undefined,
      changeFrequency: "yearly",
      priority: 0.8,
    });
  }

  return entries;
}
