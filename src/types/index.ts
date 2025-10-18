// Types cho Pet Store Admin System

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  weight: string;
  flavor: string;
  ageGroup: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string; // UUID from API
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  status: boolean;
  registerStatus: string;
  role: string; // e.g., "ROLE_ADMIN", "ROLE_USER"
}

export interface Order {
  id: number;
  userId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Discount {
  id: number;
  name: string;
  description: string;
  type: 'Percentage' | 'Fixed';
  value: number;
  startDate: string;
  endDate: string;
  applicableCategories: string[];
  minimumPurchase: number;
  isActive: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}