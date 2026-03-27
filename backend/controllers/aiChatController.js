const Task = require('../models/Task');
const Employee = require('../models/Employee');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI with better error handling
let model = null;

try {
  if (process.env.GOOGLE_API_KEY) {
    console.log("🔑 Google API Key found, initializing Gemini...");
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("✅ Gemini AI initialized successfully with gemini-1.5-flash");
  } else {
    console.warn("⚠️ GOOGLE_API_KEY not found in environment variables");
  }
} catch (error) {
  console.error("❌ Failed to initialize Gemini AI:", error.message);
}

// Process user queries with real AI
const processQuery = async (req, res) => {
  try {
    const { userId, query, userType } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: "Missing query" });
    }

    let response = "";
    let actionType = "general";
    let data = null;
    let usedFallback = false;
    const lowerQuery = query.toLowerCase();
    const trimmedQuery = query.trim();

    try {
      // ===== QUICK QUERY BUTTONS - FETCH REAL DATA =====
      
      // NEW TASKS
      if (lowerQuery.includes("new task") || trimmedQuery === "✨ New Tasks") {
        console.log("📋 Fetching NEW TASKS data...");
        actionType = "new_tasks";
        const result = await getNewTasksData(userId, userType);
        data = result.tasks;
        
        if (result.tasks && result.tasks.length > 0) {
          response = `✨ **You have ${result.tasks.length} new task(s)!**\n\n`;
          result.tasks.forEach((task, index) => {
            const dueDate = new Date(task.dueDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });
            response += `${index + 1}. **${task.name}**\n   📅 Due: ${dueDate}\n   ${task.description ? '📝 ' + task.description : ''}\n\n`;
          });
          response += `**What to do:** Review each task, check deadlines, and start with the highest priority! 🚀`;
        } else {
          response = `✨ **Great news!** You don't have any new tasks right now. Keep up the amazing work! 🎉`;
        }
        usedFallback = true;
      }
      
      // DUE TODAY
      else if (lowerQuery.includes("due today") || trimmedQuery === "📅 Due Today") {
        console.log("📅 Fetching DUE TODAY data...");
        actionType = "tasks_today";
        const result = await getTasksDueTodayData(userId, userType);
        data = result.tasks;
        
        if (result.tasks && result.tasks.length > 0) {
          response = `📅 **${result.tasks.length} task(s) due TODAY!**\n\n`;
          result.tasks.forEach((task, index) => {
            const dueDate = new Date(task.dueDate).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            const status = task.status === 'completed' ? '✅ Completed' : '🔄 ' + (task.status || 'Pending');
            response += `${index + 1}. **${task.name}**\n   ⏰ Due: ${dueDate}\n   Status: ${status}\n\n`;
          });
          response += `⚡ **Action:** Focus on these tasks to stay on track! Complete them before EOD. 💪`;
        } else {
          response = `📅 **No tasks due today!** You're all caught up. Great job! 🎉`;
        }
        usedFallback = true;
      }
      
      // COMPLETED
      else if (lowerQuery.includes("completed") || lowerQuery.includes("done") || trimmedQuery === "✅ Completed") {
        console.log("✅ Fetching COMPLETED tasks data...");
        actionType = "completed_tasks";
        const result = await getCompletedTasks(userId, userType);
        data = result.tasks;
        
        if (result.tasks && result.tasks.length > 0) {
          response = `✅ **You've completed ${result.tasks.length} task(s)!** Amazing work! 🎉\n\n`;
          result.tasks.forEach((task, index) => {
            const completedDate = task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'N/A';
            response += `${index + 1}. ✓ **${task.name}**\n   🏁 Completed: ${completedDate}\n\n`;
          });
          response += `🌟 **Keep this momentum!** You're making excellent progress! Keep crushing your goals! 🚀`;
        } else {
          response = `✅ **No completed tasks yet.** Start working on your tasks and mark them complete! 💪`;
        }
        usedFallback = true;
      }
      
      // SUMMARY
      else if (lowerQuery.includes("summary") || lowerQuery.includes("overview") || trimmedQuery === "📊 Summary") {
        console.log("📊 Fetching SUMMARY data...");
        actionType = "summary";
        const result = await getTaskSummary(userId, userType);
        data = result.summary;
        
        if (result.summary) {
          const summary = result.summary;
          response = `📊 **Your Task Summary**\n\n`;
          response += `📌 **Total Tasks:** ${summary.totalTasks || 0}\n`;
          response += `🔄 **In Progress:** ${summary.inProgress || 0}\n`;
          response += `⏳ **Pending:** ${summary.pending || 0}\n`;
          response += `✅ **Completed:** ${summary.completed || 0}\n`;
          response += `🔥 **Urgent:** ${summary.urgent || 0}\n\n`;
          
          if (summary.completionRate !== undefined) {
            response += `📈 **Completion Rate:** ${summary.completionRate || 0}%\n`;
          }
          
          response += `\n💡 **Next Steps:** Focus on urgent tasks first, then work through pending items. You're doing great! 🌟`;
        } else {
          response = `📊 **Summary:** No task data available yet.`;
        }
        usedFallback = true;
      }
      
      // RESCHEDULE
      else if (lowerQuery.includes("reschedule") || trimmedQuery === "🎯 Reschedule") {
        console.log("🎯 Handling RESCHEDULE query...");
        actionType = "reschedule";
        response = `🎯 **How to Reschedule Your Tasks:**\n\n`;
        response += `**Steps:**\n`;
        response += `1️⃣ Identify tasks that need rescheduling\n`;
        response += `2️⃣ Check your calendar for availability\n`;
        response += `3️⃣ Update the due date in the system\n`;
        response += `4️⃣ Add a reason for rescheduling\n`;
        response += `5️⃣ Notify your team/manager\n\n`;
        response += `📋 **Go to the Tasks section → Edit task → Change due date → Save**\n\n`;
        response += `💡 Pro tip: Reschedule early if needed. Don't wait until the last minute! ⏰`;
        usedFallback = true;
      }
      
      // URGENT
      else if (lowerQuery.includes("urgent") || trimmedQuery === "🔥 Urgent") {
        console.log("🔥 Fetching URGENT tasks...");
        actionType = "urgent";
        const result = await getTasksDueTodayData(userId, userType);
        const urgentTasks = result.tasks ? result.tasks.filter(t => t.priority === 'high' || t.priority === 'urgent') : [];
        data = urgentTasks;
        
        if (urgentTasks && urgentTasks.length > 0) {
          response = `🔥 **${urgentTasks.length} URGENT task(s)!** Immediate action needed!\n\n`;
          urgentTasks.forEach((task, index) => {
            response += `${index + 1}. 🚨 **${task.name}** (${task.priority || 'High'})\n`;
            response += `   📅 Due: ${new Date(task.dueDate).toLocaleDateString()}\n`;
            response += `   ⚡ Status: ${task.status}\n\n`;
          });
          response += `🎯 **Action Plan:**\n1. Stop everything else\n2. Focus on these tasks IMMEDIATELY\n3. Report progress every hour\n4. Ask for help if blocked\n\n⏰ **YOU HAVE LIMITED TIME! GET STARTED NOW!** 💪`;
        } else {
          response = `🔥 **Good news!** You have no urgent tasks right now. Keep up the pace! 📈`;
        }
        usedFallback = true;
      }
      
      // ===== ALL OTHER QUERIES - USE GEMINI API =====
      else {
        console.log("🤖 Using Gemini AI for general query...");
        
        if (model) {
          try {
            const systemPrompt = `You are a helpful AI assistant for task management and work productivity. Answer the user's question clearly and concisely. Be helpful and professional.`;
            const fullPrompt = `${systemPrompt}\n\nUser Question: ${query}`;
            
            console.log("📤 Calling Gemini API...");
            const result = await model.generateContent(fullPrompt);
            
            // Handle response properly
            if (result && result.response && result.response.candidates && result.response.candidates.length > 0) {
              const content = result.response.candidates[0].content;
              if (content && content.parts && content.parts.length > 0) {
                response = content.parts[0].text;
                console.log("✅ Gemini API Response retrieved successfully");
                usedFallback = false;
              } else {
                throw new Error("No text content in response");
              }
            } else {
              throw new Error("Invalid response format from API");
            }
          } catch (apiError) {
            console.error("❌ Gemini API Error:", apiError.message);
            usedFallback = true;
            response = generateIntelligentResponse(query, "");
          }
        } else {
          console.warn("⚠️ Model not initialized, using fallback response");
          usedFallback = true;
          response = generateIntelligentResponse(query, "");
        }
      }

    } catch (dataError) {
      console.error("Error processing query:", dataError);
      response = generateIntelligentResponse(query, "");
      usedFallback = true;
    }
    
    res.json({
      success: true,
      response,
      actionType,
      data,
      usedFallback
    });
  } catch (error) {
    console.error("Error in processQuery:", error);
    res.status(500).json({ 
      success: false,
      message: "Error processing query", 
      error: error.message 
    });
  }
};

