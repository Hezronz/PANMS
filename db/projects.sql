USE panms_db;

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  title VARCHAR(255),
  abstract TEXT,
  report TEXT,
  code TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  hod_feedback TEXT,
  incharge_feedback TEXT,
  guide_feedback TEXT,
  FOREIGN KEY (student_id) REFERENCES users(id)
);
