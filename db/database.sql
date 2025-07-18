USE railway;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin', 'hod', 'guide') NOT NULL
);

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