// Intelligent fallback response generator with better AI coverage
const generateIntelligentResponse = (query, context) => {
  const lowerQuery = query.toLowerCase();
  
  // Quick Query Buttons - Check these FIRST
  if (lowerQuery.includes("new task") || lowerQuery === "new tasks" || query === "✨ New Tasks") {
    return `🆕 **Your New Tasks**\n\nYou have new tasks assigned to you! Here's what you need to know:\n\n**What to do:**\n• Review the task details and requirements\n• Check the due date and priority level\n• Understand the deliverables expected\n• Ask questions if anything is unclear\n\n**Quick Actions:**\n1️⃣ Read the full task description\n2️⃣ Add it to your calendar\n3️⃣ Break it down into subtasks\n4️⃣ Set your start date\n5️⃣ Update progress as you work\n\nClick on the task to see all details!`;
  }
  
  if (lowerQuery.includes("due today") || lowerQuery === "due today" || query === "📅 Due Today") {
    return `📅 **Tasks Due Today**\n\nThese are your most urgent priorities!\n\n**Priority Actions:**\n🎯 Focus on high-priority tasks first\n⏰ Check remaining time for each task\n📋 Update progress regularly\n💬 Communicate blockers early\n✅ Check off completed items\n\n**Time Management Tips:**\n• Start with the hardest task\n• Use time-blocking (e.g., 2 hours per task)\n• Take 15-min breaks between tasks\n• Review progress every 2 hours\n\n**If you'll miss a deadline:**\n🔔 Notify your manager immediately\n📝 Provide realistic completion time\n🤝 Ask for help if needed\n\nYou got this! Focus and execute!`;
  }
  
  if (lowerQuery.includes("reschedule") || query === "🎯 Reschedule") {
    return `🎯 **Reschedule Tasks**\n\nNeed to adjust your deadlines? Here's how:\n\n**When to Reschedule:**\n⚠️ If timeline is unrealistic\n⚠️ Unexpected blockers appeared\n⚠️ Priority changed\n⚠️ Resource constraints\n\n**Before You Reschedule:**\n1. Identify the root cause\n2. Calculate realistic timeline\n3. Check resource availability\n4. Communicate with stakeholders\n5. Get approval if needed\n\n**How to Reschedule:**\n📅 Use the calendar view\n🔄 Drag tasks to new dates\n💬 Add reason for rescheduling\n📢 Notify your team\n✅ Update task details\n\n**Pro Tips:**\n• Provide buffer time (20%)\n• Consider dependencies\n• Keep stakeholders informed\n• Document the reason\n\nGood planning = Better execution!`;
  }
  
  if (lowerQuery.includes("urgent") || lowerQuery === "urgent" || query === "🔥 Urgent") {
    return `🔥 **Urgent Tasks**\n\nImmediate action required! Here's your priority:\n\n**What Makes a Task Urgent:**\n⏰ Deadline is TODAY or TOMORROW\n🚨 High business impact\n👥 Blocking other team members\n⚡ Critical for business continuity\n\n**Take Action NOW:**\n1️⃣ Stop everything else\n2️⃣ Read full task details\n3️⃣ Understand requirements\n4️⃣ Identify obstacles\n5️⃣ Start immediately\n\n**Time-Saving Tactics:**\n⚡ Focus on essentials only\n🚀 Parallel processing when possible\n🤝 Delegate subtasks\n💡 Find shortcuts\n🎯 Skip perfection - get it done\n\n**Keep Your Team Updated:**\n📢 Hourly progress updates\n🚦 Red/yellow flags immediately\n✅ Completion notification\n\n**Remember:**\nUrgent ≠ Important. But right now, GET IT DONE! �`;
  }
  
  if (lowerQuery.includes("completed") || lowerQuery.includes("done") || lowerQuery.includes("finished") || query === "✅ Completed") {
    return `✅ **Completed Tasks**\n\nAmazing! You're making great progress! 🎉\n\n**What You've Accomplished:**\n• Review your completed work\n• See how much you've achieved\n• Track your completion rate\n• Celebrate milestones!\n\n**Next Steps:**\n1️⃣ Archive completed tasks\n2️⃣ Update project status\n3️⃣ Move to next priority task\n4️⃣ Document lessons learned\n5️⃣ Share updates with team\n\n**Performance Insights:**\n📊 Completion rate\n⏱️ Average time per task\n📈 Trend over time\n🏆 Milestones reached\n\n**Motivation Boost:**\nYou completed ${context ? 'multiple' : 'several'} tasks!\n✨ Keep this momentum!\n🚀 You're crushing your goals!\n\nKeep up the excellent work! �`;
  }
  
  if (lowerQuery.includes("summary") || query === "📊 Summary") {
    return `📊 **Your Task Summary**\n\nHere's your complete work overview:\n\n**Task Breakdown:**\n📌 Total Tasks: See dashboard\n🔄 In Progress: Currently working on\n⏳ Pending: Waiting to start\n✅ Completed: Done and dusted\n🔥 Urgent: Needs immediate attention\n\n**Key Metrics:**\n📈 Completion Rate: %\n⏱️ Avg Task Duration: Hours\n🎯 On-Time Delivery: %\n📅 Deadlines Met: Count\n\n**What's Due:**\n📅 Today: Check urgent tasks\n📅 This Week: Plan ahead\n📅 This Month: Monitor progress\n\n**Your Priorities:**\n1. Review urgent tasks\n2. Complete tasks due today\n3. Plan upcoming week\n4. Update progress regularly\n\n**Action Items:**\n✓ Focus on high-priority work\n✓ Stay on top of deadlines\n✓ Keep team updated\n✓ Celebrate wins!\n\n**Pro Tips:**\n� Review summary daily\n� Adjust priorities as needed\n🤝 Communicate progress\n📊 Track metrics over time\n\nYou're doing great! Keep pushing! �`;
  }
  
  // Machine Learning specific questions (check BEFORE general AI)
  if (lowerQuery.includes("machine learning") || lowerQuery.includes("ml")) {
    return `**What is Machine Learning?**\n\nMachine Learning is a subset of AI that enables systems to learn from data without being explicitly programmed.\n\n**Key Concepts:**\n• Algorithms learn patterns from data\n• Improves accuracy with more data\n• Makes predictions on new unseen data\n• Adapts and evolves over time\n\n**Types of Machine Learning:**\n1. **Supervised Learning** - Learning from labeled data (e.g., spam detection)\n2. **Unsupervised Learning** - Finding patterns in unlabeled data (e.g., clustering)\n3. **Reinforcement Learning** - Learning through rewards (e.g., game playing)\n\n**Real-world Examples:**\n🎬 Netflix recommendations\n🎵 Spotify playlist suggestions\n🔍 Google search rankings\n📧 Gmail spam filters\n🚗 Autonomous vehicles\n\n**In Your Task Manager:**\nML helps with smart task prioritization and deadline predictions!`;
  }
  
  // General AI questions
  if (lowerQuery.includes("ai") || lowerQuery.includes("artificial intelligence")) {
    return `**What is Artificial Intelligence (AI)?**\n\nAI is the simulation of human intelligence by machines. It enables computers to perform tasks that typically require human intelligence.\n\n**Core AI Capabilities:**\n• Learning from experience (Machine Learning)\n• Recognizing patterns\n• Understanding language (NLP)\n• Computer vision\n• Decision making\n• Problem solving\n\n**AI vs Machine Learning:**\n• AI is the broad field\n• Machine Learning is a subset of AI\n• Not all AI uses machine learning\n\n**AI in Your Task Manager:**\n✓ Intelligent priority recommendations\n✓ Predictive deadline alerts\n✓ Workload optimization\n✓ Smart task suggestions\n\nI use AI to help you work smarter!`;
  }
  
  if (lowerQuery.includes("hello") || lowerQuery.includes("hi") || lowerQuery.includes("hey")) {
    return "👋 Hello! I'm your AI Task Assistant. I can help you manage tasks, track progress, prioritize work, and answer any questions. What would you like to know?";
  }
  
  if (lowerQuery.includes("what is") || lowerQuery.includes("what can you do") || lowerQuery.includes("capabilities") || lowerQuery.includes("about you")) {
    return "I'm your AI Task Assistant! I can help with:\n• Task management and tracking\n• Deadline notifications\n• Work prioritization\n• Progress monitoring\n• Productivity tips\n• Understanding your workload\n• Any work-related questions\n\nAsk me anything!";
  }
  
  if (lowerQuery.includes("how") && (lowerQuery.includes("manage") || lowerQuery.includes("organize") || lowerQuery.includes("handle"))) {
    return `Best practices for managing work:\n\n1. **Prioritize**: Focus on high-impact, urgent tasks first\n2. **Plan**: Break large tasks into manageable steps\n3. **Track**: Monitor progress regularly\n4. **Communicate**: Keep stakeholders informed\n5. **Reflect**: Review what went well and improve\n\nOur task manager helps with all these steps!`;
  }
  
  if (lowerQuery.includes("prioritize") || lowerQuery.includes("priority") || lowerQuery.includes("organize")) {
    return "To prioritize your work effectively:\n\n**Matrix Approach:**\n1. Urgent & Important → Do first\n2. Not Urgent but Important → Schedule\n3. Urgent but Not Important → Delegate\n4. Neither → Eliminate\n\n**Quick Tips:**\n✓ Identify deadline dates\n✓ Consider impact\n✓ Check dependencies\n✓ Review daily\n\nCheck your dashboard for task priorities!";
  }
  
  if (lowerQuery.includes("deadline") || lowerQuery.includes("due date") || lowerQuery.includes("when")) {
    return `Managing deadlines effectively:\n\n**Planning:**\n• Work backwards from deadline\n• Build in 20% buffer time\n• Set internal milestones\n\n**Tracking:**\n• Review progress daily\n• Adjust timeline if needed\n• Communicate delays early\n• Celebrate completions\n\n**Our Features:**\n📅 Calendar view of all deadlines\n🔔 Automatic reminders\n📊 Progress visualization`;
  }
  
  if (lowerQuery.includes("task") || lowerQuery.includes("work") || lowerQuery.includes("job") || lowerQuery.includes("assignment")) {
    return "I'm here to help with your tasks! You can ask me about:\n• New tasks assigned to you\n• Tasks due today or soon\n• Your completed work\n• Task summaries and overviews\n• How to prioritize\n• Productivity tips\n\nWhat would you like to know?";
  }
  
  if (lowerQuery.includes("productivity") || lowerQuery.includes("efficient") || lowerQuery.includes("speed")) {
    return `Tips to boost productivity:\n\n**Time Management:**\n• Use Pomodoro Technique (25 min focus blocks)\n• Block out distraction-free time\n• Start with hardest task\n• Take regular breaks\n\n**Work Organization:**\n• Break projects into tasks\n• Set clear goals\n• Remove blockers early\n• Celebrate progress\n\n**Tool Usage:**\n• Track progress visually\n• Use deadline reminders\n• Review metrics regularly`;
  }
  
  // Default helpful response
  return `Great question about "${query}"! Here's what I can tell you:\n\nI'm your AI Task Assistant designed to help you:\n✓ Manage your work effectively\n✓ Stay on top of deadlines\n✓ Organize and prioritize tasks\n✓ Track progress visually\n✓ Improve productivity\n\nFeel free to ask me anything task-related, work-related, or general productivity questions!`;
};

