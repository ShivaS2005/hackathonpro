import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    dueDate: '',
    category: 'medium',
    assignedTo: ''
  });

  // Fetch tasks and employees on component mount
  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/tasks`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data.tasks || []);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.error('User not logged in');
        setError('User not logged in');
        return;
      }
      const user = JSON.parse(userStr);
      if (!user._id) {
        console.error('User ID not found');
        setError('User ID not found');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/employees?employerId=${user._id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      
      const data = await response.json();
      console.log('Employees fetched:', data.employees);
      setEmployees(data.employees || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.name || !newTask.description || !newTask.dueDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError('User not logged in. Please login first.');
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      if (!user._id) {
        setError('User ID not found. Please login again.');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTask.name,
          description: newTask.description,
          dueDate: newTask.dueDate,
          category: newTask.category,
          assignedTo: newTask.assignedTo || null,
          assignedBy: user._id,
          status: 'pending',
          priority: 'medium'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }

      const data = await response.json();
      setTasks([...tasks, data.task]);
      setNewTask({
        name: '',
        description: '',
        dueDate: '',
        category: 'medium',
        assignedTo: ''
      });
      setShowAddForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Error adding task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(task => task._id !== id));
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (task, assignedEmployee) => {
    const reportWindow = window.open('', '', 'width=800,height=600');
    const reportDate = new Date().toLocaleDateString();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Task Report - ${task.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            border-bottom: 3px solid #9AB17A;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #9AB17A;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          .section {
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-left: 4px solid #9AB17A;
          }
          .section h2 {
            color: #9AB17A;
            margin-top: 0;
            font-size: 18px;
          }
          .detail-row {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: bold;
            width: 150px;
            color: #555;
          }
          .detail-value {
            flex: 1;
            color: #333;
          }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
          }
          .badge-urgent {
            background-color: #ffebee;
            color: #c62828;
          }
          .badge-medium {
            background-color: #fff3e0;
            color: #e65100;
          }
          .badge-least {
            background-color: #e8f5e9;
            color: #2e7d32;
          }
          .badge-pending {
            background-color: #e3f2fd;
            color: #1565c0;
          }
          .badge-in-progress {
            background-color: #fff3e0;
            color: #e65100;
          }
          .badge-completed {
            background-color: #e8f5e9;
            color: #2e7d32;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          .print-info {
            text-align: right;
            font-size: 12px;
            color: #999;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="print-info">
          Generated on: ${reportDate}
        </div>
        
        <div class="header">
          <h1>📋 Task Report</h1>
          <p>Task Name: <strong>${task.name}</strong></p>
        </div>

        <div class="section">
          <h2>📝 Task Description</h2>
          <div class="detail-row">
            <div class="detail-label">Description:</div>
            <div class="detail-value">${task.description}</div>
          </div>
        </div>

        <div class="section">
          <h2>👤 Assignment Details</h2>
          <div class="detail-row">
            <div class="detail-label">Assigned To:</div>
            <div class="detail-value">
              ${assignedEmployee ? `${assignedEmployee.employeeId} - ${assignedEmployee.name}` : 'Unassigned'}
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Assigned By:</div>
            <div class="detail-value">${task.assignedBy?.name || 'N/A'}</div>
          </div>
        </div>

        <div class="section">
          <h2>📅 Timeline</h2>
          <div class="detail-row">
            <div class="detail-label">Created:</div>
            <div class="detail-value">${new Date(task.createdAt).toLocaleDateString()} ${new Date(task.createdAt).toLocaleTimeString()}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Due Date:</div>
            <div class="detail-value">${new Date(task.dueDate).toLocaleDateString()}</div>
          </div>
          ${task.completedAt ? `
          <div class="detail-row">
            <div class="detail-label">Completed:</div>
            <div class="detail-value">${new Date(task.completedAt).toLocaleDateString()} ${new Date(task.completedAt).toLocaleTimeString()}</div>
          </div>
          ` : ''}
        </div>

        <div class="section">
          <h2>⚙️ Task Properties</h2>
          <div class="detail-row">
            <div class="detail-label">Category:</div>
            <div class="detail-value">
              <span class="badge badge-${task.category}">${task.category.charAt(0).toUpperCase() + task.category.slice(1)}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Status:</div>
            <div class="detail-value">
              <span class="badge badge-${task.status}">${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Priority:</div>
            <div class="detail-value">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</div>
          </div>
        </div>

        ${task.estimatedHours || task.actualHours ? `
        <div class="section">
          <h2>⏱️ Time Tracking</h2>
          ${task.estimatedHours ? `
          <div class="detail-row">
            <div class="detail-label">Estimated Hours:</div>
            <div class="detail-value">${task.estimatedHours} hours</div>
          </div>
          ` : ''}
          ${task.actualHours ? `
          <div class="detail-row">
            <div class="detail-label">Actual Hours:</div>
            <div class="detail-value">${task.actualHours} hours</div>
          </div>
          ` : ''}
        </div>
        ` : ''}

        <div class="footer">
          <p>This is an auto-generated report from the Task Management System</p>
          <p>© 2026 Employee Task Manager. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
    
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
    
    // Auto print/download after a short delay
    setTimeout(() => {
      reportWindow.print();
    }, 250);
  };

  const downloadProgressReport = async (taskId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/progress-report`);
      
      if (!response.ok) {
        throw new Error('Failed to generate progress report');
      }

      const data = await response.json();
      
      // Download the PDF
      window.open(`${API_BASE_URL}/api/tasks/download-report/${data.fileName}`, '_blank');
    } catch (err) {
      setError('Failed to download progress report: ' + err.message);
      console.error('Error downloading progress report:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-manager-container">
      <div className="list-header">
        <h2>Task Management</h2>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={loading}
        >
          + Assign Task
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          borderLeft: '4px solid #c62828'
        }}>
          {error}
        </div>
      )}

      {showAddForm && (
        <form className="add-task-form" onSubmit={handleAddTask}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Task Name"
              value={newTask.name}
              onChange={(e) => setNewTask({...newTask, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <select 
              value={newTask.category}
              onChange={(e) => setNewTask({...newTask, category: e.target.value})}
            >
              <option value="urgent">Urgent</option>
              <option value="medium">Medium</option>
              <option value="least">Least Important</option>
            </select>
          </div>
          <div className="form-group">
            <label>Assign Employee (optional)</label>
            <select
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
            >
              <option value="">-- Select an Employee --</option>
              {employees && employees.length > 0 ? (
                employees.map(emp => (
                  <option key={emp._id} value={emp.employeeId}>
                    {emp.name ? `${emp.name} (${emp.employeeId})` : emp.employeeId}
                  </option>
                ))
              ) : (
                <option disabled>No employees available</option>
              )}
            </select>
            {employees.length === 0 && (
              <small style={{color: '#e74c3c'}}>⚠️ Please add employees first</small>
            )}
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Task'}
          </button>
          <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)} disabled={loading}>
            Cancel
          </button>
        </form>
      )}

      {loading && <p style={{textAlign: 'center', color: '#999'}}>Loading...</p>}

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <p className="empty-message">No tasks created yet. Assign one to get started!</p>
        ) : (
          tasks.map((task) => {
            const assignedEmployee = employees.find(emp => emp.employeeId === task.assignedTo);
            return (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <h3>{task.name}</h3>
                  <span className={`category-badge ${task.category}`}>{task.category}</span>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-details">
                  <span className="due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  <span className="assigned-to">
                    Assigned to: {assignedEmployee ? `${assignedEmployee.employeeId} (${assignedEmployee.name})` : 'Unassigned'}
                  </span>
                  <span className={`status ${task.status}`}>{task.status}</span>
                </div>
                <div className="task-actions">
                  <button className="action-btn report" onClick={() => generatePDF(task, assignedEmployee)}>
                    📄 Task Report
                  </button>
                  <button className="action-btn progress" onClick={() => downloadProgressReport(task._id)}>
                    📊 Progress Report
                  </button>
                  <button className="action-btn delete" onClick={() => handleDeleteTask(task._id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TaskManager;
