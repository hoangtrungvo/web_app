// src/layouts/AdminLayout.tsx
import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, CreditCard, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavigationItem {
  path: string;
  icon: React.ComponentType<{ size: number }>;
  label: string;
  roles?: string[]; // undefined means available for all roles
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { path: '/admin', icon: Home, label: 'Dashboard' },
  { path: '/admin/users', icon: Users, label: 'Quản lý người dùng', roles: ['ROLE_ADMIN'] },
  { path: '/admin/transactions', icon: CreditCard, label: 'Giao dịch', roles: ['ROLE_ADMIN'] },
  { path: '/admin/support', icon: MessageSquare, label: 'Hỗ trợ', roles: ['ROLE_ADMIN', 'ROLE_STAFF'] },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();

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

  const currentUser = getCurrentUser();
  const userRole = currentUser?.role || '';

  // Filter navigation items based on user role
  const visibleNavItems = NAVIGATION_ITEMS.filter(item => {
    // If no roles specified, show to everyone
    if (!item.roles) return true;
    // Otherwise, only show if user role is in the allowed roles
    return item.roles.includes(userRole);
  });

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Dashboard</h1>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          {visibleNavItems.map(item => {
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
