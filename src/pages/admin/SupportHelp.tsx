import React, { useState, useMemo } from 'react';
import '../styles/SupportHelp.css';
import { useConversations } from '../../hooks';
import ChatModal from '../../components/ChatModal';

const SupportHelp: React.FC = () => {
  const { conversations, loading, activateConversation, closeConversation } = useConversations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const handleActivateConversation = async (conversationId: string) => {
    try {
      const success = await activateConversation(conversationId);
      if (success) {
        // Refresh conversations to show updated status
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to activate conversation:', err);
    }
  };

  const handleCloseConversation = async (conversationId: string) => {
    try {
      const success = await closeConversation(conversationId);
      if (success) {
        // Refresh conversations to show updated status
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to close conversation:', err);
    }
  };

  const filteredConversations = useMemo(() => {
    return conversations.filter(conversation => {
      const matchesSearch = conversation.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           conversation.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || conversation.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [conversations, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'waiting': { class: 'warning', text: 'Waiting' },
      'active': { class: 'success', text: 'Active' },
      'pending': { class: 'warning', text: 'Pending' },
      'resolved': { class: 'info', text: 'Resolved' },
      'closed': { class: 'default', text: 'Closed' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { class: 'default', text: status };
    return (
      <span className={`status-badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="support-help">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải cuộc trò chuyện...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="support-help">
      <div className="page-header">
        <h1>Support Help</h1>
        <p>Manage customer support conversations and inquiries</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search by user ID or conversation ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="waiting">Waiting</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="conversations-section">
        <div className="table-wrapper">
          <table className="conversations-table">
            <thead>
              <tr>
                <th>Conversation ID</th>
                <th>User</th>
                <th>Status</th>
                <th>Messages</th>
                <th>Created</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConversations.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <h3>No conversations found</h3>
                      <p>Try adjusting your search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredConversations.map((conversation) => (
                  <tr key={conversation.id} className={conversation.status === 'closed' ? 'disabled-row' : ''}>
                    <td>
                      <code className="conversation-id">{conversation.id}</code>
                    </td>
                    <td>
                      <div className="user-cell">
                        <code className="user-id">{conversation.userId}</code>
                      </div>
                    </td>
                    <td>{getStatusBadge(conversation.status)}</td>
                    <td>
                      <span className="message-count">{conversation.messageCount}</span>
                    </td>
                    <td className="date">{formatDate(conversation.createdAt)}</td>
                    <td className="date">{formatDate(conversation.updatedAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() => setSelectedConversationId(conversation.id)}
                          title="View Details"
                          disabled={conversation.status === 'closed'}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                        <button
                          className="action-btn activate-btn"
                          onClick={() => handleActivateConversation(conversation.id)}
                          title="Activate Conversation"
                          disabled={conversation.status === 'active' || conversation.status === 'closed'}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h1.586a1 1 0 0 1 .707.293l.707.707A1 1 0 0 0 13.414 11H15m-3-3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                          </svg>
                        </button>
                        <button
                          className="action-btn close-btn"
                          onClick={() => handleCloseConversation(conversation.id)}
                          title="Close Conversation"
                          disabled={conversation.status === 'closed'}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedConversationId && (
        <ChatModal
          conversationId={selectedConversationId}
          onClose={() => setSelectedConversationId(null)}
        />
      )}
    </div>
  );
};

export default SupportHelp;