// Helper function to get new tasks
const getNewTasksData = async (userId, userType) => {
  try {
    let tasks = [];
    
    if (userType === 'employee') {
      // Get employee's ID
      const employee = await Employee.findOne({ user: userId });
      if (employee) {
        tasks = await Task.find({ assignedTo: employee.employeeId, status: 'pending' })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();
      }
    } else {
      // Get employer's tasks
      tasks = await Task.find({ assignedBy: userId, status: 'pending' })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
    }

    let response = "";
    if (tasks.length === 0) {
      response = "You don't have any new pending tasks at the moment. Great job staying caught up!";
    } else if (tasks.length === 1) {
      response = `You have 1 new task: "${tasks[0].name}". It's due on ${new Date(tasks[0].dueDate).toLocaleDateString()}.`;
    } else {
      response = `You have ${tasks.length} new tasks assigned to you. Here they are, sorted by creation date:`;
    }

    return { tasks, response };
  } catch (error) {
    console.error("Error getting new tasks:", error);
    return { 
      tasks: [], 
      response: "I couldn't retrieve your new tasks. Please check back later." 
    };
  }
};

// Helper function to get tasks due today
const getTasksDueTodayData = async (userId, userType) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let tasks = [];
    
    if (userType === 'employee') {
      const employee = await Employee.findOne({ user: userId });
      if (employee) {
        tasks = await Task.find({
          assignedTo: employee.employeeId,
          dueDate: { $gte: today, $lt: tomorrow },
          status: { $ne: 'completed' }
        }).lean();
      }
    } else {
      tasks = await Task.find({
        assignedBy: userId,
        dueDate: { $gte: today, $lt: tomorrow },
        status: { $ne: 'completed' }
      }).lean();
    }

    let response = "";
    if (tasks.length === 0) {
      response = "Great news! You don't have any tasks due today. Enjoy some free time!";
    } else if (tasks.length === 1) {
      response = `You have 1 task due today: "${tasks[0].name}". Make sure to complete it!`;
    } else {
      response = `You have ${tasks.length} tasks due today. Here they are:`;
    }

    return { tasks, response };
  } catch (error) {
    console.error("Error getting tasks due today:", error);
    return { 
      tasks: [], 
      response: "I couldn't retrieve today's tasks. Please try again." 
    };
  }
};

