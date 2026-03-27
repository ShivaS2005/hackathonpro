// Task Controller
const Task = require("../models/Task");
const TaskProgress = require("../models/TaskProgress");
const Employee = require("../models/Employee");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedBy")
      .sort({ dueDate: 1 });
    
    res.json({ tasks, total: tasks.length });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find employee by their MongoDB ID to get their employee ID
    const employee = await Employee.findById(userId);
    
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Find tasks assigned to this employee using their employee ID
    const tasks = await Task.find({ assignedTo: employee.employeeId })
      .populate("assignedBy")
      .sort({ dueDate: 1 });
    
    res.json({ tasks, userId, employeeId: employee.employeeId });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id)
      .populate("assignedTo")
      .populate("assignedBy");
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { name, description, dueDate, category, assignedTo, priority, assignedBy } = req.body;
    
    // Validation
    if (!name || !description || !dueDate || !assignedBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const newTask = new Task({
      name,
      description,
      dueDate,
      category: category || "medium",
      assignedTo,
      priority: priority || "medium",
      assignedBy,
      status: "pending"
    });

    await newTask.save();

    res.status(201).json({
      message: "Task created successfully",
      task: newTask
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const task = await Task.findByIdAndUpdate(id, updateData, { new: true })
      .populate("assignedTo")
      .populate("assignedBy");
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

const markTaskComplete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByIdAndUpdate(
      id, 
      { status: "completed", completedAt: new Date() },
      { new: true }
    ).populate("assignedTo").populate("assignedBy");
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task marked as complete", task });
  } catch (error) {
    res.status(500).json({ message: "Error marking task complete", error: error.message });
  }
};

const generateReport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id)
      .populate("assignedTo")
      .populate("assignedBy");
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // TODO: Generate PDF report with task details and completion status
    res.json({ 
      message: "Report generated", 
      taskId: id, 
      task: task,
      pdfUrl: "/reports/task-" + id + ".pdf" 
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating report", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

// Add daily progress for a task
const addProgress = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { employeeId, progressDate, progressPercentage, progressDescription, notes, attachments } = req.body;

    // Validation
    if (!employeeId || !progressDate || progressPercentage === undefined || !progressDescription) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const newProgress = new TaskProgress({
      taskId,
      employeeId,
      progressDate: new Date(progressDate),
      progressPercentage,
      progressDescription,
      notes: notes || "",
      attachments: attachments || []
    });

    await newProgress.save();

    res.status(201).json({
      message: "Progress added successfully",
      progress: newProgress
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding progress", error: error.message });
  }
};

// Get all progress entries for a specific task
const getTaskProgress = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Verify task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const progressEntries = await TaskProgress.find({ taskId })
      .sort({ progressDate: 1 });

    res.json({
      progressEntries,
      total: progressEntries.length,
      taskId
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress", error: error.message });
  }
};

// Get progress for a specific date
const getProgressByDate = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date parameter required" });
    }

    // Get progress for the specific date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const progress = await TaskProgress.findOne({
      taskId,
      progressDate: { $gte: startDate, $lte: endDate }
    });

    if (!progress) {
      return res.status(404).json({ message: "No progress found for this date" });
    }

    res.json({ progress });
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress by date", error: error.message });
  }
};

