import Image from "next/image";
import Link from "next/link";

type Props = {
  slug: string;
  name: string;
  durationDays: number;
  destinationName?: string | null;
  coverImageUrl?: string | null;
  /** Optional querystring (e.g. "groupSize=x&month=6") carried forward so the package page can prefill the enquiry form. */
  query?: string;
};

export function PackageCard({ slug, name, durationDays, destinationName, coverImageUrl, query }: Props) {
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

      <div className="mt-4 flex items-center justify-end border-t border-parchment-200 pt-3 text-xs">
        <span className="font-editorial text-foreground italic transition-colors group-hover:text-accent">
          View route →
        </span>
      </div>
    </Link>
  );
}
