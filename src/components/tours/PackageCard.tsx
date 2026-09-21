import Image from "next/image";
import Link from "next/link";

type Props = {
  slug: string;
  name: string;
  durationDays: number;
  destinationName?: string | null;
  coverImageUrl?: string | null;
};

export function PackageCard({ slug, name, durationDays, destinationName, coverImageUrl }: Props) {
  return (
    <Link
      href={`/tours/${slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-stone-900"
    >
      <div className="aspect-[4/3] overflow-hidden">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={name}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 via-amber-100 to-accent/10 dark:from-accent/15 dark:via-stone-800 dark:to-accent/5">
            <span className="text-sm font-medium text-accent">{name}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium tracking-wide text-accent uppercase">
          {durationDays} {durationDays === 1 ? "day" : "days"}
          {destinationName ? ` · ${destinationName}` : ""}
        </p>
        <p className="mt-1.5 text-lg font-semibold text-stone-900 dark:text-stone-50">{name}</p>
      </div>
    </Link>
  );
}
