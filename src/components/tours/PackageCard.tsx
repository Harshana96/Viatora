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
      className="group flex h-full flex-col border border-border bg-surface p-5 transition-all hover:border-foreground"
    >
      <div className="relative mb-4 h-48 w-full overflow-hidden bg-parchment-200">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={name}
            width={400}
            height={260}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <span className="absolute top-3 left-3 bg-foreground/90 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-background uppercase">
          {durationDays - 1} nights / {durationDays} days
        </span>
      </div>

      <div className="flex flex-1 flex-col">
        {destinationName ? (
          <p className="text-[10px] tracking-wider text-ceylon-tea uppercase">{destinationName}</p>
        ) : null}
        <h4 className="font-editorial text-xl font-semibold text-foreground transition-colors group-hover:text-accent">
          {name}
        </h4>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-parchment-200 pt-3 text-xs">
        {pricePerPerson != null ? (
          <div>
            <span className="block text-[10px] text-muted uppercase">From</span>
            <span className="font-editorial text-xl font-bold text-foreground">
              {formatCurrency(pricePerPerson)}
            </span>
            <span className="text-[11px] text-muted"> / person</span>
          </div>
        ) : (
          <span className="text-muted">Select group size for pricing</span>
        )}
        <span className="font-editorial text-foreground italic transition-colors group-hover:text-accent">
          View route →
        </span>
      </div>
    </Link>
  );
}
