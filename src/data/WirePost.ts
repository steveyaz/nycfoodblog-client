export type WirePost = {
  id?: number;
  restaurantName: string;
  dateVisited: Date;
  neighborhood: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  lat: number;
  long: number;
  instagramUrl: string;
  order: string[];
  cost: number;
  tags: string[];
};
