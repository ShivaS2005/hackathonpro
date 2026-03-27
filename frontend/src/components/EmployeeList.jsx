import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    employeeId: '',
    designation: '',
    email: '',
    phone: ''
  });

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
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
      const response = await fetch(`${API_BASE_URL}/api/employees?employerId=${user._id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      
      const data = await response.json();
      setEmployees(data.employees || []);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    
    if (!newEmployee.name || !newEmployee.employeeId || !newEmployee.designation) {
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
      
      const response = await fetch(`${API_BASE_URL}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEmployee,
          employerId: user._id,
          userId: user._id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add employee');
      }

      const data = await response.json();
      setEmployees([...employees, data.employee]);
      setNewEmployee({ name: '', employeeId: '', designation: '', email: '', phone: '' });
      setShowAddForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Error adding employee:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      setEmployees(employees.filter(emp => emp._id !== id));
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Error deleting employee:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-list-container">
      <div className="list-header">
        <h2>Employee Management</h2>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={loading}
        >
          + Add Employee
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
        <form className="add-employee-form" onSubmit={handleAddEmployee}>
          <div className="form-group">
            <label>Employee Name *</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Employee ID *</label>
            <input
              type="text"
              placeholder="e.g., EMP001"
              value={newEmployee.employeeId}
              onChange={(e) => setNewEmployee({...newEmployee, employeeId: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Designation *</label>
            <input
              type="text"
              placeholder="e.g., Developer, Manager"
              value={newEmployee.designation}
              onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Optional email address"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              placeholder="Optional phone number"
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
          <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)} disabled={loading}>
            Cancel
          </button>
        </form>
      )}

      {loading && <p style={{textAlign: 'center', color: '#999'}}>Loading...</p>}

      <div className="employees-table">
        {employees.length === 0 ? (
          <p className="empty-message">No employees added yet. Add one to get started!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Designation</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.name}</td>
                  <td>{emp.employeeId}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.email || 'N/A'}</td>
                  <td>
                    <button className="action-btn delete" onClick={() => handleDeleteEmployee(emp._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
