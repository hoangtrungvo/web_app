// src/layouts/AdminLayout.tsx
import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, CreditCard, LogOut, MessageSquare } from 'lucide-react';

const NAVIGATION_ITEMS = [
  { path: '/admin', icon: Home, label: 'Dashboard' },
  { path: '/admin/users', icon: Users, label: 'Quản lý người dùng' },
  { path: '/admin/transactions', icon: CreditCard, label: 'Giao dịch' },
  { path: '/admin/support', icon: MessageSquare, label: 'Hỗ trợ' },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check token on mount and redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_refresh_token');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Dashboard</h1>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          {NAVIGATION_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
