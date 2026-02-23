const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'patients.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    sex TEXT,
    address TEXT,
    dateOfSurgery TEXT,
    drugHx TEXT,
    pmh TEXT,
    psh TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS follow_ups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id TEXT,
    type TEXT, -- 'fu1', 'fu2', 'fu3'
    painScore INTEGER,
    rom TEXT,
    loda TEXT,
    hhsScore TEXT,
    hhs_details TEXT,
    xray_path TEXT,
    mri_path TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
  );
`);

module.exports = db;