// Helper function to reschedule priorities
const reschedulePrioritiesData = async (userId, userType) => {
  try {
    let tasks = [];
    
    if (userType === 'employee') {
      const employee = await Employee.findOne({ user: userId });
      if (employee) {
        tasks = await Task.find({
          assignedTo: employee.employeeId,
          status: { $ne: 'completed' }
        }).lean();
      }
    } else {
      tasks = await Task.find({
        assignedBy: userId,
        status: { $ne: 'completed' }
      }).lean();
    }

    // Sort by urgency: deadline approaching + high priority first
    const sorted = tasks.sort((a, b) => {
      const categoryPriority = { urgent: 0, medium: 1, least: 2 };
      const categoryDiff = (categoryPriority[a.category] || 1) - (categoryPriority[b.category] || 1);
      
      if (categoryDiff !== 0) return categoryDiff;
      
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB;
    });

    let response = "";
    if (sorted.length === 0) {
      response = "You have no active tasks to prioritize!";
    } else {
      response = `I've reorganized your ${sorted.length} active tasks by priority (urgent tasks first, then by due date). Here's your optimized task order:`;
    }

    return { tasks: sorted, response };
  } catch (error) {
    console.error("Error rescheduling priorities:", error);
    return { 
      tasks: [], 
      response: "I couldn't reorganize your priorities. Please try again." 
    };
  }
};

