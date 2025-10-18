// 🚀 API Service cho Pet Store Admin
// 📝 HƯỚNG DẪN: Để thay đổi API URL, vào file src/config/api.config.ts
import type { Product, User, Order, PaginationParams, PaginatedResponse } from '../types';
import { API_CONFIG, API_ENDPOINTS, getHeaders } from './api.config';

// 🎯 **SWAGGER API INTEGRATION POINT**
// API URL được lấy từ config - thay đổi tại src/config/api.config.ts
const BASE_URL = API_CONFIG.BASE_URL;

// Global flag để tránh multiple refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// Auto refresh token khi 401
const refreshAccessToken = async (): Promise<boolean> => {
  // Nếu đang refresh, chờ existing refresh
  if (isRefreshing && refreshPromise) {
    return await refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem('admin_refresh_token');
      if (!refreshToken) {
        console.error('No refresh token available');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_refresh_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/login';
        return false;
      }

      const response = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refreshToken
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newAccessToken = data.accessToken || data.access_token;
      const newRefreshToken = data.refreshToken || data.refresh_token;

      if (!newAccessToken) {
        throw new Error('No access token in refresh response');
      }

      // Update localStorage
      localStorage.setItem('admin_token', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('admin_refresh_token', newRefreshToken);
      }

      console.log('✅ Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      // Clear tokens và redirect to login
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return await refreshPromise;
};

// Helper function để xử lý response từ API localhost:5257
const handleResponse = async <T>(response: Response, retryCount: number = 0): Promise<T> => {
  // Xử lý 401 - refresh token
  if (response.status === 401 && retryCount === 0) {
    const refreshSuccess = await refreshAccessToken();
    if (refreshSuccess) {
      // Token đã được refresh, caller cần retry request
      throw new Error('TOKEN_REFRESHED_RETRY');
    }
    throw new Error('Unauthorized - Token refresh failed');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }
  
  const result = await response.json();
  
  // API trả về format: { success: true, message: "...", data: [...], error: null }
  if (result.success === false || result.error) {
    throw new Error(result.error || result.message || 'API Error');
  }
  
  // Trả về data từ response
  return result.data || result;
};

// Helper function để fetch với auto-retry khi 401
const fetchWithAutoRetry = async (
  url: string, 
  options: RequestInit = {}, 
  timeoutMs: number = 10000,
  retryCount: number = 0
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    // Handle 401
    if (response.status === 401 && retryCount === 0) {
      const refreshSuccess = await refreshAccessToken();
      if (refreshSuccess) {
        // Retry request với token mới
        clearTimeout(timeoutId);
        return fetchWithAutoRetry(url, options, timeoutMs, 1);
      }
    }

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};



// ===== USER API =====
export const userApi = {
  // Lấy danh sách users với phân trang
  getUsers: async (params: PaginationParams): Promise<PaginatedResponse<User>> => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      ...(params.search && { search: params.search }),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortOrder && { sortOrder: params.sortOrder }),
    });

    const response = await fetchWithAutoRetry(`${BASE_URL}${API_ENDPOINTS.USERS.LIST}?${queryParams}`, {
      headers: getHeaders(),
    });

    console.log(response);
    
    const result = await handleResponse<{
      items: User[];
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    }>(response);
    
    console.log(result);
    
    // API returns pagination structure directly
    return {
      data: result.items,
      total: result.totalItems,
      page: result.page,
      totalPages: result.totalPages,
      hasNext: result.page < result.totalPages,
      hasPrev: result.page > 1
    };
  },

  // Lấy user theo ID
  getUserById: async (id: string): Promise<User> => {
    const response = await fetchWithAutoRetry(`${BASE_URL}/users/${id}`, {
      headers: getHeaders(),
    });
    
    return await handleResponse<User>(response);
  },

  // Tạo user mới
  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await fetchWithAutoRetry(`${BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(user),
    });
    
    return await handleResponse<User>(response);
  },

  // Cập nhật user
  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await fetchWithAutoRetry(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(user),
    });
    
    return await handleResponse<User>(response);
  },

  // Xóa user (soft delete - set isActive = false)
  deleteUser: async (id: string): Promise<void> => {
    const response = await fetchWithAutoRetry(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    await handleResponse<void>(response);
  },

  // Block/Unblock user
  toggleUserStatus: async (id: string): Promise<User> => {
    const response = await fetchWithAutoRetry(`${BASE_URL}/users/${id}/toggle-status`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    
    return await handleResponse<User>(response);
  },
};

// ===== ORDER API =====
export const orderApi = {
  // Lấy danh sách orders với phân trang
  getOrders: async (params: PaginationParams & { status?: string }): Promise<PaginatedResponse<Order>> => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      ...(params.search && { search: params.search }),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortOrder && { sortOrder: params.sortOrder }),
      ...(params.status && { status: params.status }),
    });

    const response = await fetchWithAutoRetry(`${BASE_URL}/orders?${queryParams}`, {
      headers: getHeaders(),
    });
    
    const orders = await handleResponse<Order[]>(response);
    
    // Tạo mock pagination response
    return {
      data: orders,
      total: orders.length,
      page: params.page,
      totalPages: Math.ceil(orders.length / params.limit),
      hasNext: false,
      hasPrev: params.page > 1
    };
  },

  // Lấy order theo ID
  getOrderById: async (id: number): Promise<Order> => {
    const response = await fetchWithAutoRetry(`${BASE_URL}/orders/${id}`, {
      headers: getHeaders(),
    });
    
    return await handleResponse<Order>(response);
  },

  // Cập nhật trạng thái order
  updateOrderStatus: async (id: number, status: Order['status']): Promise<Order> => {
    const response = await fetchWithAutoRetry(`${BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    
    return await handleResponse<Order>(response);
  },

  // Lấy thống kê orders
  getOrderStats: async (): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    shipping: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  }> => {
    const response = await fetchWithAutoRetry(`${BASE_URL}/orders/stats`, {
      headers: getHeaders(),
    });
    
    const result = await handleResponse<any>(response);
    return result.data;
  },
};

// ===== AUTH API =====
export const authApi = {
  // Đăng nhập admin
  login: async (username: string, password: string): Promise<{ accessToken: string; refreshToken: string; expiration: string }> => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: username, password }),
    });

    const result = await handleResponse<{ accessToken: string; refreshToken: string; expiration: string }>(response);

    // // Lưu token vào localStorage
    // localStorage.setItem('admin_token', result.accessToken);
    // localStorage.setItem('admin_refresh_token', result.refreshToken);
    // localStorage.setItem('admin_token_expiration', result.expiration);
    
    return result;
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  // Kiểm tra token còn hạn không
  verifyToken: async (): Promise<User> => {
    const response = await fetchWithAutoRetry(`${BASE_URL}/auth/verify`, {
      headers: getHeaders(),
    });
    
    return await handleResponse<User>(response);
  },
};


// ===== DASHBOARD API =====
export const dashboardApi = {
  // Lấy thống kê tổng quan
  getDashboardStats: async (): Promise<{
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
    topProducts: Product[];
  }> => {
    const response = await fetchWithAutoRetry(`${BASE_URL}/dashboard/stats`, {
      headers: getHeaders(),
    });
    
    const result = await handleResponse<any>(response);
    return result.data;
  },
};