import React, { useState } from 'react';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I\'m your AI assistant. I can help you with tasks like finding newly assigned tasks, listing tasks due today, or rescheduling priorities. What would you like to know?', sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
      setMessages([...messages, userMessage]);
      setInputValue('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: 'I understand. Let me help you with that query.',
          sender: 'ai'
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 500);
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <h2>AI Task Assistant</h2>
        <p className="chat-subtitle">Ask me about your tasks and priorities</p>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about your tasks... (e.g., 'Show me new tasks', 'What's due today?', 'Reschedule priorities')"
        />
        <button type="submit">Send</button>
      </form>

      <div className="quick-queries">
        <p>Quick queries:</p>
        <button onClick={() => setInputValue('Show me newly assigned tasks')}>New Tasks</button>
        <button onClick={() => setInputValue('What tasks are due today?')}>Due Today</button>
        <button onClick={() => setInputValue('Reschedule my priorities')}>Reschedule</button>
      </div>
    </div>
  );
};

export default AIChat;
