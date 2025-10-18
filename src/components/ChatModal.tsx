import React, { useState, useEffect, useRef } from 'react';
import type { ConversationDetailDto } from '../hooks/useConversations';
import { useConversations } from '../hooks/useConversations';
import '../styles/ChatModal.css';

interface ChatModalProps {
  conversationId: string;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ conversationId, onClose }) => {
  const { fetchConversationDetail, fetchMessages, sendMessage, markMessageAsRead, activateConversation, closeConversation } = useConversations();
  const [conversation, setConversation] = useState<ConversationDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const conversationRef = useRef<ConversationDetailDto | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  useEffect(() => {
    loadConversationDetail();
    startPolling();

    return () => {
      stopPolling();
    };
  }, [conversationId]);

  const startPolling = () => {
    // Clear any existing polling
    stopPolling();

    console.log("Starting polling for new messages...");

    // Poll every 5 seconds
    pollingIntervalRef.current = setInterval(() => {
      pollNewMessages();
    }, 5000);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const pollNewMessages = async () => {
    if (!conversationRef.current || !conversationRef.current.messages?.length) {
      console.log("Skipping poll: no conversation or messages");
      return;
    }

    try {
      // Get the last message ID
      const lastMessage = conversationRef.current.messages[conversationRef.current.messages.length - 1];
      console.log("Polling for new messages after:", lastMessage.id);
      
      const newMessages = await fetchMessages(conversationId, lastMessage.id);

      if (newMessages && newMessages.length > 0) {
        console.log("Found new messages:", newMessages.length);
        // Update conversation with new messages
        setConversation((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, ...newMessages],
          };
        });
      } else {
        console.log("No new messages");
      }
    } catch (err) {
      console.error('Error polling messages:', err);
    }
  };

  const loadConversationDetail = async () => {
    try {
      setLoading(true);
      const detail = await fetchConversationDetail(conversationId);
      setConversation(detail);

      // Mark unread user messages as read when staff opens the chat
      if (detail && detail.messages) {
        const unreadUserMessages = detail.messages.filter(
          message => !message.isRead && message.senderType === 'User'
        );

        // Mark each unread message as read
        for (const message of unreadUserMessages) {
          try {
            const success = await markMessageAsRead(message.id);
            if (success) {
              // Update local state to reflect read status
              setConversation((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  messages: prev.messages.map((msg) =>
                    msg.id === message.id ? { ...msg, isRead: true } : msg
                  ),
                };
              });
            }
          } catch (err) {
            console.error(`Failed to mark message ${message.id} as read:`, err);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !conversation) return;

    try {
      setSending(true);

      // Get staff ID from localStorage (or auth context)
      const staffId = localStorage.getItem('admin_id') || 'staff';
      
      const payload = {
        userId: conversation.userId,
        senderId: staffId,
        senderType: 'Staff',
        content: messageInput.trim(),
        conversationId: conversation.id,
      };

      const success = await sendMessage(payload);

      if (success) {
        setMessageInput('');
        // Reload conversation to show new message
        await loadConversationDetail();
      } else {
        console.error('Failed to send message');
      }
    } finally {
      setSending(false);
    }
  };

  const handleActivateConversation = async () => {
    if (!conversation) return;
    try {
      const success = await activateConversation(conversation.id);
      if (success) {
        // Update local state
        setConversation(prev => prev ? { ...prev, status: 'active' } : null);
      }
    } catch (err) {
      console.error('Failed to activate conversation:', err);
    }
  };

  const handleCloseConversation = async () => {
    if (!conversation) return;
    try {
      const success = await closeConversation(conversation.id);
      if (success) {
        // Update local state
        setConversation(prev => prev ? { ...prev, status: 'closed' } : null);
      }
    } catch (err) {
      console.error('Failed to close conversation:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!conversation || !conversation.messages) return;
    
    const unreadMessages = conversation.messages.filter(msg => !msg.isRead);
    
    for (const message of unreadMessages) {
      try {
        const success = await markMessageAsRead(message.id);
        if (success) {
          setConversation(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              messages: prev.messages.map(msg =>
                msg.id === message.id ? { ...msg, isRead: true } : msg
              ),
            };
          });
        }
      } catch (err) {
        console.error(`Failed to mark message ${message.id} as read:`, err);
      }
    }
  };

  if (loading) {
    return (
      <div className="chat-overlay" onClick={onClose}>
        <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="chat-overlay" onClick={onClose}>
        <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
          <div className="error-container">
            <p>Failed to load conversation</p>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="chat-header">
          <div className="header-info">
            <h3>Conversation with {conversation.userId}</h3>
            <span className={`status-badge ${getStatusClass(conversation.status)}`}>
              {conversation.status}
            </span>
          </div>
          <div className="header-actions">
            <button 
              className="action-btn activate-btn" 
              onClick={handleActivateConversation}
              disabled={conversation.status === 'active'}
            >
              Activate
            </button>
            <button 
              className="action-btn close-conversation-btn" 
              onClick={handleCloseConversation}
              disabled={conversation.status === 'closed'}
            >
              Close
            </button>
            <button 
              className="action-btn read-btn" 
              onClick={handleMarkAllAsRead}
            >
              Mark All Read
            </button>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {conversation.messages && conversation.messages.length > 0 ? (
            <>
              {conversation.messages.map((message, index) => {
                const currentDate = formatDate(message.createdAt);
                const prevDate = index > 0 ? formatDate(conversation.messages[index - 1].createdAt) : null;
                const showDateDivider = currentDate !== prevDate;

                return (
                  <div key={message.id}>
                    {showDateDivider && (
                      <div className="date-divider">
                        <span>{currentDate}</span>
                      </div>
                    )}
                    <div className={`message-wrapper ${message.senderType.toLowerCase()}`}>
                      <div className={`message ${message.senderType.toLowerCase()}`}>
                        <div className="message-content">
                          {message.content}
                        </div>
                        <div className="message-time">
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="empty-messages">
              <p>No messages yet</p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <div className="input-wrapper">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              rows={3}
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || sending}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    'waiting': 'warning',
    'active': 'success',
    'pending': 'warning',
    'resolved': 'info',
    'closed': 'default',
  };
  return statusMap[status] || 'default';
};

export default ChatModal;
