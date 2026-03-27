import React, { useState, useEffect } from 'react';
import '../styles/taskProgress.css';

const TaskProgressTracker = ({ taskId, taskName, onClose, isEmployer = false }) => {
  const [progressEntries, setProgressEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Generate calendar
  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  // Fetch progress entries
  useEffect(() => {
    fetchProgressEntries();
  }, [taskId]);

  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysCount = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysCount; i++) {
      days.push(i);
    }

    setDaysInMonth(days);
  };

  const fetchProgressEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/progress`);
      if (!response.ok) {
        throw new Error('Failed to fetch progress entries');
      }
      const data = await response.json();
      setProgressEntries(data.progressEntries || []);
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError('Failed to load progress entries');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const date = String(day).padStart(2, '0');
    const formattedDate = `${year}-${month}-${date}`;
    setSelectedDate(formattedDate);
    
    // Check if there's already progress for this date
    const existingProgress = progressEntries.find(p => 
      new Date(p.progressDate).toISOString().split('T')[0] === formattedDate
    );
    
    if (existingProgress) {
      setProgressPercentage(existingProgress.progressPercentage);
      setDescription(existingProgress.progressDescription);
      setNotes(existingProgress.notes || '');
    } else {
      setProgressPercentage(0);
      setDescription('');
      setNotes('');
    }
    
    setShowForm(true);
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setError('Please enter a progress description');
      return;
    }

    if (progressPercentage < 0 || progressPercentage > 100) {
      setError('Progress percentage must be between 0 and 100');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: user.employeeId || user._id,
          progressDate: new Date(selectedDate),
          progressPercentage: parseInt(progressPercentage),
          progressDescription: description,
          notes: notes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add progress');
      }

      const data = await response.json();
      setSuccess('Progress added successfully!');
      
      // Refresh progress entries
      setTimeout(() => {
        fetchProgressEntries();
        setShowForm(false);
        setDescription('');
        setNotes('');
        setProgressPercentage(0);
        setSuccess('');
      }, 1500);
    } catch (err) {
      console.error('Error adding progress:', err);
      setError('Failed to add progress');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/progress-report`);
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      
      // Download the PDF
      window.open(`http://localhost:5000/api/tasks/download-report/${data.fileName}`, '_blank');
      setSuccess('Report downloaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const hasProgressOnDay = (day) => {
    if (!day) return false;
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const date = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${date}`;
    return progressEntries.some(p => 
      new Date(p.progressDate).toISOString().split('T')[0] === dateStr
    );
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="task-progress-tracker">
      <div className="tracker-header">
        <h2>Task Progress: {taskName}</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="tracker-content">
        {/* Calendar Section */}
        <div className="calendar-section">
          <div className="calendar-controls">
            <button onClick={handlePrevMonth} className="nav-btn">←</button>
            <h3>{monthName}</h3>
            <button onClick={handleNextMonth} className="nav-btn">→</button>
          </div>

          <div className="calendar">
            <div className="calendar-weekdays">
              <div className="weekday">Sun</div>
              <div className="weekday">Mon</div>
              <div className="weekday">Tue</div>
              <div className="weekday">Wed</div>
              <div className="weekday">Thu</div>
              <div className="weekday">Fri</div>
              <div className="weekday">Sat</div>
            </div>

            <div className="calendar-days">
              {daysInMonth.map((day, index) => {
                const dateStr = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
                const isToday = dateStr === today;
                const hasProgress = hasProgressOnDay(day);
                const isSelected = dateStr === selectedDate;

                return (
                  <div
                    key={index}
                    className={`calendar-day ${day ? 'active' : ''} ${isToday ? 'today' : ''} ${hasProgress ? 'has-progress' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDateClick(day)}
                  >
                    {day}
                    {hasProgress && <div className="progress-indicator">✓</div>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-color today"></div>
              <span>Today</span>
            </div>
            <div className="legend-item">
              <div className="legend-color has-progress"></div>
              <span>Has Progress</span>
            </div>
          </div>
        </div>

        {/* Progress Form Section */}
        <div className="form-section">
          {showForm && (
            <form onSubmit={handleAddProgress} className="progress-form">
              <h3>Add Progress for {selectedDate}</h3>
              
              <div className="form-group">
                <label htmlFor="percentage">Progress Percentage (%)</label>
                <div className="percentage-input">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressPercentage}
                    onChange={(e) => setProgressPercentage(e.target.value)}
                    className="progress-slider"
                  />
                  <span className="percentage-display">{progressPercentage}%</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Progress Description *</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What progress was made today?"
                  required
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes or challenges?"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? 'Saving...' : 'Save Progress'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
            </form>
          )}

          {!showForm && (
            <div className="progress-summary">
              <h3>Select a date to add progress</h3>
              <p>Click on any date in the calendar to enter or view progress</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress History & Report Section */}
      <div className="progress-history">
        <div className="history-header">
          <h3>Progress History</h3>
          <button 
            className="generate-report-btn"
            onClick={handleGenerateReport}
            disabled={loading || progressEntries.length === 0}
          >
            📥 Download PDF Report
          </button>
        </div>

        {loading && <p className="loading-text">Loading...</p>}

        {progressEntries.length === 0 ? (
          <p className="empty-text">No progress entries yet. Start by adding progress for today!</p>
        ) : (
          <div className="entries-list">
            {progressEntries.map((entry) => (
              <div key={entry._id} className="progress-entry">
                <div className="entry-header">
                  <span className="entry-date">
                    {new Date(entry.progressDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="entry-time">
                    {new Date(entry.createdAt).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="entry-progress">
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${entry.progressPercentage}%` }}></div>
                  </div>
                  <span className="progress-text">{entry.progressPercentage}%</span>
                </div>
                <p className="entry-description">{entry.progressDescription}</p>
                {entry.notes && <p className="entry-notes"><strong>Notes:</strong> {entry.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <div className="global-error">{error}</div>}
    </div>
  );
};

export default TaskProgressTracker;
