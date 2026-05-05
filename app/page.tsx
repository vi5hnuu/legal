import Link from "next/link";
import { getAllBrands, getPoliciesForBrand, getPolicy } from "@/lib/policies";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Policies",
  description: "Privacy policies, terms of service, and other legal documents.",
};

export default function IndexPage() {
  const brands = getAllBrands();

  const items = brands.flatMap((brand) =>
    getPoliciesForBrand(brand).map((policy) => {
      const doc = getPolicy(brand, policy);
      return { brand, policy, meta: doc?.meta };
    })
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Policies</h1>
        <p className="text-gray-500 mb-12 text-sm">
          Official legal documents for all products.
        </p>

        <div className="divide-y divide-gray-100">
          {items.map(({ brand, policy, meta }) => (
            <Link
              key={`${brand}/${policy}`}
              href={`/${brand}/${policy}`}
              className="flex items-start justify-between py-4 group"
            >
              <div>
                <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {meta?.title ?? policy.replace(/-/g, " ")}
                </p>
                <p className="text-sm text-gray-500 mt-0.5 capitalize">
                  {meta?.brand ?? brand}
                </p>
              </div>
              <div className="text-right text-sm text-gray-400 shrink-0 ml-8">
                {meta?.effectiveDate
                  ? new Date(meta.effectiveDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : null}
              </div>
            </Link>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-gray-400 text-sm">No policies found.</p>
        )}
      </div>
    </div>
  );
}
