const db = require('./database');

try {
    db.prepare('ALTER TABLE follow_ups ADD COLUMN hhs_details TEXT').run();
    console.log('Column added successfully');
} catch (e) {
    console.log('Column might already exist or error:', e.message);
}
