// Custom hook for Transactions
import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api.config';

export interface Transaction {
  id: string;
  userId: string;
  orderId: string;
  description: string;
  money: number;
  createdDate: string;
  paymentStatus: string;
}

// Mock transactions data
const mockTransactions: Transaction[] = [
  {
    id: 'TXN-2024-001',
    userId: 'dc4b0387-f0d9-441a-a73b-81347a1497fa',
    orderId: '638962958580764597',
    description: 'Nạp tiền vào ứng dụng',
    money: 1500000,
    createdDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    paymentStatus: 'success',
  },
  {
    id: 'TXN-2024-002',
    userId: '4266e7b5-2034-4a5a-b4ff-b4f3cd7044bb',
    orderId: '638962958580764598',
    description: 'Thanh toán hoá đơn điện',
    money: 250000,
    createdDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    paymentStatus: 'success',
  },
  {
    id: 'TXN-2024-003',
    userId: 'dc4b0387-f0d9-441a-a73b-81347a1497fa',
    orderId: '638962958580764599',
    description: 'Chuyển tiền cho bạn bè',
    money: 500000,
    createdDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    paymentStatus: 'pending',
  },
  {
    id: 'TXN-2024-004',
    userId: '4266e7b5-2034-4a5a-b4ff-b4f3cd7044bb',
    orderId: '638962958580764600',
    description: 'Lương tháng 10',
    money: 2000000,
    createdDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    paymentStatus: 'success',
  },
  {
    id: 'TXN-2024-005',
    userId: 'dc4b0387-f0d9-441a-a73b-81347a1497fa',
    orderId: '638962958580764601',
    description: 'Mua sắm trực tuyến',
    money: 75000,
    createdDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    paymentStatus: 'failed',
  },
  {
    id: 'TXN-2024-006',
    userId: '4266e7b5-2034-4a5a-b4ff-b4f3cd7044bb',
    orderId: '638962958580764602',
    description: 'Thanh toán dịch vụ',
    money: 300000,
    createdDate: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    paymentStatus: 'success',
  },
  {
    id: 'TXN-2024-007',
    userId: 'dc4b0387-f0d9-441a-a73b-81347a1497fa',
    orderId: '638962958580764603',
    description: 'Nạp tiền từ Ví điện tử',
    money: 1000000,
    createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paymentStatus: 'success',
  },
  {
    id: 'TXN-2024-008',
    userId: '4266e7b5-2034-4a5a-b4ff-b4f3cd7044bb',
    orderId: '638962958580764604',
    description: 'Giao dịch quán ăn',
    money: 150000,
    createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    paymentStatus: 'success',
  },
];

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Vnpay/transactions/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTransactions(data.data || []);
    } catch (err) {
      console.warn('API not available, using mock data:', err);
      setError('API không khả dụng, đang sử dụng dữ liệu mẫu');
      setTransactions(mockTransactions); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const getTransactionById = (id: string) => {
    return transactions.find(t => t.id === id);
  };

  const getTransactionsByUser = (userId: string) => {
    return transactions.filter(t => t.userId === userId);
  };

  const getTransactionsByStatus = (status: Transaction['paymentStatus']) => {
    return transactions.filter(t => t.paymentStatus === status);
  };

  const getStatistics = () => {
    return {
      totalTransactions: transactions.length,
      successfulTransactions: transactions.filter(t => t.paymentStatus === 'success').length,
      pendingTransactions: transactions.filter(t => t.paymentStatus === 'pending').length,
      failedTransactions: transactions.filter(t => t.paymentStatus === 'failed').length,
      totalIncome: transactions
        .filter(t => t.paymentStatus === 'success')
        .reduce((sum, t) => sum + t.money, 0),
      totalExpense: transactions
        .filter(t => t.paymentStatus === 'failed')
        .reduce((sum, t) => sum + t.money, 0),
      netBalance: transactions
        .filter(t => t.paymentStatus === 'success')
        .reduce((sum, t) => sum + t.money, 0) - transactions
        .filter(t => t.paymentStatus === 'failed')
        .reduce((sum, t) => sum + t.money, 0),
    };
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    getTransactionById,
    getTransactionsByUser,
    getTransactionsByStatus,
    getStatistics,
  };
};
