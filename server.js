const multer = require('multer')
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const loginHandler = require('./api/login');

const app = express();
const PORT = 3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve files from 'frontend' folder instead
app.use(express.static(path.join(__dirname, 'frontend')));

// Send login page at root
// Send login page at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'student-login.html'));
});
        
app.use(cors());
app.use(express.json());

app.post('/api/login', loginHandler); // Connects your login.js file

app.get('/api/getStatus', (req, res) => {
  res.json({ status: "Project pending approval" }); // Example placeholder
});

// existing imports …
const db = require('./db/db');            // reuse pool

// ---- Admin: view pending projects -----------------
app.get('/api/projects/pending', async (req,res)=>{
  const [rows] = await db.query(
    `SELECT p.id, p.title, p.status, p.report, u.name AS student
     FROM projects p
     JOIN users u ON u.id = p.student_id
     WHERE p.status='pending'`);
  res.json(rows);
});

// Get submitted project(s) for a student (example using hardcoded student ID)
app.get('/api/myprojects/:studentId', async (req, res) => {
  const studentId = req.params.studentId;

  const [rows] = await db.query(
    `SELECT id, title, status, report FROM projects WHERE student_id = ?`,
    [studentId]
  );

  res.json(rows);
});



// ---- Admin: approve project -----------------------
app.post('/api/projects/:id/approve', async (req,res)=>{
  await db.query('UPDATE projects SET status="approved" WHERE id=?',[req.params.id]);
  res.json({message:"Project approved"});
});

// ---- Admin: reject project ------------------------
app.post('/api/projects/:id/reject', async (req,res)=>{
  const comment = req.body.comment || 'No comment';
  await db.query(
    'UPDATE projects SET status="rejected", hod_feedback=? WHERE id=?',
    [comment, req.params.id]);
  res.json({message:"Project rejected"});
});

// Get project status for a student
app.get('/api/status/:studentId', async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const [rows] = await db.query(
      `SELECT title, status, hod_feedback, incharge_feedback, guide_feedback
       FROM projects
       WHERE student_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [studentId]
    );

    if (rows.length === 0) {
      return res.json({ status: "No project submitted yet" });
    }

    const project = rows[0];
    res.json({
      title: project.title,
      status: project.status,
      hodFeedback: project.hod_feedback,
      inchargeFeedback: project.incharge_feedback,
      guideFeedback: project.guide_feedback
    });
  } catch (err) {
    console.error("Status fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

app.post('/api/submitProject', upload.array('projectFiles'), async (req, res) => {
  try {
    const { projectTitle, student } = req.body; // Extract dynamic studentId
    const studentId = student; // rename for clarity
    const files = req.files;

    if (!projectTitle || !files.length || !studentId) {
      return res.status(400).json({ message: "Title, files, and student ID are required." });
    }

    const report = files.map(f => f.filename).join(', ');
    const [result] = await db.query(
      `INSERT INTO projects (student_id, title, abstract, report, code)
       VALUES (?, ?, ?, ?, ?)`,
      [studentId, projectTitle, "uploaded", report, "uploaded"]
    );

    res.status(201).json({ message: "Project submitted successfully", projectId: result.insertId });
  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
