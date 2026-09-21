import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

type PackageDay = {
  dayNumber: number;
  title: string;
  description: string;
  hotelId?: string;
  places: { placeId: string; activities: string[] }[];
};

async function seedPackage(
  data: {
    name: string;
    slug: string;
    durationDays: number;
    startingPrice: number;
    travelType: "ADVENTURE" | "CULTURAL" | "BEACH" | "WILDLIFE" | "HONEYMOON" | "FAMILY" | "WELLNESS";
    description: string;
    highlights: string[];
    included: string[];
    excluded: string[];
    destinationId: string;
    published: boolean;
  },
  days: PackageDay[],
) {
  const tourPackage = await prisma.tourPackage.upsert({
    where: { slug: data.slug },
    update: data,
    create: data,
  });

  for (const day of days) {
    const tourDay = await prisma.tourDay.upsert({
      where: { packageId_dayNumber: { packageId: tourPackage.id, dayNumber: day.dayNumber } },
      update: { title: day.title, description: day.description, hotelId: day.hotelId },
      create: {
        packageId: tourPackage.id,
        dayNumber: day.dayNumber,
        title: day.title,
        description: day.description,
        hotelId: day.hotelId,
      },
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

async function main() {
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
