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
      className="block overflow-hidden rounded-lg border border-zinc-200 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
    >
      {coverImageUrl ? (
        <Image src={coverImageUrl} alt={name} width={400} height={200} className="h-36 w-full object-cover" />
      ) : null}
      <div className="p-4">
        <p className="text-sm text-zinc-500">
          {durationDays} days
          {destinationName ? ` · ${destinationName}` : ""}
        </p>
        <p className="mt-1 text-lg font-semibold">{name}</p>
      </div>
    </Link>
  );
}
