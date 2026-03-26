import React, { useState, useEffect } from 'react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState('deadline');

  useEffect(() => {
    // Fetch tasks from API and sort by deadline/category
    // Task list will be shown in prioritized order
  }, [sortBy]);

  const markTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
  };

  return (
    <div className="task-list-container">
      <div className="list-header">
        <h2>Your Tasks</h2>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="deadline">Sort by Deadline</option>
          <option value="priority">Sort by Priority</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p className="empty-message">No tasks assigned yet!</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-item">
              <div className="task-content">
                <h3>{task.name}</h3>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span className="category">{task.category}</span>
                  <span className="deadline">Due: {task.dueDate}</span>
                </div>
              </div>
              <button 
                className="complete-btn"
                onClick={() => markTaskComplete(task.id)}
              >
                Mark Complete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
