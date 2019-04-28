export type WirePost = {
  id?: number;
  restaurantName: string;
  dateVisited: Date;
  neighborhood: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  instagramUrl: string;
  latitude: number;
  longitude: number;
  order: string[];
  cost: number;
  tags: string[];
};
