// Custom hook for Users API integration
import { useState, useEffect } from 'react';
import { userApi } from '../config/api';
import type { User, PaginatedResponse } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data matching User interface as fallback
  const mockUsers: User[] = [
    {
      id: 'dc4b0387-f0d9-441a-a73b-81347a1497fa',
      username: 'nguyenvana',
      email: 'nguyenvana@email.com',
      fullName: 'Nguyễn Văn A',
      gender: 'MALE',
      imgUrl: '',
      isActive: true,
      status: true,
      registerStatus: 'BASIC_INFO_COMPLETED',
      role: 'ROLE_USER'
    },
    {
      id: '4266e7b5-2034-4a5a-b4ff-b4f3cd7044bb',
      username: 'tranthib',
      email: 'tranthib@email.com',
      fullName: 'Trần Thị B',
      gender: 'FEMALE',
      imgUrl: '',
      isActive: true,
      status: true,
      registerStatus: 'BASIC_INFO_COMPLETED',
      role: 'ROLE_USER'
    },
    {
      id: 'mock-admin-uuid',
      username: 'admin',
      email: 'admin@petstore.com',
      fullName: 'Administrator',
      gender: 'MALE',
      imgUrl: '',
      isActive: true,
      status: true,
      registerStatus: 'BASIC_INFO_COMPLETED',
      role: 'ROLE_ADMIN'
    }
  ];

  const fetchUsers = async (page: number = 1, limit: number = 50, search?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response: PaginatedResponse<User> = await userApi.getUsers({ 
        page, 
        limit,
        search,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      setUsers(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
    } catch (err) {
      console.warn('API not available, using mock data:', err);
      setError('API không khả dụng, đang sử dụng dữ liệu mẫu');
      
      // Use mock data as fallback
      const filteredUsers = search 
        ? mockUsers.filter(u => 
            u.fullName.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.username.toLowerCase().includes(search.toLowerCase())
          )
        : mockUsers;
      
      setUsers(filteredUsers);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Omit<User, 'id'>) => {
    try {
      const newUser = await userApi.createUser(userData);
      setUsers(prev => [newUser, ...prev]);
      return newUser;
    } catch (err) {
      console.warn('API not available for user creation:', err);
      // Create mock user locally
      const newUser: User = {
        ...userData,
        id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      setUsers(prev => [newUser, ...prev]);
      return newUser;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const updatedUser = await userApi.updateUser(id, userData);
      setUsers(prev => 
        prev.map(user => 
          user.id === id ? updatedUser : user
        )
      );
      return updatedUser;
    } catch (err) {
      console.warn('API not available for user update:', err);
      // Update mock data locally
      setUsers(prev => 
        prev.map(user => 
          user.id === id ? { ...user, ...userData } : user
        )
      );
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await userApi.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.warn('API not available for user deletion:', err);
      // Remove from mock data locally
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  const toggleUserStatus = async (id: string) => {
    try {
      const updatedUser = await userApi.toggleUserStatus(id);
      setUsers(prev => 
        prev.map(user => 
          user.id === id ? updatedUser : user
        )
      );
      return updatedUser;
    } catch (err) {
      console.warn('API not available for status toggle:', err);
      // Toggle status in mock data locally
      setUsers(prev => 
        prev.map(user => 
          user.id === id ? { ...user, isActive: !user.isActive } : user
        )
      );
    }
  };

  const getUserById = async (id: string) => {
    try {
      return await userApi.getUserById(id);
    } catch (err) {
      console.warn('API not available, using mock data:', err);
      return mockUsers.find(user => user.id === id) || null;
    }
  };

  // Helper functions
  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Hoạt động' : 'Bị khóa';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-success' : 'bg-danger';
  };

  const getRoleText = (role: string) => {
    return role === 'ROLE_ADMIN' ? 'Quản trị viên' : 'Khách hàng';
  };

  const getRoleColor = (role: string) => {
    return role === 'ROLE_ADMIN' ? 'bg-primary' : 'bg-secondary';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getOrderCount = (userId: string) => {
    // This would typically come from orders API or be included in user data
    // For mock data, we'll simulate some order counts based on user index
    const orderCounts: { [key: string]: number } = {
      'dc4b0387-f0d9-441a-a73b-81347a1497fa': 12,
      '4266e7b5-2034-4a5a-b4ff-b4f3cd7044bb': 8,
      'mock-admin-uuid': 0
    };
    return orderCounts[userId] || 0;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    totalPages,
    currentPage,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getUserById,
    getStatusText,
    getStatusColor,
    getRoleText,
    getRoleColor,
    formatDate,
    getOrderCount
  };
};