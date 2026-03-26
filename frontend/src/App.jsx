import React, { useState } from 'react';
import './styles/globals.css';
import './styles/components.css';
import LoginPage from './pages/LoginPage';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userType, setUserType] = useState(null);

  const handleLogin = (type) => {
    setUserType(type);
    setCurrentPage(type === 'employer' ? 'employer-dashboard' : 'employee-dashboard');
  };

  const handleLogout = () => {
    setCurrentPage('login');
    setUserType(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
  };

  return (
    <div className="App">
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentPage === 'employer-dashboard' && <EmployerDashboard onLogout={handleLogout} />}
      {currentPage === 'employee-dashboard' && <EmployeeDashboard onLogout={handleLogout} />}
    </div>
  );
}

export default App;
