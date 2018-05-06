export type WirePost = {
  id?: number;
  restaurantName: string;
  dateVisited: Date;
  neighborhood: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  order: string[];
  cost: number;
  tags: string[];
};
