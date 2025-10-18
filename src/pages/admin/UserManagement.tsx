// src/pages/admin/UserManagement.tsx
import { useState } from 'react';
import { useUsers } from '../../hooks';
import { Search, UserCheck, UserX } from 'lucide-react';

const UserManagement = () => {
  const { users, loading, toggleUserStatus } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-state">Đang tải người dùng...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Quản lý Người dùng</h2>
          <p className="subtitle">{filteredUsers.length} người dùng</p>
        </div>
      </div>

      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="font-mono">#{user.id}</td>
                <td className="font-bold">{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.isActive ? 'success' : 'danger'}`}>
                    {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                  </span>
                </td>
       
                <td>
                  <button
                    onClick={() => toggleUserStatus?.(user.id)}
                    className={`btn-action ${user.isActive ? 'danger' : 'success'}`}
                    title={user.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
                  >
                    {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>Không tìm thấy người dùng</h3>
            <p>Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
