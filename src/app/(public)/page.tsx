import type { TravelType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

import { JourneyExplorer } from "@/components/itinerary/JourneyExplorer";
import { formatCurrency } from "@/lib/utils";
import { travelTypeLabels } from "@/lib/travel-type";
import { listDestinationOptions, listPopularDestinations } from "@/server/destinations/actions";
import { listPublishedPackages, getPackageBySlug } from "@/server/tours/actions";
import type { JourneyDay } from "@/types";

export const dynamic = "force-dynamic";

const durationOptions = [
  { value: "short", label: "1-3 Days" },
  { value: "medium", label: "4-7 Days" },
  { value: "long", label: "8+ Days" },
];

type CategoryMeta = {
  icon: string;
  subtitle: string;
  tag: string;
  iconBg: string;
  iconText: string;
  tagBg: string;
  tagText: string;
};

const categoryMeta: Record<TravelType, CategoryMeta> = {
  ADVENTURE: {
    icon: "hiking",
    subtitle: "Ella Rock, Knuckles",
    tag: "Trek & Peaks",
    iconBg: "bg-secondary-fixed",
    iconText: "text-secondary",
    tagBg: "bg-secondary-fixed",
    tagText: "text-on-secondary-fixed",
  },
  CULTURAL: {
    icon: "account_balance",
    subtitle: "Sigiriya, Dambulla",
    tag: "Ancient Cities",
    iconBg: "bg-sand-tint",
    iconText: "text-secondary",
    tagBg: "bg-sand-tint",
    tagText: "text-secondary",
  },
  BEACH: {
    icon: "surfing",
    subtitle: "Mirissa, Nilaveli",
    tag: "Coastal Surf",
    iconBg: "bg-primary-fixed",
    iconText: "text-primary",
    tagBg: "bg-primary-fixed",
    tagText: "text-primary",
  },
  WILDLIFE: {
    icon: "pets",
    subtitle: "Yala & Udawalawe",
    tag: "Safari Country",
    iconBg: "bg-tertiary-fixed",
    iconText: "text-tertiary",
    tagBg: "bg-tertiary-fixed",
    tagText: "text-on-tertiary-fixed",
  },
  HONEYMOON: {
    icon: "favorite",
    subtitle: "Scenic hill country",
    tag: "Couples Hideaways",
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
    tagBg: "bg-rose-100",
    tagText: "text-rose-700",
  },
  FAMILY: {
    icon: "family_restroom",
    subtitle: "Trains & tea estates",
    tag: "All Ages Relax",
    iconBg: "bg-amber-100",
    iconText: "text-amber-700",
    tagBg: "bg-amber-100",
    tagText: "text-amber-800",
  },
  WELLNESS: {
    icon: "spa",
    subtitle: "Holistic sanctuaries",
    tag: "Mind & Body",
    iconBg: "bg-emerald-100",
    iconText: "text-tertiary",
    tagBg: "bg-emerald-100",
    tagText: "text-tertiary",
  },
};

const whySriLanka = [
  {
    icon: "landscape",
    title: "Diverse landscapes",
    description: "Beaches, hill country tea plantations, rainforest and ancient cities within a few hours of each other.",
  },
  {
    icon: "account_balance",
    title: "Rich culture & heritage",
    description: "Centuries-old temples, colonial towns and UNESCO World Heritage sites across the island.",
  },
  {
    icon: "forest",
    title: "Wildlife & nature",
    description: "National parks home to elephants, leopards and whales, alongside lush botanical gardens.",
  },
  {
    icon: "diversity_3",
    title: "Warm hospitality",
    description: "A small, easy-to-navigate island known for welcoming visitors and unhurried travel.",
  },
];

export default async function HomePage() {
  const [destinations, popularPackages, popularDestinations] = await Promise.all([
    listDestinationOptions(),
    listPublishedPackages({ take: 3 }),
    listPopularDestinations(3),
  ]);

  const spotlightSlug = popularPackages[0]?.slug;
  const spotlightPackage = spotlightSlug ? await getPackageBySlug(spotlightSlug) : null;

  // No live Directions API call here: the homepage teaser doesn't need the
  // exact road route (that's what the package detail page is for), and
  // calling the external Mapbox API on every homepage load would add
  // unnecessary latency for all visitors. Falls back to the straight-line
  // route, which still demonstrates the click-to-focus interaction.
  let spotlightDays: JourneyDay[] = [];
  if (spotlightPackage) {
    spotlightDays = spotlightPackage.days.map((day) => ({
      id: day.id,
      dayNumber: day.dayNumber,
      title: day.title,
      description: day.description,
      hotelName: day.hotel?.name ?? null,
      places: day.places.map((dayPlace) => ({
        id: dayPlace.place.id,
        name: dayPlace.place.name,
        latitude: dayPlace.place.latitude,
        longitude: dayPlace.place.longitude,
        activities: dayPlace.activities,
      })),
    }));
  }

  return (
    <main className="flex-grow">
      {/* HERO */}
      <section className="relative overflow-hidden pt-6 pb-20 md:pt-12 md:pb-28">
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-ocean-turquoise/15 via-sunset-coral/15 to-sand-gold/20 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sand-gold/30 bg-sand-tint px-3.5 py-1.5 text-xs font-bold tracking-wide text-secondary">
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span>EXPERIENCE SRI LANKA&apos;S TROPICAL MAJESTY</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary md:text-5xl">
              Discover Sri Lanka. From Ancient Citadel to Golden Coastlines.
            </h1>
            <p className="mx-auto max-w-2xl text-base text-text-secondary md:text-lg">
              Experience curated island journeys with interactive day-by-day itineraries and a live route map.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-sm text-text-secondary">
              <div className="flex items-center gap-1.5 rounded-full border border-border-warm bg-surface-crisp px-3 py-1.5 shadow-sm">
                <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-palm-emerald">check_circle</span>
                <span className="font-semibold text-text-primary">100% Tailor-made Enquiries</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-border-warm bg-surface-crisp px-3 py-1.5 shadow-sm">
                <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary">map</span>
                <span className="font-semibold text-text-primary">Interactive Route Map</span>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-border-warm bg-surface-crisp p-3 shadow-xl md:rounded-full">
            <form action="/tours" className="grid grid-cols-1 items-center gap-2 sm:grid-cols-2 md:grid-cols-4">
              <div className="rounded-xl px-4 py-2 transition-colors hover:bg-surface-warm md:rounded-full">
                <label className="block text-[11px] font-bold tracking-wider text-text-muted">WHERE TO</label>
                <div className="mt-0.5 flex items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-secondary">location_on</span>
                  <select
                    name="destination"
                    className="w-full cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-text-primary focus:ring-0"
                  >
                    <option value="">All Destinations</option>
                    {destinations.map((destination) => (
                      <option key={destination.id} value={destination.id}>
                        {destination.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="rounded-xl border-t border-border-warm px-4 py-2 transition-colors hover:bg-surface-warm sm:border-t-0 sm:border-l md:rounded-full">
                <label className="block text-[11px] font-bold tracking-wider text-text-muted">TRAVEL STYLE</label>
                <div className="mt-0.5 flex items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">category</span>
                  <select
                    name="travelType"
                    className="w-full cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-text-primary focus:ring-0"
                  >
                    <option value="">All Styles</option>
                    {Object.entries(travelTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="rounded-xl border-t border-border-warm px-4 py-2 transition-colors hover:bg-surface-warm md:rounded-full md:border-t-0 md:border-l">
                <label className="block text-[11px] font-bold tracking-wider text-text-muted">DURATION</label>
                <div className="mt-0.5 flex items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-palm-emerald">schedule</span>
                  <select
                    name="duration"
                    className="w-full cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-text-primary focus:ring-0"
                  >
                    <option value="">Any Length</option>
                    {durationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-1">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary-container px-6 py-3.5 font-bold text-on-secondary shadow-md transition-all duration-200 hover:bg-secondary hover:shadow-lg active:scale-95 md:rounded-full"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]">search</span>
                  <span>Search Journeys</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* TRAVEL CATEGORIES */}
      <section className="border-y border-border-warm bg-surface-crisp py-16" id="categories">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 flex flex-col justify-between md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold tracking-widest text-secondary uppercase">Discover by interest</span>
              <h2 className="mt-1 text-3xl font-bold text-text-primary">Travel Categories</h2>
            </div>
            <p className="mt-2 max-w-md text-text-secondary md:mt-0">
              Choose from seven hand-crafted travel styles designed to unlock authentic island emotions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
            {Object.entries(travelTypeLabels).map(([value, label]) => {
              const meta = categoryMeta[value as TravelType];
              return (
                <Link
                  key={value}
                  href={`/tours?travelType=${value}`}
                  className="group flex cursor-pointer flex-col items-center rounded-2xl border border-border-warm bg-surface-container-low p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-surface-container"
                >
                  <div
                    className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full ${meta.iconBg} ${meta.iconText} transition-transform group-hover:scale-110`}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[28px]">{meta.icon}</span>
                  </div>
                  <h3 className="text-[16px] font-bold text-text-primary">{label}</h3>
                  <p className="mt-1 text-xs text-text-muted">{meta.subtitle}</p>
                  <span className={`mt-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.tagBg} ${meta.tagText}`}>
                    {meta.tag}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* POPULAR TOUR PACKAGES */}
      {popularPackages.length > 0 ? (
        <section className="bg-surface py-20" id="popular-tours">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-sand-gold/40 bg-sand-tint px-3 py-1 text-xs font-semibold text-secondary">
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px]">travel_explore</span>
                  <span>PUBLISHED ROUTES</span>
                </div>
                <h2 className="text-3xl font-bold text-text-primary">Popular Tour Packages</h2>
              </div>
              <Link
                href="/tours"
                className="mt-4 inline-flex items-center gap-1.5 font-bold text-primary transition-colors hover:text-primary-container md:mt-0"
              >
                <span>Explore all curated packages</span>
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {popularPackages.map((tourPackage) => (
                <div key={tourPackage.id} className="flex flex-col overflow-hidden rounded-2xl border border-border-warm bg-surface-crisp shadow-md transition-all duration-300 hover:shadow-xl">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {tourPackage.coverImageUrl ? (
                      <Image
                        src={tourPackage.coverImageUrl}
                        alt={tourPackage.name}
                        width={400}
                        height={250}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-fixed via-sand-tint to-tertiary-fixed">
                        <span className="text-sm font-semibold text-text-secondary">{tourPackage.name}</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-tertiary/90 px-3 py-1 text-xs font-semibold text-on-tertiary shadow-sm backdrop-blur-sm">
                      <span aria-hidden="true" className="material-symbols-outlined text-[14px]">calendar_today</span>
                      <span>{tourPackage.durationDays} Days</span>
                    </div>
                    {tourPackage.travelType ? (
                      <div className="absolute top-3 right-3 rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary shadow-sm">
                        {travelTypeLabels[tourPackage.travelType]}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-grow flex-col p-6">
                    {tourPackage.destination ? (
                      <div className="mb-2 flex items-center gap-1.5 text-sm text-text-secondary">
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary">route</span>
                        <span>{tourPackage.destination.name}</span>
                      </div>
                    ) : null}
                    <h3 className="text-xl font-semibold text-text-primary">{tourPackage.name}</h3>
                    {tourPackage.highlights.length > 0 ? (
                      <ul className="mt-3 flex-grow space-y-1.5 text-sm text-text-secondary">
                        {tourPackage.highlights.slice(0, 3).map((highlight, index) => (
                          <li key={`${index}-${highlight}`} className="flex items-start gap-2">
                            <span aria-hidden="true" className="material-symbols-outlined mt-0.5 text-[16px] text-palm-emerald">check_circle</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex-grow" />
                    )}
                    <div className="mt-6 flex items-center justify-between border-t border-border-warm pt-4">
                      <div>
                        <span className="block text-[11px] font-bold text-text-muted">PRICE</span>
                        {tourPackage.startingPrice ? (
                          <span className="text-xl font-bold text-secondary">
                            From {formatCurrency(Number(tourPackage.startingPrice))}
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-text-secondary">Enquire for price</span>
                        )}
                      </div>
                      <Link
                        href={`/tours/${tourPackage.slug}`}
                        className="flex items-center gap-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container"
                      >
                        <span>View Itinerary</span>
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">open_in_new</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* INTERACTIVE JOURNEY ITINERARY & MAP SPOTLIGHT */}
      {spotlightPackage && spotlightDays.length > 0 ? (
        <section className="border-y border-border-warm bg-surface-crisp py-20" id="itinerary-map">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <span className="text-xs font-bold tracking-widest text-secondary uppercase">Viatora&apos;s Signature Experience</span>
              <h2 className="mt-1 text-3xl font-bold text-text-primary">Interactive Journey Itinerary &amp; Map Spotlight</h2>
              <p className="mt-3 text-text-secondary">
                Understand the complete journey before enquiring. Click any day to sync and highlight its location on the
                map — featuring <span className="font-semibold text-text-primary">{spotlightPackage.name}</span>.
              </p>
            </div>
            <JourneyExplorer days={spotlightDays} route={null} />
            <div className="mt-8 text-center">
              <Link
                href={`/tours/${spotlightPackage.slug}`}
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:text-primary-container"
              >
                <span>View full itinerary for {spotlightPackage.name}</span>
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* POPULAR DESTINATIONS */}
      {popularDestinations.length > 0 ? (
        <section className="bg-surface py-20" id="destinations">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
              <div>
                <span className="text-xs font-bold tracking-widest text-secondary uppercase">Where to go</span>
                <h2 className="mt-1 text-3xl font-bold text-text-primary">Popular Destinations</h2>
              </div>
              <Link
                href="/destinations"
                className="mt-4 inline-flex items-center gap-1.5 font-bold text-primary transition-colors hover:text-primary-container md:mt-0"
              >
                <span>View all destinations</span>
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {popularDestinations.map((destination) => {
                const imageUrl = destination.images[0]?.url;
                return (
                  <Link
                    key={destination.id}
                    href={`/destinations/${destination.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-border-warm bg-surface-crisp shadow-md transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={destination.name}
                          width={400}
                          height={250}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-tertiary-fixed via-sand-tint to-primary-fixed">
                          <span className="text-sm font-semibold text-text-secondary">{destination.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                        <span>{destination.location}</span>
                      </div>
                      <h3 className="mt-1 text-xl font-semibold text-text-primary">{destination.name}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* WHY SRI LANKA */}
      <section className="border-y border-border-warm bg-surface-crisp py-20" id="why-sri-lanka">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold tracking-widest text-secondary uppercase">The Island</span>
            <h2 className="mt-1 text-3xl font-bold text-text-primary">Why Sri Lanka</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whySriLanka.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border-warm bg-surface-container-low p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-fixed text-primary">
                  <span aria-hidden="true" className="material-symbols-outlined text-[28px]">{item.icon}</span>
                </div>
                <p className="font-bold text-text-primary">{item.title}</p>
                <p className="mt-2 text-sm text-text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary-container to-sunset-coral py-16 text-center text-white" id="enquiry">
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-sand-gold/10 blur-2xl" />
        <div className="relative z-10 mx-auto max-w-2xl px-4 md:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-sm">
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">outgoing_mail</span>
            <span>NO OBLIGATION &middot; FREE BESPOKE PROPOSAL</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ready to Map Your Sri Lankan Odyssey?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Tell us your dream destinations, dates, and travel pace. We&apos;ll put together a tailored day-by-day
            itinerary proposal for you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 rounded-full bg-surface-crisp px-8 py-3.5 font-bold text-secondary shadow-xl transition-all duration-200 hover:bg-surface-warm hover:shadow-2xl active:scale-95"
            >
              <span>Get a Tailored Itinerary Quote</span>
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">explore</span>
              <span>Browse Packages</span>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/90">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
              Free, no-obligation enquiry
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
              Tailored day-by-day itinerary
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
              No online payment required
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
