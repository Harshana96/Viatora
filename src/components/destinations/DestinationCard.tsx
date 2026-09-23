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
    <Link href={`/destinations/${slug}`} className="group block border-t border-border pt-5 transition-colors">
      {imageUrl ? (
        <Image src={imageUrl} alt={name} width={400} height={260} className="mb-4 h-44 w-full rounded-sm object-cover" />
      ) : null}
      <p className="text-xs tracking-[0.14em] text-muted uppercase">{location}</p>
      <p className="mt-2 font-serif text-2xl leading-snug transition-colors group-hover:text-accent">{name}</p>
    </Link>
  );
}
