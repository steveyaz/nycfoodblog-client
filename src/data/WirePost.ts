export type WirePost = {
  id: number;
  dateCreated: Date;
  restaurantName: string;
  dateVisited: Date;
  neighborhood: string;
  cuisineType: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  order: string[];
  cost: number;
  tags: string[];
};
