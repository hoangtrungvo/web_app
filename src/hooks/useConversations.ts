// Custom hook for Conversations/Support
import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api.config';

export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'User' | 'Staff';
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface ConversationDetailDto {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: MessageDto[];
}

export interface ConversationDto {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Chat/conversations/all`, {
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

      console.log(data)
      setConversations(data.data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Không thể tải danh sách cuộc trò chuyện');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const getConversationById = (id: string) => {
    return conversations.find(c => c.id === id);
  };

  const getConversationsByUser = (userId: string) => {
    return conversations.filter(c => c.userId === userId);
  };

  const getConversationsByStatus = (status: ConversationDto['status']) => {
    return conversations.filter(c => c.status === status);
  };

  const getStatistics = () => {
    return {
      totalConversations: conversations.length,
      openConversations: conversations.filter(c => c.status === 'open').length,
      pendingConversations: conversations.filter(c => c.status === 'pending').length,
      closedConversations: conversations.filter(c => c.status === 'closed').length,
      totalMessages: conversations.reduce((sum, c) => sum + c.messageCount, 0),
      averageMessagesPerConversation: conversations.length > 0
        ? Math.round(conversations.reduce((sum, c) => sum + c.messageCount, 0) / conversations.length)
        : 0,
    };
  };

  const fetchConversationDetail = async (conversationId: string): Promise<ConversationDetailDto | null> => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Chat/conversations/${conversationId}`, {
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
      return data.data || null;
    } catch (err) {
      console.error('Error fetching conversation detail:', err);
      return null;
    }
  };

  const sendMessage = async (payload: {
    userId: string;
    senderId: string;
    senderType: string;
    content: string;
    conversationId: string;
  }): Promise<boolean> => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      return false;
    }
  };

  const fetchMessages = async (conversationId: string, lastId?: string): Promise<MessageDto[]> => {
    try {
      const token = localStorage.getItem('admin_token');
      const queryParams = new URLSearchParams({
        conversationId,
        ...(lastId && { lastId }),
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Chat/messages?${queryParams.toString()}`, {
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
      return data.data || [];
    } catch (err) {
      console.error('Error fetching messages:', err);
      return [];
    }
  };

  const markMessageAsRead = async (messageId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Chat/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      console.error('Error marking message as read:', err);
      return false;
    }
  };

  const activateConversation = async (conversationId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Chat/conversations/${conversationId}/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      console.error('Error activating conversation:', err);
      return false;
    }
  };

  const closeConversation = async (conversationId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Chat/conversations/${conversationId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      console.error('Error closing conversation:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    fetchConversationDetail,
    fetchMessages,
    sendMessage,
    getConversationById,
    getConversationsByUser,
    getConversationsByStatus,
    getStatistics,
    markMessageAsRead,
    activateConversation,
    closeConversation,
  };
};
