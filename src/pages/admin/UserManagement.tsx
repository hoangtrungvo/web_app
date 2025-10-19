// src/pages/admin/UserManagement.tsx
import { useState, useEffect } from 'react';
import { useUsers } from '../../hooks';
import { Search, UserCog, Plus, UserMinus } from 'lucide-react';

const UserManagement = () => {
  const { users, loading, assignStaff, unassignStaff, addCredit } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [creditAmount, setCreditAmount] = useState('');

  const handleAddCredit = async () => {
    if (!selectedUserId || !creditAmount) return;
    
    try {
      const amount = parseFloat(creditAmount);
      if (isNaN(amount) || amount <= 0) {
        alert('Vui lòng nhập số tiền hợp lệ');
        return;
      }
      
      await addCredit(selectedUserId, amount);
      setShowCreditModal(false);
      setCreditAmount('');
      setSelectedUserId(null);
      alert('Thêm credit thành công!');
    } catch (err) {
      console.error('Failed to add credit:', err);
      alert('Có lỗi xảy ra khi thêm credit');
    }
  };

  const openCreditModal = (userId: string) => {
    setSelectedUserId(userId);
    setShowCreditModal(true);
  };

  const handleAssignStaff = async (userId: string) => {
    try {
      await assignStaff(userId);
      // Reload the page after successful assignment
      window.location.reload();
    } catch (err) {
      console.error('Failed to assign staff:', err);
      alert('Có lỗi xảy ra khi chỉ định nhân viên');
    }
  };    

    const handleUnAssignStaff = async (userId: string) => {
    try {
      await unassignStaff(userId);
      // Reload the page after successful assignment
      window.location.reload();
    } catch (err) {
      console.error('Failed to unassign staff:', err);
      alert('Có lỗi xảy ra khi gỡ bỏ nhân viên');
    }
  };    


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
              <th>Vai trò</th>
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
                  <span className={`badge ${user.role === 'ROLE_ADMIN' ? 'primary' : user.role === 'ROLE_STAFF' ? 'info' : 'default'}`}>
                    {user.role === 'ROLE_ADMIN' ? 'Quản trị viên' : 
                     user.role === 'ROLE_STAFF' ? 'Nhân viên' : 'Khách hàng'}
                  </span>
                </td>
                <td>
                  {user.role === 'ROLE_USER' && (
                    <button
                      onClick={() => handleAssignStaff(user.id)}
                      className="btn-action primary"
                      title="Chỉ định làm nhân viên"
                    >
                      <UserCog size={16} />
                    </button>
                  )}
                  {user.role === 'ROLE_STAFF' && (
                    <button
                      onClick={() => unassignStaff?.(user.id)}
                      className="btn-action danger"
                      title="Gỡ bỏ vai trò nhân viên"
                    >
                      <UserMinus size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => openCreditModal(user.id)}
                    className="btn-action success"
                    title="Thêm credit"
                  >
                    <Plus size={16} />
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

      {/* Credit Modal */}
      {showCreditModal && (
        <div className="modal-overlay" onClick={() => setShowCreditModal(false)}>
          <div className="modal credit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <div className="credit-icon">💰</div>
                <h3>Thêm Credit</h3>
              </div>
              <button 
                className="modal-close"
                onClick={() => setShowCreditModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="user-info">
                <div className="user-avatar">
                  {filteredUsers.find(u => u.id === selectedUserId)?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="user-details">
                  <div className="user-name">
                    {filteredUsers.find(u => u.id === selectedUserId)?.fullName}
                  </div>
                  <div className="user-email">
                    {filteredUsers.find(u => u.id === selectedUserId)?.email}
                  </div>
                </div>
              </div>
              
              <div className="credit-form">
                <div className="form-group">
                  <label htmlFor="creditAmount">Số tiền cần thêm</label>
                  <div className="input-wrapper">
                    <span className="currency-symbol">₫</span>
                    <input
                      id="creditAmount"
                      type="number"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="1000"
                      autoFocus
                    />
                  </div>
                  <div className="input-hint">
                    Nhập số tiền bằng VNĐ (Ví dụ: 50000)
                  </div>
                </div>
                
                <div className="credit-presets">
                  <span className="preset-label">Số tiền phổ biến:</span>
                  <div className="preset-buttons">
                    <button 
                      type="button" 
                      className="preset-btn"
                      onClick={() => setCreditAmount('50000')}
                    >
                      50,000₫
                    </button>
                    <button 
                      type="button" 
                      className="preset-btn"
                      onClick={() => setCreditAmount('100000')}
                    >
                      100,000₫
                    </button>
                    <button 
                      type="button" 
                      className="preset-btn"
                      onClick={() => setCreditAmount('200000')}
                    >
                      200,000₫
                    </button>
                    <button 
                      type="button" 
                      className="preset-btn"
                      onClick={() => setCreditAmount('500000')}
                    >
                      500,000₫
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => setShowCreditModal(false)}
                className="btn-secondary"
              >
                Hủy
              </button>
              <button 
                onClick={handleAddCredit}
                className="btn-primary"
                disabled={!creditAmount || parseFloat(creditAmount) <= 0}
              >
                <Plus size={16} />
                Thêm Credit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
