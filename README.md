# AI-Powered Employee Task Manager

A comprehensive task management system with AI integration designed to improve productivity and task tracking within organizations.

## Features

### For Employers:
- **Employee Management**: Add, edit, and manage employee information
- **Task Assignment**: Assign tasks with detailed descriptions, deadlines, and categories
- **Task Monitoring**: Track task status and completion
- **PDF Reports**: Generate comprehensive reports for individual tasks
- **Notifications**: Receive alerts on task completions and missed deadlines

### For Employees:
- **Task Dashboard**: View all assigned tasks in prioritized order
- **Task Management**: Add personal tasks to the system
- **Notifications**: Get alerts about upcoming deadlines and task updates
- **AI Assistant**: Interactive chatbot for task queries and scheduling

### AI Features:
- Identify newly assigned tasks
- List tasks due on the current day
- Reschedule priorities based on urgency
- Intelligent task recommendations

## Tech Stack

### Frontend:
- React 19
- Vite
- CSS3 with custom color scheme

### Backend:
- Node.js
- Express.js
- CORS enabled
- Environment configuration with dotenv

## Color Scheme

- Primary Green: #9AB17A
- Light Green: #C3CC9B
- Cream: #E4DFB5
- Light Cream: #FBE8CE

## Getting Started

### Prerequisites:
- Node.js (v14 or higher)
- npm or yarn

### Installation:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackathonpro
   ```

2. **Install dependencies**
   
   Backend:
   ```bash
   cd backend
   npm install
   ```
   
   Frontend:
   ```bash
   cd frontend
   npm install
   ```

3. **Setup environment variables**
   
   Backend (.env):
   ```
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=mongodb://localhost:27017/employee-task-manager
   JWT_SECRET=your_jwt_secret_key_here
   ```
   
   Frontend (.env):
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Employee Task Manager
   ```

### Running the Application:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Structure

```
hackathonpro/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── employees.js
│   │   ├── tasks.js
│   │   ├── notifications.js
│   │   └── aiChat.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── taskController.js
│   │   ├── notificationController.js
│   │   └── aiChatController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── EmployerDashboard.jsx
│   │   │   └── EmployeeDashboard.jsx
│   │   ├── components/
│   │   │   ├── EmployeeList.jsx
│   │   │   ├── TaskManager.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── AIChat.jsx
│   │   │   └── Notifications.jsx
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── auth.css
│   │   │   ├── dashboard.css
│   │   │   └── components.css
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
└── .gitignore
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get specific employee
- `POST /api/employees` - Add new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/user/:userId` - Get user tasks
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/complete` - Mark task complete
- `GET /api/tasks/:id/report` - Generate PDF report
- `DELETE /api/tasks/:id` - Delete task

### Notifications
- `GET /api/notifications/:userId` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications` - Send notification

### AI Chat
- `POST /api/ai-chat/chat` - Process query
- `GET /api/ai-chat/:userId/new-tasks` - Get new tasks
- `GET /api/ai-chat/:userId/tasks-today` - Get tasks due today
- `PATCH /api/ai-chat/:userId/reschedule` - Reschedule priorities

## Future Enhancements

- Database integration (MongoDB)
- JWT authentication
- Real-time notifications (WebSocket/Socket.io)
- AI integration (NLP for chatbot)
- PDF report generation
- Email notifications
- Task reminders
- Advanced analytics dashboard

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

MIT License
