// src/pages/admin/Dashboard.tsx
import { useUsers } from '../../hooks';
import { Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { users } = useUsers();

  // Calculate stats
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    adminUsers: users.filter(u => u.role === 'ROLE_ADMIN').length,
    regularUsers: users.filter(u => u.role === 'ROLE_USER').length,
  };

  // Recent users

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p className="subtitle">Tổng quan hệ thống quản lý</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Tổng người dùng</p>
            <span className="stat-badge success">
              {stats.activeUsers} đang hoạt động
            </span>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.adminUsers}</h3>
            <p>Quản trị viên</p>
            <span className="stat-badge info">
              {stats.regularUsers} người dùng thường
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
