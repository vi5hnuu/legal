import { getAllBrands, getPoliciesForBrand, getPolicy } from "@/lib/policies";
import PolicyIndex, { type IndexBrand } from "@/components/PolicyIndex";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Policies",
  description: "Privacy policies, terms of service, and other legal documents.",
};

export default function IndexPage() {
  const brands: IndexBrand[] = getAllBrands()
    .map((brand) => {
      const policies = getPoliciesForBrand(brand)
        .map((policy) => {
          const doc = getPolicy(brand, policy);
          if (!doc) return null;
          return {
            policySlug: policy,
            title: doc.meta.title ?? policy.replace(/-/g, " "),
            effectiveDate: doc.meta.effectiveDate ?? null,
            description: doc.meta.description ?? "",
          };
        })
        .filter((p): p is NonNullable<typeof p> => p !== null)
        // Privacy policy first, then terms, then anything else
        .sort((a, b) => a.policySlug.localeCompare(b.policySlug));

      const brandName = policies.length
        ? getPolicy(brand, getPoliciesForBrand(brand)[0])?.meta.brand ?? brand
        : brand;

      return { brandSlug: brand, brandName, policies };
    })
    .filter((b) => b.policies.length > 0)
    .sort((a, b) => a.brandName.localeCompare(b.brandName));

  return <PolicyIndex brands={brands} />;
}
