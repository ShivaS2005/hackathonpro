# MongoDB Database Schema Documentation

## Overview
Complete database schema structure for the AI-Powered Employee Task Manager system.

---

## Collections

### 1. **Users**
Stores user account information for both employers and employees.

```
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars),
  userType: String (enum: "employer", "employee"),
  profileImage: String (optional),
  phone: String (optional),
  department: String (optional),
  isActive: Boolean (default: true),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

---

### 2. **Employees**
Stores detailed employee information and performance metrics.

```
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  name: String (required),
  employeeId: String (required, unique),
  designation: String (required),
  email: String (required, lowercase),
  phone: String (optional),
  department: String (optional),
  employerId: ObjectId (ref: User, required),
  dateOfJoining: Date (default: now),
  performanceScore: Number (default: 0),
  totalTasksCompleted: Number (default: 0),
  totalTasksPending: Number (default: 0),
  totalTasksOverdue: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

---

### 3. **Tasks**
Stores all task information with comprehensive details.

```
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  dueDate: Date (required),
  category: String (enum: "urgent", "medium", "least", default: "medium"),
  assignedTo: ObjectId (ref: Employee),
  assignedBy: ObjectId (ref: User, required),
  status: String (enum: "pending", "in-progress", "completed"),
  priority: String (enum: "low", "medium", "high", default: "medium"),
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: Date
  }],
  comments: [{
    userId: ObjectId (ref: User),
    comment: String,
    createdAt: Date
  }],
  completedAt: Date (optional),
  completedBy: ObjectId (ref: Employee),
  estimatedHours: Number (optional),
  actualHours: Number (optional),
  isOverdue: Boolean (default: false),
  reminderSent: Boolean (default: false),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

---

### 4. **Notifications**
Stores notification records for task updates and alerts.

```
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  type: String (enum: "task_completed", "deadline_missed", "task_assigned", 
                     "task_updated", "task_overdue", "new_employee"),
  title: String (required),
  message: String (required),
  taskId: ObjectId (ref: Task, optional),
  employeeId: ObjectId (ref: Employee, optional),
  read: Boolean (default: false),
  readAt: Date (optional),
  actionUrl: String (optional),
  createdAt: Date (default: now)
}
```

---

### 5. **Reports**
Stores generated task and performance reports.

```
{
  _id: ObjectId,
  taskId: ObjectId (ref: Task, required),
  generatedBy: ObjectId (ref: User, required),
  reportType: String (enum: "task_detail", "employee_performance", 
                           "completion_rate", "overdue_tasks"),
  reportData: {
    taskName: String,
    description: String,
    assignedTo: String,
    status: String,
    category: String,
    priority: String,
    dueDate: Date,
    completedAt: Date,
    completionPercentage: Number,
    attachments: [String]
  },
  pdfUrl: String (optional),
  generatedAt: Date (default: now)
}
```

---

### 6. **AIChat**
Stores AI chatbot conversation history.

```
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  userMessage: String (required),
  aiResponse: String (required),
  queryType: String (enum: "new_tasks", "tasks_today", "reschedule", "general_query"),
  relatedTasks: [ObjectId] (ref: Task),
  helpful: Boolean (optional),
  createdAt: Date (default: now)
}
```

---

### 7. **Performance**
Tracks monthly performance metrics for each employee.

```
{
  _id: ObjectId,
  employeeId: ObjectId (ref: Employee, required),
  month: Date (required),
  totalTasksAssigned: Number (default: 0),
  totalTasksCompleted: Number (default: 0),
  totalTasksOverdue: Number (default: 0),
  completionRate: Number (default: 0),
  averageCompletionTime: Number (default: 0),
  tasksCategoryWise: {
    urgent: Number (default: 0),
    medium: Number (default: 0),
    least: Number (default: 0)
  },
  performanceScore: Number (default: 0),
  remarks: String (optional),
  evaluatedBy: ObjectId (ref: User, optional),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

---

### 8. **DeadlineReminder**
Manages task deadline reminders.

```
{
  _id: ObjectId,
  taskId: ObjectId (ref: Task, required),
  employeeId: ObjectId (ref: Employee, required),
  reminderDate: Date (required),
  reminderType: String (enum: "24_hours", "12_hours", "6_hours", "1_hour", "overdue"),
  sent: Boolean (default: false),
  sentAt: Date (optional),
  acknowledged: Boolean (default: false),
  acknowledgedAt: Date (optional),
  createdAt: Date (default: now)
}
```

---

### 9. **Departments**
Stores department information.

```
{
  _id: ObjectId,
  name: String (required, unique),
  description: String (optional),
  manager: ObjectId (ref: User, optional),
  employeeCount: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

---

### 10. **AuditLog**
Maintains audit trail of all system actions.

```
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  action: String (required),
  entity: String (enum: "user", "employee", "task", "notification", "report"),
  entityId: ObjectId (required),
  changes: {
    before: Mixed,
    after: Mixed
  },
  ipAddress: String (optional),
  userAgent: String (optional),
  status: String (enum: "success", "failure", default: "success"),
  createdAt: Date (default: now)
}
```

---

## Relationships

```
User (1) ──→ (Many) Employee
User (1) ──→ (Many) Task (assignedBy)
User (1) ──→ (Many) Notification
User (1) ──→ (Many) AIChat
User (1) ──→ (Many) AuditLog

Employee (1) ──→ (Many) Task (assignedTo)
Employee (1) ──→ (Many) Performance
Employee (1) ──→ (Many) DeadlineReminder

Task (1) ──→ (Many) Notification
Task (1) ──→ (Many) Report
Task (1) ──→ (Many) DeadlineReminder
Task (1) ──→ (Many) Comments

Department (1) ──→ (Many) Employee
```

---

## Indexes (Recommended)

```javascript
// Users Collection
db.users.createIndex({ email: 1 }, { unique: true })

// Employees Collection
db.employees.createIndex({ employeeId: 1 }, { unique: true })
db.employees.createIndex({ employerId: 1 })
db.employees.createIndex({ userId: 1 })

// Tasks Collection
db.tasks.createIndex({ assignedTo: 1 })
db.tasks.createIndex({ assignedBy: 1 })
db.tasks.createIndex({ dueDate: 1 })
db.tasks.createIndex({ status: 1 })

// Notifications Collection
db.notifications.createIndex({ userId: 1 })
db.notifications.createIndex({ read: 1 })
db.notifications.createIndex({ createdAt: -1 })

// Performance Collection
db.performance.createIndex({ employeeId: 1 })
db.performance.createIndex({ month: 1 })

// AIChat Collection
db.aichats.createIndex({ userId: 1 })
db.aichats.createIndex({ createdAt: -1 })

// AuditLog Collection
db.auditlogs.createIndex({ userId: 1 })
db.auditlogs.createIndex({ createdAt: -1 })
```

---

## Data Validation Rules

1. **Email**: Must be valid format and unique per user
2. **Password**: Minimum 6 characters (should be hashed with bcrypt)
3. **DueDate**: Must be future date for new tasks
4. **Status**: Can only be one of defined enum values
5. **Performance Score**: Range 0-100
6. **Completion Rate**: Range 0-100
7. **Phone**: Optional but must be valid format if provided

---

## Best Practices

1. Always use proper validation before saving documents
2. Use transactions for multi-document operations
3. Index frequently queried fields
4. Implement proper error handling
5. Maintain referential integrity
6. Regular backup of MongoDB database
7. Use TTL indexes for auto-cleanup of old logs
8. Implement soft deletes using isActive flag
9. Always hash passwords before storing
10. Log all critical operations in AuditLog

