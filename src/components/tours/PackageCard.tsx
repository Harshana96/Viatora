import Image from "next/image";
import Link from "next/link";

import { formatCurrency } from "@/lib/utils";

type Props = {
  slug: string;
  name: string;
  durationDays: number;
  destinationName?: string | null;
  coverImageUrl?: string | null;
  /** Estimated total per person for the selected group size + arrival month. Omit/null to hide the price. */
  pricePerPerson?: number | null;
  /** Optional querystring (e.g. "groupSize=x&month=6") carried forward so the package page can price it immediately. */
  query?: string;
};

export function PackageCard({
  slug,
  name,
  durationDays,
  destinationName,
  coverImageUrl,
  pricePerPerson,
  query,
}: Props) {
  return (
    <Link
      href={query ? `/tours/${slug}?${query}` : `/tours/${slug}`}
      className="group block border-t border-border pt-5 transition-colors"
    >
      {coverImageUrl ? (
        <Image
          src={coverImageUrl}
          alt={name}
          width={400}
          height={260}
          className="mb-4 h-44 w-full rounded-sm object-cover"
        />
      ) : null}
      <p className="text-xs tracking-[0.14em] text-muted uppercase">
        {durationDays - 1} nights / {durationDays} days
        {destinationName ? ` · ${destinationName}` : ""}
      </p>
      <p className="mt-2 font-serif text-2xl leading-snug transition-colors group-hover:text-accent">{name}</p>
      {pricePerPerson != null ? (
        <p className="mt-3 text-sm text-muted">
          Est. {formatCurrency(pricePerPerson)} <span className="text-muted/70">/ person</span>
        </p>
      ) : null}
    </Link>
  );
}
