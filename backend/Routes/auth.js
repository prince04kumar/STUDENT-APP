// Routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer'; // Assuming nodemailer is installed
import dbPromise from '../db.js'; // Adjust path if necessary

const router = express.Router();

// Function to create Users table if not exists
const createUsersTable = async () => {
    try {
        const db = await dbPromise;
        await db.run(`
            CREATE TABLE IF NOT EXISTS Users (
                userID TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                user_name TEXT UNIQUE NOT NULL,
                resetToken TEXT,
                resetTokenExpiry INTEGER
            )
        `);
        console.log('Users table created or already exists');
    } catch (err) {
        console.error('Error creating table:', err.message);
    }
};

createUsersTable(); // Call function to create Users table

// Route to register a new user
router.post('/register', async (req, res) => {
    const { email, password, user_name } = req.body;

    if (!email || !password || !user_name) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const db = await dbPromise;
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.run('INSERT INTO Users (userID, email, password, user_name) VALUES (?, ?, ?, ?)', [
            Date.now().toString(), email, hashedPassword, user_name
        ]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email or username already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Users WHERE email = ?', [email]);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // For security, do not include sensitive user information in the response
        const userWithoutPassword = {
            userID: user.userID,
            email: user.email,
            user_name: user.user_name
        };

        res.json({ message: 'Login successful', user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to initiate password reset (generates and sends reset token)
router.post('/reset-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Users WHERE email = ?', [email]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const resetToken = Math.random().toString(36).substring(2, 10);

        const resetTokenExpiry = Date.now() + 3600000;
        await db.run('UPDATE Users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?', [
            resetToken, resetTokenExpiry, email
        ]);
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SENDER_EMAIL, 
                pass: process.env.SENDER_PASS 
            }
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Password Reset Request',
            text: `Use this token to reset your password: ${resetToken}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Failed to send reset email' });
            }
            console.log('Reset email sent:', info.response);
            res.json({ message: 'Password reset email sent successfully' });
        });
    } catch (err) {
        console.error('Error initiating password reset:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
    }

    try {
        const db = await dbPromise;
        const now = Date.now();

        const user = await db.get('SELECT * FROM Users WHERE resetToken = ? AND resetTokenExpiry > ?', [token, now]);

        if (!user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.run('UPDATE Users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE userID = ?', [
            hashedPassword, user.userID 
        ]);

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
