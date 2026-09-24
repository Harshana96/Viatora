import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Editorial photography uploaded to Cloudinary for the seed destinations/places/packages.
// Served through f_auto,q_auto,w_1200 so Next's image optimizer doesn't choke on multi-MB sources.
const CLOUDINARY_BASE = "https://res.cloudinary.com/xtp3v13m/image/upload/f_auto,q_auto,w_1200";
const seedPhotos = {
  sigiriyaRock: { url: `${CLOUDINARY_BASE}/v1790185175/viatora/y1iphqaonuvr7wdnbhf6.png`, publicId: "viatora/y1iphqaonuvr7wdnbhf6" },
  ellaTrain: { url: `${CLOUDINARY_BASE}/v1790185178/viatora/pqmwakdwvhl6g2ot5yk8.png`, publicId: "viatora/pqmwakdwvhl6g2ot5yk8" },
  nuwaraEliyaCabin: { url: `${CLOUDINARY_BASE}/v1790185181/viatora/ter0xqdv0mds5ql5p2lf.png`, publicId: "viatora/ter0xqdv0mds5ql5p2lf" },
  mirissaBeach: { url: `${CLOUDINARY_BASE}/v1790185183/viatora/pcpepbfir6fxo2iurevg.png`, publicId: "viatora/pcpepbfir6fxo2iurevg" },
  dambullaCaveTemple: { url: `${CLOUDINARY_BASE}/v1790185186/viatora/ya58jtyz2inzvunumwfb.png`, publicId: "viatora/ya58jtyz2inzvunumwfb" },
  infinityPool: { url: `${CLOUDINARY_BASE}/v1790185189/viatora/cmpjvsfhbeio6btx3lyo.png`, publicId: "viatora/cmpjvsfhbeio6btx3lyo" },
} as const;

async function seedDestination(data: {
  name: string;
  slug: string;
  description: string;
  location: string;
  thingsToDo: string[];
  latitude: number;
  longitude: number;
}) {
  return prisma.destination.upsert({
    where: { slug: data.slug },
    update: data,
    create: data,
  });
}

async function seedPlace(data: {
  name: string;
  slug: string;
  description: string;
  category: "TEMPLE" | "WATERFALL" | "BEACH" | "WILDLIFE" | "MOUNTAIN" | "HISTORICAL_SITE" | "TEA_PLANTATION" | "ADVENTURE";
  latitude: number;
  longitude: number;
  destinationId: string;
}) {
  return prisma.place.upsert({
    where: { slug: data.slug },
    update: data,
    create: data,
  });
}

async function seedHotel(data: { name: string; location: string; rating: number }) {
  const existing = await prisma.hotel.findFirst({ where: { name: data.name } });
  if (existing) {
    return prisma.hotel.update({ where: { id: existing.id }, data });
  }
  return prisma.hotel.create({ data });
}

type SeedPhoto = { url: string; publicId: string };

async function seedDestinationImage(destinationId: string, photo: SeedPhoto, alt: string) {
  const existing = await prisma.image.findFirst({ where: { destinationId } });
  const data = { url: photo.url, publicId: photo.publicId, alt, destinationId };
  if (existing) {
    return prisma.image.update({ where: { id: existing.id }, data });
  }
  return prisma.image.create({ data });
}

async function seedPlaceImage(placeId: string, photo: SeedPhoto, alt: string) {
  const existing = await prisma.image.findFirst({ where: { placeId } });
  const data = { url: photo.url, publicId: photo.publicId, alt, placeId };
  if (existing) {
    return prisma.image.update({ where: { id: existing.id }, data });
  }
  return prisma.image.create({ data });
}

async function seedGroupSizeRange(data: { label: string; minSize: number; maxSize: number | null; order: number }) {
  const existing = await prisma.groupSizeRange.findFirst({ where: { label: data.label } });
  if (existing) {
    return prisma.groupSizeRange.update({ where: { id: existing.id }, data });
  }
  return prisma.groupSizeRange.create({ data });
}

async function seedSeason(data: { name: string; months: number[]; order: number }) {
  const existing = await prisma.season.findFirst({ where: { name: data.name } });
  if (existing) {
    return prisma.season.update({ where: { id: existing.id }, data });
  }
  return prisma.season.create({ data });
}

type PackageDay = {
  dayNumber: number;
  title: string;
  description: string;
  hotelId?: string;
  alternativeHotelIds?: string[];
  optionalActivities?: string[];
  places: { placeId: string; activities: string[] }[];
};

async function seedPackage(
  data: {
    name: string;
    slug: string;
    coverImageUrl?: string;
    coverImagePublicId?: string;
    durationDays: number;
    startingPrice: number;
    travelType: "ADVENTURE" | "CULTURAL" | "BEACH" | "WILDLIFE" | "HONEYMOON" | "FAMILY" | "WELLNESS";
    description: string;
    highlights: string[];
    included: string[];
    excluded: string[];
    importantInfo?: string[];
    destinationId?: string;
    published: boolean;
  },
  days: PackageDay[],
) {
  const packageData = { ...data, importantInfo: data.importantInfo ?? [], destinationId: data.destinationId ?? null };
  const tourPackage = await prisma.tourPackage.upsert({
    where: { slug: data.slug },
    update: packageData,
    create: packageData,
  });

  // Drop any days a previous seed run created that this run no longer defines
  // (cascades to their TourDayPlace rows).
  await prisma.tourDay.deleteMany({
    where: { packageId: tourPackage.id, dayNumber: { notIn: days.map((day) => day.dayNumber) } },
  });

  for (const day of days) {
    const dayData = {
      title: day.title,
      description: day.description,
      hotelId: day.hotelId ?? null,
      alternativeHotelIds: day.alternativeHotelIds ?? [],
      optionalActivities: day.optionalActivities ?? [],
    };
    const tourDay = await prisma.tourDay.upsert({
      where: { packageId_dayNumber: { packageId: tourPackage.id, dayNumber: day.dayNumber } },
      update: dayData,
      create: { packageId: tourPackage.id, dayNumber: day.dayNumber, ...dayData },
    });

    // Full replace rather than upsert-by-place: a day's place list can shrink or
    // reorder between seed runs, and stale rows would otherwise linger forever.
    await prisma.tourDayPlace.deleteMany({
      where: { tourDayId: tourDay.id, placeId: { notIn: day.places.map((place) => place.placeId) } },
    });
    for (const [order, place] of day.places.entries()) {
      await prisma.tourDayPlace.upsert({
        where: { tourDayId_placeId: { tourDayId: tourDay.id, placeId: place.placeId } },
        update: { activities: place.activities, order },
        create: { tourDayId: tourDay.id, placeId: place.placeId, activities: place.activities, order },
      });
    }
  }

  return tourPackage;
}

