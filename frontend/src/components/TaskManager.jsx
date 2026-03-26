import React, { useState } from 'react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    dueDate: '',
    category: 'medium',
    assignedTo: ''
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.name && newTask.description && newTask.dueDate) {
      setTasks([...tasks, { ...newTask, id: Date.now(), status: 'pending' }]);
      setNewTask({
        name: '',
        description: '',
        dueDate: '',
        category: 'medium',
        assignedTo: ''
      });
      setShowAddForm(false);
    }
  };

  const downloadPDF = (taskId) => {
    // PDF generation logic here
    console.log('Generating PDF for task:', taskId);
  };

  return (
    <div className="task-manager-container">
      <div className="list-header">
        <h2>Task Management</h2>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          + Assign Task
        </button>
      </div>

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
            <input
              type="text"
              placeholder="Assign to Employee ID"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
            />
          </div>
          <button type="submit" className="submit-btn">Create Task</button>
          <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
        </form>
      )}

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <p className="empty-message">No tasks created yet. Assign one to get started!</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3>{task.name}</h3>
                <span className={`category-badge ${task.category}`}>{task.category}</span>
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-details">
                <span className="due-date">Due: {task.dueDate}</span>
                <span className="assigned-to">Assigned: {task.assignedTo}</span>
                <span className={`status ${task.status}`}>{task.status}</span>
              </div>
              <div className="task-actions">
                <button className="action-btn">Edit</button>
                <button className="action-btn" onClick={() => downloadPDF(task.id)}>Download PDF</button>
                <button className="action-btn delete">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;
