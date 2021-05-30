export interface TourInterface {
  id: string;
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  createdAt: Date;
  startDates: Date[];
  secretTour: boolean;
  startLocation: {
    type: string;
    coordinates: number[];
    address: string;
    description: string;
  };
  locations: {
    type: string;
    coordinates: [number, number];
    address: string;
    description: string;
    day: number;
  }[];
  guides: {
    id: string;
    photo: string;
    name: string;
    role: string;
  }[];
  reviews: {
    id: string;
    tour: string;
    review: string;
    rating: number;
    user: {
      _id: string;
      photo: string;
      name: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
  __v: number;
}