// Helper function to get urgent tasks
const getUrgentTasks = async (userId, userType) => {
  try {
    let tasks = [];
    
    if (userType === 'employee') {
      const employee = await Employee.findOne({ user: userId });
      if (employee) {
        tasks = await Task.find({
          assignedTo: employee.employeeId,
          category: 'urgent',
          status: { $ne: 'completed' }
        }).lean();
      }
    } else {
      tasks = await Task.find({
        assignedBy: userId,
        category: 'urgent',
        status: { $ne: 'completed' }
      }).lean();
    }

    let response = "";
    if (tasks.length === 0) {
      response = "Good news! You don't have any urgent tasks right now.";
    } else {
      response = `You have ${tasks.length} urgent task(s) that need immediate attention:`;
    }

    return { tasks, response };
  } catch (error) {
    return { 
      tasks: [], 
      response: "I couldn't retrieve your urgent tasks." 
    };
  }
};

// Helper function to get completed tasks
const getCompletedTasks = async (userId, userType) => {
  try {
    let tasks = [];
    
    if (userType === 'employee') {
      const employee = await Employee.findOne({ user: userId });
      if (employee) {
        tasks = await Task.find({
          assignedTo: employee.employeeId,
          status: 'completed'
        })
          .sort({ completedAt: -1 })
          .limit(10)
          .lean();
      }
    } else {
      tasks = await Task.find({
        assignedBy: userId,
        status: 'completed'
      })
        .sort({ completedAt: -1 })
        .limit(10)
        .lean();
    }

    let response = "";
    if (tasks.length === 0) {
      response = "You haven't completed any tasks yet. Start by completing one!";
    } else {
      response = `Excellent work! You've completed ${tasks.length} task(s). Here are your most recent completions:`;
    }

    return { tasks, response };
  } catch (error) {
    return { 
      tasks: [], 
      response: "I couldn't retrieve your completed tasks." 
    };
  }
};

