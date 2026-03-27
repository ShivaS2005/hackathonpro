import React, { useState, useEffect } from 'react';
import TaskProgressTracker from './TaskProgressTracker';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('deadline');
  const [selectedTaskForProgress, setSelectedTaskForProgress] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch tasks assigned to this employee
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      // For employee, fetch tasks by employee ID
      let url = 'http://localhost:5000/api/tasks';
      
      if (user.userType === 'employee' && user._id) {
        // Get tasks assigned to this employee
        url = `http://localhost:5000/api/tasks/user/${user._id}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const sortTasks = (tasksToSort) => {
    const sorted = [...tasksToSort];
    if (sortBy === 'deadline') {
      return sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'category') {
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    }
    return sorted;
  };

  const markTaskComplete = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/complete`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        throw new Error('Failed to complete task');
      }

      // Update local state
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: 'completed' } : task
      ));
    } catch (err) {
      console.error('Error completing task:', err);
    }
  };

  const sortedTasks = sortTasks(tasks);

  return (
    <>
      {selectedTaskForProgress && (
        <TaskProgressTracker 
          taskId={selectedTaskForProgress._id}
          taskName={selectedTaskForProgress.name}
          onClose={() => setSelectedTaskForProgress(null)}
        />
      )}

      <div className="task-list-container">
        <div className="list-header">
          <h2>Your Tasks</h2>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="deadline">Sort by Deadline</option>
            <option value="priority">Sort by Priority</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>

        {loading && <p style={{textAlign: 'center', color: '#999'}}>Loading tasks...</p>}

        <div className="tasks-list">
          {tasks.length === 0 ? (
            <p className="empty-message">No tasks assigned yet!</p>
          ) : (
            sortedTasks.map((task) => (
              <div key={task._id} className="task-item">
                <div className="task-content">
                  <h3>{task.name}</h3>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span className="category">{task.category}</span>
                    <span className="deadline">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    <span className={`priority ${task.priority}`}>{task.priority}</span>
                    <span className={`status ${task.status}`}>{task.status}</span>
                  </div>
                </div>
                <div className="task-actions">
                  {task.status !== 'completed' && (
                    <button 
                      className="progress-btn"
                      onClick={() => setSelectedTaskForProgress(task)}
                      title="Track daily progress"
                    >
                      📅 Progress
                    </button>
                  )}
                  {task.status !== 'completed' && (
                    <button 
                      className="complete-btn"
                      onClick={() => markTaskComplete(task._id)}
                    >
                      ✓ Mark Complete
                    </button>
                  )}
                  {task.status === 'completed' && (
                    <button 
                      className="view-progress-btn"
                      onClick={() => setSelectedTaskForProgress(task)}
                      title="View completed task progress"
                    >
                      📊 View Progress
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default TaskList;