async function seedPricingRule(data: {
  packageId: string;
  groupSizeRangeId: string;
  seasonId: string;
  pricePerPerson: number;
}) {
  await prisma.pricingRule.upsert({
    where: {
      packageId_groupSizeRangeId_seasonId: {
        packageId: data.packageId,
        groupSizeRangeId: data.groupSizeRangeId,
        seasonId: data.seasonId,
      },
    },
    update: { pricePerPerson: data.pricePerPerson },
    create: data,
  });
}

async function main() {
  // The 9-day plan below now lives on "Sri Lanka Grand Journey" instead of this
  // earlier duplicate package — remove the stale row from previous seed runs.
  await prisma.tourPackage.deleteMany({ where: { slug: "cultural-triangle-coastal-discovery" } });

  const kandy = await seedDestination({
    name: "Kandy",
    slug: "kandy",
    description:
      "The last royal capital of Sri Lanka, set around a scenic lake in the central hill country. Home to the Temple of the Sacred Tooth Relic and surrounded by tea estates.",
    location: "Central Province",
    thingsToDo: ["Temple of the Tooth", "Kandy Lake walk", "Traditional cultural dance show", "Royal Botanical Gardens"],
    latitude: 7.2906,
    longitude: 80.6337,
  });

  const galle = await seedDestination({
    name: "Galle",
    slug: "galle",
    description:
      "A fortified coastal city built by the Portuguese and later the Dutch, with cobbled streets, colonial architecture and beaches close by.",
    location: "Southern Province",
    thingsToDo: ["Walk the Galle Fort ramparts", "Sunset at the lighthouse", "Beach time in Unawatuna"],
    latitude: 6.0535,
    longitude: 80.221,
  });

  const yala = await seedDestination({
    name: "Yala",
    slug: "yala",
    description:
      "Sri Lanka's most visited national park, known for having one of the highest leopard densities in the world alongside elephants, sloth bears and abundant birdlife.",
    location: "Southern Province",
    thingsToDo: ["Morning safari jeep tour", "Leopard and elephant spotting", "Bird watching at Yala's lagoons"],
    latitude: 6.3728,
    longitude: 81.5165,
  });

  const sigiriya = await seedDestination({
    name: "Sigiriya",
    slug: "sigiriya",
    description:
      "Home to the ancient rock fortress of Sigiriya, a UNESCO World Heritage Site rising nearly 200 metres above the surrounding plains, at the heart of Sri Lanka's Cultural Triangle.",
    location: "Central Province",
    thingsToDo: ["Climb Sigiriya Rock", "Dambulla Cave Temple", "Village and lake tour by bullock cart"],
    latitude: 7.957,
    longitude: 80.7603,
  });

  const templeOfTooth = await seedPlace({
    name: "Temple of the Tooth",
    slug: "temple-of-the-tooth",
    description: "Sacred Buddhist temple in Kandy housing a relic of the tooth of the Buddha.",
    category: "TEMPLE",
    latitude: 7.2936,
    longitude: 80.6413,
    destinationId: kandy.id,
  });

  const kandyLake = await seedPlace({
    name: "Kandy Lake",
    slug: "kandy-lake",
    description: "An artificial lake in the centre of Kandy, built in 1807, with a scenic walking path around it.",
    category: "HISTORICAL_SITE",
    latitude: 7.2915,
    longitude: 80.6402,
    destinationId: kandy.id,
  });

  const hanthanaTea = await seedPlace({
    name: "Hanthana Tea Estate",
    slug: "hanthana-tea-estate",
    description: "A working tea plantation on the slopes of the Hanthana mountain range near Kandy.",
    category: "TEA_PLANTATION",
    latitude: 7.2599,
    longitude: 80.6234,
    destinationId: kandy.id,
  });

  const galleFort = await seedPlace({
    name: "Galle Fort",
    slug: "galle-fort",
    description: "A UNESCO-listed fortified old town built by the Portuguese and Dutch, with ramparts overlooking the ocean.",
    category: "HISTORICAL_SITE",
    latitude: 6.03,
    longitude: 80.2167,
    destinationId: galle.id,
  });

  const unawatunaBeach = await seedPlace({
    name: "Unawatuna Beach",
    slug: "unawatuna-beach",
    description: "A sheltered, palm-lined bay a short drive from Galle Fort, popular for swimming and sunsets.",
    category: "BEACH",
    latitude: 6.0108,
    longitude: 80.2489,
    destinationId: galle.id,
  });

  const yalaPark = await seedPlace({
    name: "Yala National Park",
    slug: "yala-national-park",
    description: "Sri Lanka's second-largest national park, famous for its leopard population and diverse wildlife.",
    category: "WILDLIFE",
    latitude: 6.3728,
    longitude: 81.5165,
    destinationId: yala.id,
  });

  const sigiriyaRock = await seedPlace({
    name: "Sigiriya Rock Fortress",
    slug: "sigiriya-rock-fortress",
    description: "An ancient rock fortress and palace ruin with frescoes and landscaped gardens, rising 200m above the plain.",
    category: "HISTORICAL_SITE",
    latitude: 7.957,
    longitude: 80.7603,
    destinationId: sigiriya.id,
  });

  const dambullaCaveTemple = await seedPlace({
    name: "Dambulla Cave Temple",
    slug: "dambulla-cave-temple",
    description: "A cave temple complex with over 150 Buddha statues and painted ceilings, dating back over two millennia.",
    category: "TEMPLE",
    latitude: 7.8567,
    longitude: 80.6517,
    destinationId: sigiriya.id,
  });

  await seedPlaceImage(dambullaCaveTemple.id, seedPhotos.dambullaCaveTemple, "Inside the historic Dambulla cave temple");

  const cinnamonCitadel = await seedHotel({ name: "Cinnamon Citadel Kandy", location: "Kandy", rating: 4.3 });
  const jetwingLighthouse = await seedHotel({ name: "Jetwing Lighthouse", location: "Galle", rating: 4.6 });
  const yalaSafariCamp = await seedHotel({ name: "Yala Safari Camp", location: "Yala", rating: 4.1 });
  const sigiriyaVillage = await seedHotel({ name: "Sigiriya Village Hotel", location: "Sigiriya", rating: 4.2 });

  await seedPackage(
    {
      name: "Cultural Triangle & Hill Country Explorer",
      slug: "cultural-triangle-hill-country-explorer",
      durationDays: 5,
      startingPrice: 750,
      travelType: "CULTURAL",
      description:
        "A five-day journey through Sri Lanka's ancient Cultural Triangle and the hill country capital of Kandy, taking in rock fortresses, cave temples, sacred sites and tea country.",
      highlights: ["Climb the Sigiriya rock fortress", "Explore the Dambulla cave temple", "Visit the Temple of the Tooth", "Tea tasting on a working estate"],
      included: ["Private driver and vehicle", "Breakfast daily", "Entrance fees to listed sites"],
      excluded: ["International flights", "Lunch and dinner", "Personal expenses"],
      destinationId: sigiriya.id,
      published: true,
    },
    [
      {
        dayNumber: 1,
        title: "Arrival and Sigiriya Rock",
        description: "Arrive and head straight to Sigiriya to climb the ancient rock fortress before sunset.",
        hotelId: sigiriyaVillage.id,
        places: [{ placeId: sigiriyaRock.id, activities: ["Climb Sigiriya Rock", "Sunset from the summit"] }],
      },
      {
        dayNumber: 2,
        title: "Dambulla Cave Temple",
        description: "Morning visit to the Dambulla cave temple complex, followed by a village and lake tour.",
        hotelId: sigiriyaVillage.id,
        places: [{ placeId: dambullaCaveTemple.id, activities: ["Guided tour of the cave temples"] }],
      },
      {
        dayNumber: 3,
        title: "Travel to Kandy",
        description: "Drive to Kandy, visiting a spice garden en route, and attend an evening cultural dance show.",
        hotelId: cinnamonCitadel.id,
        places: [{ placeId: templeOfTooth.id, activities: ["Evening cultural dance show"] }],
      },
      {
        dayNumber: 4,
        title: "Temple of the Tooth and tea country",
        description: "Visit the Temple of the Sacred Tooth Relic in the morning, then a tea estate tour in the afternoon.",
        hotelId: cinnamonCitadel.id,
        places: [
          { placeId: templeOfTooth.id, activities: ["Temple of the Tooth Relic ceremony"] },
          { placeId: hanthanaTea.id, activities: ["Tea factory tour", "Tea tasting"] },
        ],
      },
      {
        dayNumber: 5,
        title: "Kandy Lake and departure",
        description: "A relaxed morning walk around Kandy Lake before departure.",
        places: [{ placeId: kandyLake.id, activities: ["Lakeside walk"] }],
      },
    ],
  );

  await seedPackage(
    {
      name: "Southern Coast & Wildlife Safari",
      slug: "southern-coast-wildlife-safari",
      durationDays: 4,
      startingPrice: 620,
      travelType: "WILDLIFE",
      description:
        "Combine the colonial charm of Galle Fort with beach time and two safari drives in Yala National Park, one of the best places in the world to spot leopards.",
      highlights: ["Walk the Galle Fort ramparts", "Relax on Unawatuna Beach", "Two safari drives in Yala National Park"],
      included: ["Private driver and vehicle", "Breakfast daily", "Safari jeep and park entrance fees"],
      excluded: ["International flights", "Lunch and dinner", "Personal expenses"],
      destinationId: galle.id,
      published: true,
    },
    [
      {
        dayNumber: 1,
        title: "Galle Fort",
        description: "Explore the fort's ramparts, colonial streets and lighthouse.",
        hotelId: jetwingLighthouse.id,
        places: [{ placeId: galleFort.id, activities: ["Walking tour of the fort", "Sunset at the lighthouse"] }],
      },
      {
        dayNumber: 2,
        title: "Unawatuna Beach",
        description: "A free day to relax on the beach before heading toward Yala.",
        hotelId: jetwingLighthouse.id,
        places: [{ placeId: unawatunaBeach.id, activities: ["Swimming", "Beachside lunch"] }],
      },
      {
        dayNumber: 3,
        title: "Yala morning safari",
        description: "Early morning safari drive in Yala National Park, the best time to spot leopards.",
        hotelId: yalaSafariCamp.id,
        places: [{ placeId: yalaPark.id, activities: ["Morning safari jeep drive"] }],
      },
      {
        dayNumber: 4,
        title: "Yala evening safari and departure",
        description: "A second safari drive in the late afternoon before departure.",
        places: [{ placeId: yalaPark.id, activities: ["Evening safari jeep drive"] }],
      },
    ],
  );

  await seedPackage(
    {
      name: "Sri Lanka Honeymoon Escape",
      slug: "sri-lanka-honeymoon-escape",
      durationDays: 6,
      startingPrice: 1450,
      travelType: "HONEYMOON",
      description:
        "A six-day escape pairing the hill country's tea gardens and cultural sites with quiet beach time on the south coast — built for couples wanting both scenery and relaxation.",
      highlights: ["Private tea tasting in Kandy", "Temple of the Tooth at sunset", "Beachfront stay in Galle", "Sunset walk on the Galle ramparts"],
      included: ["Private driver and vehicle", "Breakfast daily", "One candlelit dinner in Galle"],
      excluded: ["International flights", "Most lunches and dinners", "Personal expenses"],
      destinationId: galle.id,
      published: true,
    },
    [
      {
        dayNumber: 1,
        title: "Arrival in Kandy",
        description: "Arrive and settle in, with an evening lakeside walk.",
        hotelId: cinnamonCitadel.id,
        places: [{ placeId: kandyLake.id, activities: ["Evening lakeside walk"] }],
      },
      {
        dayNumber: 2,
        title: "Temple of the Tooth and tea country",
        description: "Visit the Temple of the Tooth followed by a private tea tasting.",
        hotelId: cinnamonCitadel.id,
        places: [
          { placeId: templeOfTooth.id, activities: ["Temple visit at sunset"] },
          { placeId: hanthanaTea.id, activities: ["Private tea tasting"] },
        ],
      },
      {
        dayNumber: 3,
        title: "Travel to Galle",
        description: "Scenic drive south to the coast, arriving in time to explore Galle Fort at sunset.",
        hotelId: jetwingLighthouse.id,
        places: [{ placeId: galleFort.id, activities: ["Sunset walk on the ramparts"] }],
      },
      {
        dayNumber: 4,
        title: "Beach day",
        description: "A free day on Unawatuna Beach, with a candlelit dinner in the evening.",
        hotelId: jetwingLighthouse.id,
        places: [{ placeId: unawatunaBeach.id, activities: ["Beach day", "Candlelit dinner"] }],
      },
      {
        dayNumber: 5,
        title: "Free day in Galle",
        description: "A relaxed day to explore Galle Fort's boutiques and cafes at your own pace.",
        hotelId: jetwingLighthouse.id,
        places: [{ placeId: galleFort.id, activities: ["Free time to explore independently"] }],
      },
      {
        dayNumber: 6,
        title: "Departure",
        description: "Morning at leisure before transfer for departure.",
        places: [],
      },
    ],
  );

  // --- MVP flow demo data: group sizes, seasons, additional destinations
  // and the three curated packages from knowledge/product/mvp-scope
  // (8N/9D, 7N/8D, 6N/7D), each fully priced. ---

  const nuwaraEliya = await seedDestination({
    name: "Nuwara Eliya",
    slug: "nuwara-eliya",
    description:
      "Known as 'Little England', a cool-climate hill station surrounded by tea estates, colonial-era buildings and Horton Plains National Park.",
    location: "Central Province",
    thingsToDo: ["Pedro Tea Estate tour", "Horton Plains and World's End hike", "Gregory Lake boat ride", "Victoria Park"],
    latitude: 6.9497,
    longitude: 80.7891,
  });

  const ella = await seedDestination({
    name: "Ella",
    slug: "ella",
    description:
      "A small hill country town amid tea plantations and dramatic mountain scenery, known for hiking trails and the iconic Nine Arches Bridge.",
    location: "Uva Province",
    thingsToDo: ["Nine Arches Bridge", "Little Adam's Peak hike", "Ella Rock hike", "Scenic train ride"],
    latitude: 6.8667,
    longitude: 81.0466,
  });

  const mirissa = await seedDestination({
    name: "Mirissa",
    slug: "mirissa",
    description:
      "A laid-back south coast beach town, one of the best places in Sri Lanka for whale watching alongside palm-lined beaches.",
    location: "Southern Province",
    thingsToDo: ["Whale and dolphin watching boat trip", "Relax on Mirissa Beach", "Sunset at Parrot Rock", "Surfing"],
    latitude: 5.9483,
    longitude: 80.4589,
  });

  await seedDestinationImage(sigiriya.id, seedPhotos.sigiriyaRock, "Sigiriya Rock Fortress at sunrise");
  await seedDestinationImage(ella.id, seedPhotos.ellaTrain, "The blue train crossing Nine Arches Bridge near Ella");
  await seedDestinationImage(nuwaraEliya.id, seedPhotos.nuwaraEliyaCabin, "A wooden cabin in the misty hills above Nuwara Eliya");
  await seedDestinationImage(mirissa.id, seedPhotos.mirissaBeach, "A secluded palm-lined beach in Mirissa");

  const hortonPlains = await seedPlace({
    name: "Horton Plains National Park",
    slug: "horton-plains-national-park",
    description: "A highland plateau national park known for the World's End escarpment and cool cloud-forest hiking.",
    category: "MOUNTAIN",
    latitude: 6.8021,
    longitude: 80.7996,
    destinationId: nuwaraEliya.id,
  });

  const pedroTeaEstate = await seedPlace({
    name: "Pedro Tea Estate",
    slug: "pedro-tea-estate",
    description: "A working high-grown tea estate and factory just outside Nuwara Eliya, open for tours and tastings.",
    category: "TEA_PLANTATION",
    latitude: 6.9667,
    longitude: 80.7333,
    destinationId: nuwaraEliya.id,
  });

  const nineArchesBridge = await seedPlace({
    name: "Nine Arches Bridge",
    slug: "nine-arches-bridge",
    description: "A century-old colonial-era railway viaduct set among tea plantations, one of Sri Lanka's most photographed landmarks.",
    category: "ADVENTURE",
    latitude: 6.8794,
    longitude: 81.0603,
    destinationId: ella.id,
  });

  const littleAdamsPeak = await seedPlace({
    name: "Little Adam's Peak",
    slug: "little-adams-peak",
    description: "An easy, scenic hike through tea fields to a viewpoint over the Ella Gap.",
    category: "MOUNTAIN",
    latitude: 6.8747,
    longitude: 81.0553,
    destinationId: ella.id,
  });

  await seedPlace({
    name: "Mirissa Beach",
    slug: "mirissa-beach",
    description: "A crescent-shaped, palm-fringed beach popular for swimming, surfing and sunset views.",
    category: "BEACH",
    latitude: 5.9483,
    longitude: 80.4589,
    destinationId: mirissa.id,
  });

  await seedPlace({
    name: "Mirissa Whale Watching Point",
    slug: "mirissa-whale-watching-point",
    description: "Departure point for boat trips to see blue whales and spinner dolphins in the deep water offshore.",
    category: "WILDLIFE",
    latitude: 5.933,
    longitude: 80.45,
    destinationId: mirissa.id,
  });

  const mahaweliReach = await seedHotel({ name: "Mahaweli Reach Hotel", location: "Kandy", rating: 4.0 });
  const heritanceTeaFactory = await seedHotel({ name: "Heritance Tea Factory", location: "Nuwara Eliya", rating: 4.5 });
  const grandHotelNuwaraEliya = await seedHotel({ name: "Grand Hotel Nuwara Eliya", location: "Nuwara Eliya", rating: 4.0 });
  const jetwingStAndrews = await seedHotel({ name: "Jetwing St. Andrew's", location: "Nuwara Eliya", rating: 4.2 });
  const ella98Acres = await seedHotel({ name: "98 Acres Resort", location: "Ella", rating: 4.6 });
  const ellaFlowerGarden = await seedHotel({ name: "Ella Flower Garden Resort", location: "Ella", rating: 4.1 });
  await seedHotel({ name: "Cape Weligama", location: "Mirissa", rating: 4.7 });
  await seedHotel({ name: "Mirissa Hills", location: "Mirissa", rating: 4.3 });

  const twoTravelers = await seedGroupSizeRange({ label: "2 Travelers", minSize: 2, maxSize: 2, order: 0 });
  const twoToFive = await seedGroupSizeRange({ label: "2-5 Travelers", minSize: 2, maxSize: 5, order: 1 });
  const fiveToTen = await seedGroupSizeRange({ label: "5-10 Travelers", minSize: 5, maxSize: 10, order: 2 });
  const tenToTwenty = await seedGroupSizeRange({ label: "10-20 Travelers", minSize: 10, maxSize: 20, order: 3 });

  const peakSeason = await seedSeason({ name: "Peak Season", months: [12, 1, 2], order: 0 });
  const shoulderSeason = await seedSeason({ name: "Shoulder Season", months: [3, 4, 9, 10, 11], order: 1 });
  const lowSeason = await seedSeason({ name: "Low Season", months: [5, 6, 7, 8], order: 2 });

  const commonIncluded = [
    "Private air-conditioned vehicle and driver",
    "Breakfast daily",
    "Airport transfers",
    "Entrance fees to listed sites",
  ];
  const commonExcluded = [
    "International flights",
    "Lunch and dinner (except where noted)",
    "Personal expenses",
    "Travel insurance",
    "Visa-related costs",
    "Optional / additional experiences",
  ];
  const commonImportantInfo = [
    "Hotel selection reflects preference only — final availability is confirmed by our team after your enquiry.",
    "Itinerary order may be adjusted slightly for weather, road conditions or site opening hours.",
    "Prices shown are per person, based on double/twin room occupancy, and are estimates pending final quotation.",
  ];

  const habarana = await seedDestination({
    name: "Habarana",
    slug: "habarana",
    description:
      "A quiet village at the heart of the Cultural Triangle, used as a gateway to Sigiriya, Anuradhapura and Polonnaruwa, surrounded by forest and reservoirs.",
    location: "North Central Province",
    thingsToDo: ["Village tour by bullock cart", "Habarana Lake", "Elephant Back Safari"],
    latitude: 8.0362,
    longitude: 80.7539,
  });

  const anuradhapura = await seedDestination({
    name: "Anuradhapura",
    slug: "anuradhapura",
    description:
      "One of the ancient capitals of Sri Lanka and a UNESCO World Heritage Site, with well-preserved ruins of an ancient civilization, sacred temples and giant dagobas.",
    location: "North Central Province",
    thingsToDo: ["Sri Maha Bodhi tree", "Ruwanwelisaya dagoba", "Jetavanaramaya", "Mihintale climb"],
    latitude: 8.3114,
    longitude: 80.4037,
  });

  const polonnaruwaDestination = await seedDestination({
    name: "Polonnaruwa",
    slug: "polonnaruwa",
    description:
      "Sri Lanka's medieval capital, a UNESCO World Heritage Site with well-preserved ruins of royal palaces, temples and the Gal Vihara rock-cut Buddha statues.",
    location: "North Central Province",
    thingsToDo: ["Polonnaruwa ancient city tour", "Gal Vihara", "Cycling through the ruins"],
    latitude: 7.9403,
    longitude: 81.0188,
  });

  const pinnawalaDestination = await seedDestination({
    name: "Pinnawala",
    slug: "pinnawala",
    description:
      "Home to the Pinnawala Elephant Orphanage, established to care for orphaned and injured wild elephants, set beside the Maha Oya river.",
    location: "Sabaragamuwa Province",
    thingsToDo: ["Elephant feeding", "River bathing time", "Orphanage nursery visit"],
    latitude: 7.301,
    longitude: 80.3877,
  });

  const colombo = await seedDestination({
    name: "Colombo",
    slug: "colombo",
    description:
      "Sri Lanka's commercial capital, a coastal city blending colonial architecture, modern skyline and the departure point for most international travel.",
    location: "Western Province",
    thingsToDo: ["Galle Face Green", "Gangaramaya Temple", "Pettah markets", "Independence Square"],
    latitude: 6.9271,
    longitude: 79.8612,
  });

  const habaranaVillage = await seedPlace({
    name: "Habarana Village",
    slug: "habarana-village",
    description: "A rural village near Habarana known for traditional bullock cart tours and local life experiences.",
    category: "ADVENTURE",
    latitude: 8.0362,
    longitude: 80.7539,
    destinationId: habarana.id,
  });

  const anuradhapuraAncientCity = await seedPlace({
    name: "Anuradhapura Ancient City",
    slug: "anuradhapura-ancient-city",
    description: "The sacred ruined city of Sri Lanka's first kingdom, home to ancient dagobas, monasteries and the Sri Maha Bodhi tree.",
    category: "HISTORICAL_SITE",
    latitude: 8.3114,
    longitude: 80.4037,
    destinationId: anuradhapura.id,
  });

  const mihintale = await seedPlace({
    name: "Mihintale",
    slug: "mihintale",
    description: "A sacred mountain considered the cradle of Buddhism in Sri Lanka, with a long stairway leading to ancient stupas and shrines.",
    category: "TEMPLE",
    latitude: 8.3489,
    longitude: 80.5093,
    destinationId: anuradhapura.id,
  });

  const polonnaruwaAncientCity = await seedPlace({
    name: "Polonnaruwa Ancient City",
    slug: "polonnaruwa-ancient-city",
    description: "The ruins of Sri Lanka's medieval capital, including royal palaces, temples and the Gal Vihara rock sculptures.",
    category: "HISTORICAL_SITE",
    latitude: 7.9403,
    longitude: 81.0188,
    destinationId: polonnaruwaDestination.id,
  });

  const pinnawalaOrphanage = await seedPlace({
    name: "Pinnawala Elephant Orphanage",
    slug: "pinnawala-elephant-orphanage",
    description: "A sanctuary and nursery for orphaned and injured wild elephants, with daily feeding and river bathing sessions.",
    category: "WILDLIFE",
    latitude: 7.301,
    longitude: 80.3877,
    destinationId: pinnawalaDestination.id,
  });

  const colomboCity = await seedPlace({
    name: "Colombo City",
    slug: "colombo-city",
    description: "The commercial heart of Sri Lanka, with colonial-era landmarks, waterfront promenades and city markets.",
    category: "HISTORICAL_SITE",
    latitude: 6.9271,
    longitude: 79.8612,
    destinationId: colombo.id,
  });

  const bandaranaikeAirport = await seedPlace({
    name: "Bandaranaike International Airport",
    slug: "bandaranaike-international-airport",
    description: "Sri Lanka's main international airport, located in Katunayake north of Colombo.",
    category: "ADVENTURE",
    latitude: 7.1808,
    longitude: 79.8841,
    destinationId: colombo.id,
  });

  const grandJourney = await seedPackage(
    {
      name: "Sri Lanka Grand Journey",
      slug: "sri-lanka-grand-journey",
      coverImageUrl: seedPhotos.dambullaCaveTemple.url,
      coverImagePublicId: seedPhotos.dambullaCaveTemple.publicId,
      durationDays: 9,
      startingPrice: 820,
      travelType: "CULTURAL",
      description:
        "An eight-night journey through Sri Lanka's ancient cities and wildlife, from the ruined capitals of Anuradhapura and Polonnaruwa to Sigiriya Rock, Pinnawala's elephants, Kandy, tea country and the south coast.",
      highlights: [
        "Ancient cities of Anuradhapura and Polonnaruwa",
        "Sigiriya Rock Fortress and Dambulla Cave Temple",
        "Pinnawala Elephant Orphanage",
        "Temple of the Sacred Tooth Relic in Kandy",
        "Tea country in Nuwara Eliya",
        "Galle Fort and Colombo city",
      ],
      included: commonIncluded,
      excluded: commonExcluded,
      importantInfo: commonImportantInfo,
      published: true,
    },
    [
      {
        dayNumber: 1,
        title: "Arrival",
        description: "Arrival transfer through Habarana to Sigiriya, with a village experience en route.",
        places: [
          { placeId: habaranaVillage.id, activities: ["Airport pickup", "Habarana village experience"] },
          { placeId: sigiriyaRock.id, activities: ["Sigiriya sunset", "Hotel check-in"] },
        ],
      },
      {
        dayNumber: 2,
        title: "Anuradhapura and Mihintale",
        description: "A full day exploring the sacred ancient city of Anuradhapura and the hilltop site of Mihintale.",
        places: [
          { placeId: anuradhapuraAncientCity.id, activities: ["Anuradhapura ancient city tour", "Temple visits"] },
          { placeId: mihintale.id, activities: ["Mihintale visit", "Cultural experiences"] },
        ],
      },
      {
        dayNumber: 3,
        title: "Sigiriya Rock and Polonnaruwa",
        description: "Climb Sigiriya Rock in the morning, then explore the medieval ruins of Polonnaruwa.",
        places: [
          { placeId: sigiriyaRock.id, activities: ["Sigiriya Rock visit"] },
          { placeId: polonnaruwaAncientCity.id, activities: ["Polonnaruwa ancient city tour", "Cycling", "Photography"] },
        ],
      },
      {
        dayNumber: 4,
        title: "Dambulla and Kandy",
        description: "Visit the Dambulla Cave Temple en route to Kandy, with an evening cultural show.",
        hotelId: cinnamonCitadel.id,
        alternativeHotelIds: [mahaweliReach.id],
        places: [
          { placeId: dambullaCaveTemple.id, activities: ["Dambulla Cave Temple"] },
          { placeId: templeOfTooth.id, activities: ["Kandy city tour", "Temple of the Tooth", "Cultural show"] },
        ],
      },
      {
        dayNumber: 5,
        title: "Kandy to Pinnawala",
        description: "Leisure time in Kandy before a visit to the Pinnawala Elephant Orphanage.",
        hotelId: cinnamonCitadel.id,
        alternativeHotelIds: [mahaweliReach.id],
        places: [
          { placeId: kandyLake.id, activities: ["Kandy leisure time"] },
          { placeId: pinnawalaOrphanage.id, activities: ["Pinnawala visit", "Elephant experience", "River or forest activities"] },
        ],
      },
      {
        dayNumber: 6,
        title: "Travel to Nuwara Eliya",
        description: "Scenic train journey and tea country tour on the way to Nuwara Eliya.",
        hotelId: heritanceTeaFactory.id,
        alternativeHotelIds: [grandHotelNuwaraEliya.id, jetwingStAndrews.id],
        places: [
          { placeId: hanthanaTea.id, activities: ["Scenic train journey"] },
          { placeId: pedroTeaEstate.id, activities: ["Tea factory visit", "Tea plantation walk", "Nuwara Eliya city tour"] },
        ],
      },
      {
        dayNumber: 7,
        title: "Travel to Galle",
        description: "Scenic drive from the hill country down to the south coast, arriving at Galle Fort by evening.",
        hotelId: jetwingLighthouse.id,
        places: [
          { placeId: hortonPlains.id, activities: ["Scenic drive"] },
          { placeId: galleFort.id, activities: ["Galle Fort visit", "Beach activities", "Sunset experience"] },
        ],
      },
      {
        dayNumber: 8,
        title: "Yala, Galle and Colombo",
        description: "A wildlife safari, coastal sightseeing and an evening arrival in Colombo.",
        hotelId: yalaSafariCamp.id,
        places: [
          { placeId: yalaPark.id, activities: ["Yala safari", "Wildlife experience"] },
          { placeId: galleFort.id, activities: ["Galle Fort visit", "Coastal drive"] },
          { placeId: colomboCity.id, activities: ["Colombo evening experience"] },
        ],
      },
      {
        dayNumber: 9,
        title: "Departure",
        description: "A final morning in Colombo before transferring to the airport for departure.",
        places: [
          { placeId: colomboCity.id, activities: ["Colombo city tour", "Shopping"] },
          { placeId: bandaranaikeAirport.id, activities: ["Airport transfer", "Departure"] },
        ],
      },
    ],
  );

  const explorer = await seedPackage(
    {
      name: "Sri Lanka Explorer",
      slug: "sri-lanka-explorer",
      coverImageUrl: seedPhotos.ellaTrain.url,
      coverImagePublicId: seedPhotos.ellaTrain.publicId,
      durationDays: 8,
      startingPrice: 650,
      travelType: "ADVENTURE",
      description:
        "A well-rounded week through Sri Lanka's cultural capital, hill-country hiking trails, a wildlife safari and the historic Galle Fort.",
      highlights: [
        "Temple of the Sacred Tooth Relic in Kandy",
        "Nine Arches Bridge and hiking in Ella",
        "Leopard safari in Yala National Park",
        "Sunset walk on the Galle Fort ramparts",
      ],
      included: commonIncluded,
      excluded: commonExcluded,
      importantInfo: commonImportantInfo,
      published: true,
    },
    [
      { dayNumber: 1, title: "Arrival and Kandy", description: "Arrive and transfer to Kandy, visiting the Temple of the Sacred Tooth Relic.", hotelId: cinnamonCitadel.id, alternativeHotelIds: [mahaweliReach.id], places: [{ placeId: templeOfTooth.id, activities: ["Temple of the Tooth visit"] }] },
      { dayNumber: 2, title: "Kandy tea country", description: "Morning tea estate tour, afternoon at leisure around Kandy Lake.", hotelId: cinnamonCitadel.id, alternativeHotelIds: [mahaweliReach.id], places: [{ placeId: hanthanaTea.id, activities: ["Tea factory tour"] }, { placeId: kandyLake.id, activities: ["Lakeside walk"] }] },
      { dayNumber: 3, title: "Travel to Ella", description: "Scenic drive to Ella through tea plantations, visiting the Nine Arches Bridge.", hotelId: ella98Acres.id, alternativeHotelIds: [ellaFlowerGarden.id], places: [{ placeId: nineArchesBridge.id, activities: ["Nine Arches Bridge visit"] }] },
      { dayNumber: 4, title: "Ella hiking", description: "Morning hike up Little Adam's Peak, afternoon free to explore Ella town.", hotelId: ella98Acres.id, places: [{ placeId: littleAdamsPeak.id, activities: ["Little Adam's Peak hike"] }], optionalActivities: ["Ella Rock hike"] },
      { dayNumber: 5, title: "Travel to Yala", description: "Transfer to Yala, arriving in time for an evening safari drive.", hotelId: yalaSafariCamp.id, places: [{ placeId: yalaPark.id, activities: ["Evening safari jeep drive"] }] },
      { dayNumber: 6, title: "Yala to Galle", description: "Early morning safari drive, then transfer to the south coast, arriving at Galle Fort by evening.", hotelId: jetwingLighthouse.id, places: [{ placeId: yalaPark.id, activities: ["Morning safari jeep drive"] }, { placeId: galleFort.id, activities: ["Sunset walk on the ramparts"] }] },
      { dayNumber: 7, title: "Galle Fort", description: "A full day exploring the fort's ramparts, colonial streets and boutiques.", hotelId: jetwingLighthouse.id, places: [{ placeId: galleFort.id, activities: ["Walking tour of the fort"] }], optionalActivities: ["Surfing lesson"] },
      { dayNumber: 8, title: "Departure", description: "Morning at leisure on Unawatuna Beach before transfer for departure.", places: [{ placeId: unawatunaBeach.id, activities: ["Free morning at the beach"] }] },
    ],
  );

  const highlights = await seedPackage(
    {
      name: "Sri Lanka Highlights",
      slug: "sri-lanka-highlights",
      coverImageUrl: seedPhotos.nuwaraEliyaCabin.url,
      coverImagePublicId: seedPhotos.nuwaraEliyaCabin.publicId,
      durationDays: 7,
      startingPrice: 550,
      travelType: "CULTURAL",
      description:
        "A condensed introduction to Sri Lanka's essentials — the cultural capital of Kandy, the cool tea country of Nuwara Eliya, and the colonial coastal charm of Galle.",
      highlights: [
        "Temple of the Sacred Tooth Relic in Kandy",
        "Tea estate tour in Nuwara Eliya",
        "Horton Plains and World's End",
        "Galle Fort and Unawatuna Beach",
      ],
      included: commonIncluded,
      excluded: commonExcluded,
      importantInfo: commonImportantInfo,
      published: true,
    },
    [
      { dayNumber: 1, title: "Arrival and Kandy", description: "Arrive and transfer to Kandy, visiting the Temple of the Sacred Tooth Relic.", hotelId: cinnamonCitadel.id, places: [{ placeId: templeOfTooth.id, activities: ["Temple of the Tooth visit"] }] },
      { dayNumber: 2, title: "Kandy tea country", description: "Morning tea estate tour, afternoon walk around Kandy Lake.", hotelId: cinnamonCitadel.id, places: [{ placeId: hanthanaTea.id, activities: ["Tea factory tour"] }, { placeId: kandyLake.id, activities: ["Lakeside walk"] }] },
      { dayNumber: 3, title: "Travel to Nuwara Eliya", description: "Scenic drive up into tea country, visiting the Pedro Tea Estate.", hotelId: heritanceTeaFactory.id, alternativeHotelIds: [grandHotelNuwaraEliya.id], places: [{ placeId: pedroTeaEstate.id, activities: ["Tea estate tour and tasting"] }] },
      { dayNumber: 4, title: "Nuwara Eliya — Horton Plains", description: "Early start for the Horton Plains hike to World's End.", hotelId: heritanceTeaFactory.id, places: [{ placeId: hortonPlains.id, activities: ["Horton Plains and World's End hike"] }] },
      { dayNumber: 5, title: "Travel to Galle", description: "Transfer to the south coast, exploring Galle Fort at sunset.", hotelId: jetwingLighthouse.id, places: [{ placeId: galleFort.id, activities: ["Sunset walk on the ramparts"] }] },
      { dayNumber: 6, title: "Galle and Unawatuna", description: "Morning in Galle Fort, afternoon relaxing on Unawatuna Beach.", hotelId: jetwingLighthouse.id, places: [{ placeId: galleFort.id, activities: ["Walking tour of the fort"] }, { placeId: unawatunaBeach.id, activities: ["Beach afternoon"] }], optionalActivities: ["Surfing lesson"] },
      { dayNumber: 7, title: "Departure", description: "Morning at leisure before transfer for departure.", places: [] },
    ],
  );

  const groupMultiplier: Record<string, number> = {
    [twoTravelers.id]: 1.15,
    [twoToFive.id]: 1.0,
    [fiveToTen.id]: 0.9,
    [tenToTwenty.id]: 0.8,
  };
  const seasonMultiplier: Record<string, number> = {
    [peakSeason.id]: 1.15,
    [shoulderSeason.id]: 1.0,
    [lowSeason.id]: 0.9,
  };

  for (const tourPackage of [grandJourney, explorer, highlights]) {
    for (const groupSizeRange of [twoTravelers, twoToFive, fiveToTen, tenToTwenty]) {
      for (const season of [peakSeason, shoulderSeason, lowSeason]) {
        const base = Number(tourPackage.startingPrice);
        const price = Math.round((base * groupMultiplier[groupSizeRange.id] * seasonMultiplier[season.id]) / 5) * 5;
        await seedPricingRule({
          packageId: tourPackage.id,
          groupSizeRangeId: groupSizeRange.id,
          seasonId: season.id,
          pricePerPerson: price,
        });
      }
    }
  }

  const sampleEnquiry = await prisma.enquiry.findFirst({ where: { email: "n.perera.travel@example.com" } });
  if (!sampleEnquiry) {
    const honeymoonPackage = await prisma.tourPackage.findUnique({ where: { slug: "sri-lanka-honeymoon-escape" } });
    await prisma.enquiry.create({
      data: {
        name: "Nadeesha Perera",
        email: "n.perera.travel@example.com",
        phone: "+94 77 234 5678",
        preferredDate: new Date("2027-01-15"),
        travellersCount: 2,
        packageId: honeymoonPackage?.id,
        message: "Interested in this package for our honeymoon in January. Is the itinerary flexible on the beach days?",
        status: "NEW",
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
