const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// API Endpoints

// Save Patient Record (Initial + Followups)
app.post('/api/patients', upload.fields([
    { name: 'fu1_xray', maxCount: 1 },
    { name: 'fu1_mri', maxCount: 1 },
    { name: 'fu2_xray', maxCount: 1 },
    { name: 'fu2_mri', maxCount: 1 },
    { name: 'fu3_xray', maxCount: 1 },
    { name: 'fu3_mri', maxCount: 1 }
]), (req, res) => {
    try {
        const patientRecord = JSON.parse(req.body.data);
        const patientId = uuidv4();
        const { patientData, followUps } = patientRecord;

        // Insert Patient
        const insertPatient = db.prepare(`
      INSERT INTO patients (id, name, age, sex, address, dateOfSurgery, drugHx, pmh, psh)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        insertPatient.run(
            patientId,
            patientData.name,
            patientData.age,
            patientData.sex,
            patientData.address,
            patientData.dateOfSurgery,
            patientData.drugHx,
            patientData.pmh,
            patientData.psh
        );

        // Insert Follow-ups
        const insertFollowUp = db.prepare(`
      INSERT INTO follow_ups (patient_id, type, painScore, rom, loda, hhsScore, xray_path, mri_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

        Object.entries(followUps).forEach(([type, data]) => {
            const xray = req.files[`${type}_xray`] ? `uploads/${req.files[`${type}_xray`][0].filename}` : null;
            const mri = req.files[`${type}_mri`] ? `uploads/${req.files[`${type}_mri`][0].filename}` : null;
            const hhsDetails = data.hhsDetailed ? JSON.stringify(data.hhsDetailed) : null;

            insertFollowUp.run(
                patientId,
                type,
                data.painScore,
                data.rom,
                data.loda,
                data.hhsScore,
                hhsDetails,
                xray,
                mri
            );
        });

        res.json({ success: true, patientId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// List all patients
app.get('/api/patients', (req, res) => {
    try {
        const patients = db.prepare('SELECT * FROM patients ORDER BY created_at DESC').all();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get full patient details
app.get('/api/patients/:id', (req, res) => {
    try {
        const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
        if (!patient) return res.status(404).json({ error: 'Patient not found' });

        const followUpsList = db.prepare('SELECT * FROM follow_ups WHERE patient_id = ?').all(req.params.id);

        // Format follow-ups back to object for frontend
        const followUps = {};
        followUpsList.forEach(fu => {
            followUps[fu.type] = {
                painScore: fu.painScore,
                rom: fu.rom,
                loda: fu.loda,
                hhsScore: fu.hhsScore,
                hhsDetailed: fu.hhs_details ? JSON.parse(fu.hhs_details) : null,
                xray_path: fu.xray_path,
                mri_path: fu.mri_path
            };
        });

        res.json({ patientData: patient, followUps });
    } catch (error) {
        console.error('Error fetching patient details:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update Patient Record
app.put('/api/patients/:id', upload.fields([
    { name: 'fu1_xray', maxCount: 1 },
    { name: 'fu1_mri', maxCount: 1 },
    { name: 'fu2_xray', maxCount: 1 },
    { name: 'fu2_mri', maxCount: 1 },
    { name: 'fu3_xray', maxCount: 1 },
    { name: 'fu3_mri', maxCount: 1 }
]), (req, res) => {
    try {
        const patientRecord = JSON.parse(req.body.data);
        const patientId = req.params.id;
        const { patientData, followUps } = patientRecord;

        // Update Patient
        const updatePatient = db.prepare(`
      UPDATE patients 
      SET name = ?, age = ?, sex = ?, address = ?, dateOfSurgery = ?, drugHx = ?, pmh = ?, psh = ?
      WHERE id = ?
    `);

        updatePatient.run(
            patientData.name,
            patientData.age,
            patientData.sex,
            patientData.address,
            patientData.dateOfSurgery,
            patientData.drugHx,
            patientData.pmh,
            patientData.psh,
            patientId
        );

        // Update Follow-ups
        const updateFollowUp = db.prepare(`
      UPDATE follow_ups 
      SET painScore = ?, rom = ?, loda = ?, hhsScore = ?, hhs_details = ?, xray_path = COALESCE(?, xray_path), mri_path = COALESCE(?, mri_path)
      WHERE patient_id = ? AND type = ?
    `);

        Object.entries(followUps).forEach(([type, data]) => {
            const xray = req.files[`${type}_xray`] ? `uploads/${req.files[`${type}_xray`][0].filename}` : null;
            const mri = req.files[`${type}_mri`] ? `uploads/${req.files[`${type}_mri`][0].filename}` : null;
            const hhsDetails = data.hhsDetailed ? JSON.stringify(data.hhsDetailed) : null;

            updateFollowUp.run(
                data.painScore,
                data.rom,
                data.loda,
                data.hhsScore,
                hhsDetails,
                xray,
                mri,
                patientId,
                type
            );
        });

        res.json({ success: true, patientId });
    } catch (error) {
        console.error('Error updating patient details:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
