import React, { useState } from 'react';
import '../styles/dashboard.css';
import TaskList from '../components/TaskList';
import AIChat from '../components/AIChat';
import Notifications from '../components/Notifications';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Employee Dashboard</h1>
        <Notifications />
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          My Tasks
        </button>
        <button 
          className={`nav-btn ${activeTab === 'add-task' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-task')}
        >
          Add Task
        </button>
        <button 
          className={`nav-btn ${activeTab === 'ai-chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-chat')}
        >
          AI Assistant
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'tasks' && <TaskList />}
        {activeTab === 'add-task' && <AddTaskForm />}
        {activeTab === 'ai-chat' && <AIChat />}
      </main>
    </div>
  );
};

const AddTaskForm = () => (
  <div className="add-task-form">
    <h2>Add New Task</h2>
    <form>
      <div className="form-group">
        <label>Task Name</label>
        <input type="text" placeholder="Enter task name" />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea placeholder="Task description"></textarea>
      </div>
      <div className="form-group">
        <label>Due Date</label>
        <input type="date" />
      </div>
      <div className="form-group">
        <label>Priority</label>
        <select>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
      <button type="submit" className="submit-btn">Add Task</button>
    </form>
  </div>
);

export default EmployeeDashboard;
