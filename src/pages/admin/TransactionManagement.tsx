// src/pages/admin/TransactionManagement.tsx
import { useState, useEffect } from 'react';
import { useTransactions, type Transaction } from '../../hooks/useTransactions';
import { 
  Search, 
  Zap
} from 'lucide-react';
import '../styles/TransactionManagement.css';

const TransactionManagement = () => {
  const { transactions, loading, error, fetchTransactions } = useTransactions();
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((t: Transaction) =>
        t.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.userId?.toString().includes(searchTerm) ||
        t.orderId?.toString().includes(searchTerm) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((t: Transaction) => t.paymentStatus === filterStatus);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, filterStatus]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // const getTypeIcon = (type: string) => {
  //   if (type === 'deposit' || type === 'income') {
  //     return <ArrowDownLeft size={16} />;
  //   }
  //   return <ArrowUpRight size={16} />;
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Quản lý giao dịch</h2>
          <p className="subtitle">Theo dõi và quản lý tất cả giao dịch trong hệ thống</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <Zap size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo ID giao dịch, người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Trạng thái</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="success">Thành công</option>
              <option value="pending">Đang xử lý</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-section">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Đang tải giao dịch...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <Zap size={48} />
            <h3>Không có giao dịch nào</h3>
            <p>Hiện tại không có giao dịch phù hợp với tiêu chí tìm kiếm</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Mã giao dịch</th>
                  <th>Người dùng</th>
                  <th>Mã đơn hàng</th>
                  <th>Mô tả</th>
                  <th>Số tiền</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction: Transaction) => (
                  <tr key={transaction.id}>
                    <td className="transaction-id">
                      <code>{transaction.id?.substring(0, 12)}...</code>
                    </td>
                    <td>
                      <div className="user-cell">
                        <span className="user-id">{transaction.userId}</span>
                      </div>
                    </td>
                    <td>
                      <code>{transaction.orderId}</code>
                    </td>
                    <td className="description">
                      <span title={transaction.description}>
                        {transaction.description || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className="amount">
                        {formatAmount(transaction.money)}
                      </span>
                    </td>
                    <td className="date">
                      {formatDate(transaction.createdDate)}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(transaction.paymentStatus)}`}>
                        {transaction.paymentStatus === 'success' ? '✓ Thành công' :
                         transaction.paymentStatus === 'pending' ? '⏳ Đang xử lý' : '✕ Thất bại'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionManagement;
