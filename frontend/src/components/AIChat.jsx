import React, { useState, useEffect, useRef } from 'react';
import API_BASE_URL from '../config/api';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Hello! 👋 I\'m your AI Task Assistant. I can help you with:\n• Finding newly assigned tasks\n• Listing tasks due today\n• Reorganizing your priorities\n• Finding urgent work\n• Viewing completed tasks\n• Getting a task summary\n\nWhat would you like to know?', 
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const userMessage = { 
        id: Date.now(), 
        text: inputValue, 
        sender: 'user',
        timestamp: new Date()
      };
      setMessages([...messages, userMessage]);
      setInputValue('');
      setLoading(true);
      
      // Send to backend
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await fetch(`${API_BASE_URL}/api/ai-chat/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user._id,
            userType: user.userType,
            query: inputValue
          })
        });

        const data = await response.json();

        if (data.success) {
          const aiResponse = {
            id: Date.now() + 1,
            text: data.response,
            sender: 'ai',
            timestamp: new Date(),
            actionType: data.actionType,
            data: data.data
          };
          setMessages(prev => [...prev, aiResponse]);
        } else {
          const errorResponse = {
            id: Date.now() + 1,
            text: "Sorry, I encountered an error processing your request. Please try again.",
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorResponse]);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        const errorResponse = {
          id: Date.now() + 1,
          text: "Sorry, I couldn't process your request. Please check your connection and try again.",
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleQuickQuery = (query) => {
    setInputValue(query);
  };

  const formatTaskDisplay = (tasks) => {
    if (!tasks || tasks.length === 0) return null;
    
    return (
      <div className="task-list-display">
        {tasks.slice(0, 5).map((task, idx) => (
          <div key={idx} className="task-item-ai">
            <div className="task-title">📌 {task.name}</div>
            <div className="task-info">
              <span className={`category-tag ${task.category}`}>{task.category}</span>
              <span className={`status-tag ${task.status}`}>{task.status}</span>
              <span className="due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="task-desc">{task.description}</div>
          </div>
        ))}
        {tasks.length > 5 && <div className="more-tasks">+{tasks.length - 5} more tasks...</div>}
      </div>
    );
  };

  const formatSummaryDisplay = (summary) => {
    if (!summary || typeof summary !== 'object') return null;
    
    const getSummaryStats = () => {
      const stats = [
        { label: 'Total Tasks', value: summary.total, icon: '📋', color: 'primary' },
        { label: 'Pending', value: summary.pending, icon: '⏳', color: 'pending' },
        { label: 'In Progress', value: summary.inProgress, icon: '🔄', color: 'progress' },
        { label: 'Completed', value: summary.completed, icon: '✅', color: 'completed' },
        { label: 'Urgent', value: summary.urgent, icon: '🔥', color: 'urgent' },
        { label: 'Overdue', value: summary.overdue, icon: '⚠️', color: 'overdue' }
      ];
      return stats;
    };

    return (
      <div className="summary-display">
        {getSummaryStats().map((stat, idx) => (
          <div key={idx} className={`summary-stat ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <h2>🤖 AI Task Assistant</h2>
        <p className="chat-subtitle">Smart task management powered by AI</p>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <p>{message.text.split('\n').map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}</p>
            {message.sender === 'ai' && message.data && (
              message.actionType === 'summary' 
                ? formatSummaryDisplay(message.data)
                : formatTaskDisplay(message.data)
            )}
            {message.timestamp && (
              <span className="message-time">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
        ))}
        {loading && (
          <div className="message ai loading">
            <p>
              <span className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about your tasks... or use Quick Query buttons below!"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !inputValue.trim()}>
          {loading ? '...' : 'Send'}
        </button>
      </form>

      <div className="quick-queries">
        <p><strong>Quick Queries:</strong></p>
        <button 
          onClick={() => handleQuickQuery('✨ New Tasks')}
          disabled={loading}
        >
          ✨ New Tasks
        </button>
        <button 
          onClick={() => handleQuickQuery('📅 Due Today')}
          disabled={loading}
        >
          📅 Due Today
        </button>
        <button 
          onClick={() => handleQuickQuery('🎯 Reschedule')}
          disabled={loading}
        >
          🎯 Reschedule
        </button>
        <button 
          onClick={() => handleQuickQuery('🔥 Urgent')}
          disabled={loading}
        >
          🔥 Urgent
        </button>
        <button 
          onClick={() => handleQuickQuery('✅ Completed')}
          disabled={loading}
        >
          ✅ Completed
        </button>
        <button 
          onClick={() => handleQuickQuery('📊 Summary')}
          disabled={loading}
        >
          📊 Summary
        </button>
      </div>
    </div>
  );
};

export default AIChat;
