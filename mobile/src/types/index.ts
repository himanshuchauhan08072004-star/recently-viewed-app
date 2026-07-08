export interface Product {
  _id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  discountPrice?: number;
  rating: number;
  stock: number;
}

export interface RecentlyViewedItem {
  _id: string;
  productId: Product;
  userId: string;
  viewedAt: string;
}

export interface GuestViewedItem {
  productId: string;
  viewedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
