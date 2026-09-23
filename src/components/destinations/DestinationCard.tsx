import Image from "next/image";
import Link from "next/link";

type Props = {
  slug: string;
  name: string;
  location: string;
  imageUrl?: string | null;
};

export function DestinationCard({ slug, name, location, imageUrl }: Props) {
  return (
    <Link
      href={`/destinations/${slug}`}
      className="group flex h-full flex-col border border-border bg-surface p-5 transition-all hover:border-foreground"
    >
      <div className="relative mb-4 h-48 w-full overflow-hidden bg-parchment-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={400}
            height={260}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <p className="text-[10px] tracking-wider text-ceylon-tea uppercase">{location}</p>
      <h4 className="font-editorial text-xl font-semibold text-foreground transition-colors group-hover:text-accent">
        {name}
      </h4>
    </Link>
  );
}
