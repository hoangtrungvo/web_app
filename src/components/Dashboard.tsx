import { Link, useLocation } from 'react-router-dom';
import { useUsers } from '../hooks';

const Dashboard = () => {
  const location = useLocation();
  const { users } = useUsers();

  const isActive = (path: string) => location.pathname === path;

  // Calculate user stats
  const userStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    adminUsers: users.filter(u => u.role === 'ROLE_ADMIN').length,
    regularUsers: users.filter(u => u.role === 'ROLE_USER').length,
  };

  // Recent users
  const recentUsers = users.slice(0, 8);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-logo">
          🐾 Pet Store Admin
        </div>
        <nav className="admin-nav">
          <Link 
            to="/admin" 
            className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
          >
            📊 Dashboard
          </Link>
          <Link 
            to="/admin/users" 
            className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}
          >
            👥 Quản lý người dùng
          </Link>
          <Link 
            to="/admin/transactions" 
            className={`nav-item ${isActive('/admin/transactions') ? 'active' : ''}`}
          >
            � Giao dịch
          </Link>
          <Link 
            to="/" 
            className="nav-item"
          >
            🏠 Về trang chủ
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="page-header">
          <h1 className="dashboard-title">📊 Dashboard - Quản lý hệ thống</h1>
          <div className="header-actions">
            <button className="btn-primary">🔄 Làm mới</button>
          </div>
        </div>

        {/* User Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#e74c3c' }}>�</div>
            <div className="stat-value">{userStats.totalUsers}</div>
            <div className="stat-label">Tổng người dùng</div>
            <div className="stat-change" style={{ color: '#27ae60', fontSize: '12px' }}>
              {userStats.activeUsers} đang hoạt động
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#3498db' }}>�</div>
            <div className="stat-value">{userStats.adminUsers}</div>
            <div className="stat-label">Quản trị viên</div>
            <div className="stat-change" style={{ color: '#3498db', fontSize: '12px' }}>
              {userStats.regularUsers} người dùng thường
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#27ae60' }}>✓</div>
            <div className="stat-value">{userStats.activeUsers}</div>
            <div className="stat-label">Người dùng hoạt động</div>
            <div className="stat-change" style={{ color: '#27ae60', fontSize: '12px' }}>
              {Math.round((userStats.activeUsers / userStats.totalUsers) * 100)}% tỷ lệ
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#f39c12' }}>�</div>
            <div className="stat-value">Hôm nay</div>
            <div className="stat-label">Ngày hiện tại</div>
            <div className="stat-change" style={{ color: '#f39c12', fontSize: '12px' }}>
              {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="data-table" style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>� Người dùng gần đây</h3>
          <div className="table-header">
            <div>Tên người dùng</div>
            <div>Email</div>
            <div>Vai trò</div>
            <div>Trạng thái</div>
          </div>
          
          {recentUsers.map((user: any) => (
            <div key={user.id} className="table-row">
              <div className="table-cell font-bold">{user.fullName || user.username}</div>
              <div className="table-cell">{user.email}</div>
              <div className="table-cell">
                <span className={`status-badge ${
                  user.role === 'ROLE_ADMIN' ? 'bg-primary' : 'bg-secondary'
                }`}>
                  {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Người dùng'}
                </span>
              </div>
              <div className="table-cell">
                <span className={`status-badge ${
                  user.isActive ? 'bg-success' : 'bg-danger'
                }`}>
                  {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                </span>
              </div>
            </div>
          ))}
          
          <div style={{ textAlign: 'center', padding: '15px' }}>
            <Link to="/admin/users" className="btn-primary" style={{ textDecoration: 'none' }}>
              Xem tất cả người dùng →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>🚀 Thao tác nhanh</h3>
          <div className="action-buttons">
            <Link to="/admin/users" className="action-btn btn-primary" style={{ textDecoration: 'none' }}>
              ➕ Quản lý người dùng
            </Link>
            <Link to="/admin/transactions" className="action-btn btn-secondary" style={{ textDecoration: 'none' }}>
              � Xem giao dịch
            </Link>
            <button className="action-btn btn-info">
              📊 Xuất báo cáo
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="summary-cards">
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-value">Bình thường</div>
            <div className="stat-label">Trạng thái hệ thống</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💾</div>
            <div className="stat-value">78%</div>
            <div className="stat-label">Sử dụng lưu trữ</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌐</div>
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👀</div>
            <div className="stat-value">1,234</div>
            <div className="stat-label">Lượt truy cập hôm nay</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;