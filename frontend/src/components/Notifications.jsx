import React, { useState } from 'react';

const Notifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'task_completed', message: 'Task "Design Homepage" has been completed', time: '2 hours ago' },
    { id: 2, type: 'deadline_missed', message: 'Task "API Development" deadline missed', time: '1 day ago' }
  ]);

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="notifications-container">
      <button 
        className="notification-bell"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        🔔
        {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
      </button>

      {showNotifications && (
        <div className="notifications-dropdown">
          <h3>Notifications</h3>
          {notifications.length === 0 ? (
            <p className="empty-notifications">No new notifications</p>
          ) : (
            <div className="notifications-list">
              {notifications.map((notif) => (
                <div key={notif.id} className={`notification-item ${notif.type}`}>
                  <p>{notif.message}</p>
                  <span className="time">{notif.time}</span>
                  <button 
                    className="close-btn"
                    onClick={() => removeNotification(notif.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