// Helper function to get task summary
const getTaskSummary = async (userId, userType) => {
  try {
    let allTasks = [];
    
    if (userType === 'employee') {
      const employee = await Employee.findOne({ user: userId });
      if (employee) {
        allTasks = await Task.find({ assignedTo: employee.employeeId }).lean();
      }
    } else {
      allTasks = await Task.find({ assignedBy: userId }).lean();
    }

    const summary = {
      total: allTasks.length,
      pending: allTasks.filter(t => t.status === 'pending').length,
      inProgress: allTasks.filter(t => t.status === 'in-progress').length,
      completed: allTasks.filter(t => t.status === 'completed').length,
      urgent: allTasks.filter(t => t.category === 'urgent' && t.status !== 'completed').length,
      overdue: allTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
    };

    const response = `📊 Here's your task summary:\n` +
      `• Total Tasks: ${summary.total}\n` +
      `• Pending: ${summary.pending}\n` +
      `• In Progress: ${summary.inProgress}\n` +
      `• Completed: ${summary.completed}\n` +
      `• Urgent: ${summary.urgent}\n` +
      `• Overdue: ${summary.overdue}`;

    return { summary, response };
  } catch (error) {
    return { 
      summary: {}, 
      response: "I couldn't generate your task summary." 
    };
  }
};

// Generic helpful responses (kept for fallback)
const getGenericResponse = (query) => {
  return "I'm an AI assistant here to help you with your tasks. I can help you find new tasks, check deadlines, manage priorities, and much more. Feel free to ask me anything about your work!";
};

// Placeholder functions for other endpoints
const getNewTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await getNewTasksData(userId, 'employee');
    res.json({ 
      success: true,
      newTasks: result.tasks, 
      message: result.response 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching new tasks", error: error.message });
  }
};

const getTasksDueToday = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await getTasksDueTodayData(userId, 'employee');
    res.json({ 
      success: true,
      tasksDueToday: result.tasks, 
      message: result.response 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching tasks", error: error.message });
  }
};

const reschedulePriorities = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await reschedulePrioritiesData(userId, 'employee');
    res.json({
      success: true,
      message: result.response,
      tasks: result.tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error rescheduling priorities", error: error.message });
  }
};

module.exports = {
  processQuery,
  getNewTasks,
  getTasksDueToday,
  reschedulePriorities
};
