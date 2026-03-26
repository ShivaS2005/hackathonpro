import React, { useState } from 'react';
import '../styles/dashboard.css';
import EmployeeList from '../components/EmployeeList';
import TaskManager from '../components/TaskManager';
import Notifications from '../components/Notifications';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Employer Dashboard</h1>
        <Notifications />
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
        <button 
          className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'employees' && <EmployeeList />}
        {activeTab === 'tasks' && <TaskManager />}
        {activeTab === 'reports' && <ReportsTab />}
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

const ReportsTab = () => (
  <div className="reports-tab">
    <h2>Task Reports</h2>
    <p>Generate and view comprehensive PDF reports for all tasks and their completion status.</p>
  </div>
);

export default EmployerDashboard;
