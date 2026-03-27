const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { SerialPort } = require("serialport");

dotenv.config();

const app = express();

// ===========================
// CORS SETUP
// ===========================
// Allow only your Netlify frontend or localhost in dev
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://frolicking-liger-f130ea.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Parse JSON
app.use(express.json());

/* ===========================
   SERIAL PORT (ARDUINO) - OPTIONAL
=========================== */
if (process.env.ARDUINO_COM) {
  const port = new SerialPort({
    path: process.env.ARDUINO_COM,
    baudRate: 9600,
  });

  port.on("open", () => {
    console.log(`Serial Port ${process.env.ARDUINO_COM} opened`);
  });

  port.on("data", (data) => {
    console.log("Data from Arduino:", data.toString());
  });

  port.on("error", (err) => {
    console.log("Serial Port Error:", err.message);
  });

  // Optional test route
  app.get("/send-to-arduino", (req, res) => {
    port.write("HELLO\n");
    res.send("Sent to Arduino");
  });
}

/* ===========================
   MONGODB CONNECTION
=========================== */
const mongoURL = process.env.DATABASE_URL || 
  'mongodb+srv://23csea06bavakarnig:fLh1FEQ7iqGmDTG5@cluster0.39smckc.mongodb.net/hackathon?retryWrites=true&w=majority';

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

/* ===========================
   ROUTES
=========================== */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/employees", require("./routes/employees"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/ai-chat", require("./routes/aiChat"));

/* ===========================
   ROOT ROUTE
=========================== */
app.get("/", (req, res) => {
  res.json({ 
    message: "Employee Task Manager Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      employees: "/api/employees", 
      tasks: "/api/tasks",
      notifications: "/api/notifications",
      aiChat: "/api/ai-chat"
    }
  });
});

/* ===========================
   HEALTH CHECK
=========================== */
app.get("/health", (req, res) => {
  res.json({ message: "Employee Task Manager Backend API is running 🚀" });
});

/* ===========================
   ERROR HANDLING
=========================== */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

/* ===========================
   START SERVER
=========================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
