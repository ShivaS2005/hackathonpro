import React, { useState } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    employeeId: '',
    designation: ''
  });

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (newEmployee.name && newEmployee.employeeId && newEmployee.designation) {
      setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
      setNewEmployee({ name: '', employeeId: '', designation: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="employee-list-container">
      <div className="list-header">
        <h2>Employee Management</h2>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          + Add Employee
        </button>
      </div>

      {showAddForm && (
        <form className="add-employee-form" onSubmit={handleAddEmployee}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Employee Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Employee ID"
              value={newEmployee.employeeId}
              onChange={(e) => setNewEmployee({...newEmployee, employeeId: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Designation"
              value={newEmployee.designation}
              onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Add</button>
          <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
        </form>
      )}

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.employeeId}</td>
                  <td>{emp.designation}</td>
                  <td>
                    <button className="action-btn">Edit</button>
                    <button className="action-btn delete">Delete</button>
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
