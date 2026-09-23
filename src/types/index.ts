export type LatLng = {
  latitude: number;
  longitude: number;
};

export type JourneyPlace = LatLng & {
  id: string;
  name: string;
  activities: string[];
};

export type HotelOption = {
  id: string;
  name: string;
  location: string;
  rating: number | null;
};

export type JourneyDay = {
  id: string;
  dayNumber: number;
  title: string | null;
  description: string | null;
  hotelName: string | null;
  hotelOptions: HotelOption[];
  optionalActivities: string[];
  places: JourneyPlace[];
};
