import React, { useState } from 'react';
import '../styles/dashboard.css';
import EmployeeList from '../components/EmployeeList';
import TaskManager from '../components/TaskManager';
import Notifications from '../components/Notifications';

const EmployerDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Employer Dashboard</h1>
          <p className="user-info">Welcome, {user.name || 'User'}</p>
        </div>
        <div className="header-right">
          <Notifications />
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          Employees
        </button>
        <button 
          className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Task Management
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'employees' && <EmployeeList />}
        {activeTab === 'tasks' && <TaskManager />}
      </main>
    </div>
  );
};

const OverviewTab = () => (
  <div className="overview-tab">
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Employees</h3>
        <p className="stat-number">0</p>
      </div>
      <div className="stat-card">
        <h3>Active Tasks</h3>
        <p className="stat-number">0</p>
      </div>
      <div className="stat-card">
        <h3>Completed Tasks</h3>
        <p className="stat-number">0</p>
      </div>
      <div className="stat-card">
        <h3>Overdue Tasks</h3>
        <p className="stat-number">0</p>
      </div>
    </div>
  </div>
);

export default EmployerDashboard;