// Update progress entry
const updateProgress = async (req, res) => {
  try {
    const { taskId, progressId } = req.params;
    const updateData = req.body;

    const progress = await TaskProgress.findByIdAndUpdate(progressId, updateData, { new: true });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.json({
      message: "Progress updated successfully",
      progress
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating progress", error: error.message });
  }
};

// Delete progress entry
const deleteProgress = async (req, res) => {
  try {
    const { progressId } = req.params;

    const progress = await TaskProgress.findByIdAndDelete(progressId);

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.json({ message: "Progress deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting progress", error: error.message });
  }
};

// Generate PDF report with task progress history
const generatePDFReport = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Fetch task and progress data
    const task = await Task.findById(taskId).populate("assignedBy");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const progressEntries = await TaskProgress.find({ taskId })
      .sort({ progressDate: 1 });

    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, "../reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Create a new PDF document
    const doc = new PDFDocument();
    const fileName = `task-report-${taskId}-${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Add header
    doc.fontSize(20).font("Helvetica-Bold").text("Task Progress Report", 50, 50);
    doc.fontSize(12).font("Helvetica").text(`Generated: ${moment().format("YYYY-MM-DD HH:mm:ss")}`, 50, 80);

    // Add task details
    doc.fontSize(14).font("Helvetica-Bold").text("Task Details", 50, 120);
    doc.fontSize(11).font("Helvetica");
    doc.text(`Task Name: ${task.name}`, 50, 150);
    doc.text(`Description: ${task.description}`, 50, 170);
    doc.text(`Status: ${task.status}`, 50, 190);
    doc.text(`Priority: ${task.priority}`, 50, 210);
    doc.text(`Category: ${task.category}`, 50, 230);
    doc.text(`Due Date: ${moment(task.dueDate).format("YYYY-MM-DD")}`, 50, 250);
    doc.text(`Assigned To: ${task.assignedTo || "Unassigned"}`, 50, 270);
    doc.text(`Assigned By: ${task.assignedBy?.name || "N/A"}`, 50, 290);

    if (task.completedAt) {
      doc.text(`Completed At: ${moment(task.completedAt).format("YYYY-MM-DD HH:mm:ss")}`, 50, 310);
    }

    // Add progress history
    doc.fontSize(14).font("Helvetica-Bold").text("Progress History", 50, 340);

    if (progressEntries.length === 0) {
      doc.fontSize(11).font("Helvetica").text("No progress entries found.", 50, 370);
    } else {
      let yPosition = 370;
      const pageHeight = doc.page.height;
      const bottomMargin = 50;

      progressEntries.forEach((entry, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - bottomMargin - 100) {
          doc.addPage();
          yPosition = 50;
        }

        doc.fontSize(10).font("Helvetica-Bold").text(`Entry ${index + 1}:`, 50, yPosition);
        yPosition += 20;

        doc.fontSize(9).font("Helvetica");
        doc.text(`Date: ${moment(entry.progressDate).format("YYYY-MM-DD")}`, 60, yPosition);
        yPosition += 15;
        doc.text(`Time: ${moment(entry.createdAt).format("HH:mm:ss")}`, 60, yPosition);
        yPosition += 15;
        doc.text(`Progress: ${entry.progressPercentage}%`, 60, yPosition);
        yPosition += 15;
        doc.text(`Description: ${entry.progressDescription}`, 60, yPosition);
        yPosition += 15;

        if (entry.notes) {
          doc.text(`Notes: ${entry.notes}`, 60, yPosition);
          yPosition += 15;
        }

        yPosition += 10;
      });
    }

    // Add summary section
    let yPosition = doc.y + 20;
    if (yPosition > doc.page.height - 100) {
      doc.addPage();
      yPosition = 50;
    }

    doc.fontSize(14).font("Helvetica-Bold").text("Summary", 50, yPosition);
    yPosition += 30;

    doc.fontSize(11).font("Helvetica");
    doc.text(`Total Progress Entries: ${progressEntries.length}`, 50, yPosition);
    yPosition += 20;

    const latestProgress = progressEntries[progressEntries.length - 1];
    if (latestProgress) {
      doc.text(`Latest Progress Update: ${moment(latestProgress.progressDate).format("YYYY-MM-DD")}`, 50, yPosition);
      yPosition += 20;
      doc.text(`Latest Progress: ${latestProgress.progressPercentage}%`, 50, yPosition);
    }

    // Finalize PDF
    doc.end();

    // Wait for the stream to finish
    stream.on("finish", () => {
      res.json({
        message: "PDF report generated successfully",
        pdfUrl: `/api/tasks/download-report/${fileName}`,
        fileName: fileName
      });
    });

    stream.on("error", (err) => {
      res.status(500).json({ message: "Error generating PDF", error: err.message });
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating report", error: error.message });
  }
};

// Download PDF report
const downloadPDFReport = async (req, res) => {
  try {
    const { fileName } = req.params;
    
    // Sanitize filename to prevent directory traversal
    if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
      return res.status(400).json({ message: "Invalid file name" });
    }

    const filePath = path.join(__dirname, "../reports", fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error downloading report", error: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTasksByUser,
  getTaskById,
  createTask,
  updateTask,
  markTaskComplete,
  generateReport,
  deleteTask,
  addProgress,
  getTaskProgress,
  getProgressByDate,
  updateProgress,
  deleteProgress,
  generatePDFReport,
  downloadPDFReport
};
