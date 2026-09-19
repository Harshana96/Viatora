export type LatLng = {
  latitude: number;
  longitude: number;
};

export type JourneyPlace = LatLng & {
  id: string;
  name: string;
  activities: string[];
};

export type JourneyDay = {
  id: string;
  dayNumber: number;
  title: string | null;
  description: string | null;
  hotelName: string | null;
  places: JourneyPlace[];
};
