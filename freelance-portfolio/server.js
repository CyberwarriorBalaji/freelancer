const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure your MySQL connection (Update password if necessary)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'freelance_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database successfully.');
});

// API endpoint to handle bookings/inquiries from the website
app.post('/api/book', (req, res) => {
    const { client_name, client_email, client_phone, service_name, message } = req.body;
    
    const query = `INSERT INTO inquiries (client_name, client_email, client_phone, message, status) VALUES (?, ?, ?, ?, 'pending')`;
    
    db.query(query, [client_name, client_email, client_phone, `${service_name}: ${message}`], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Database error occurred.' });
        }
        res.json({ success: true, message: 'Booking inquiry submitted successfully!' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});