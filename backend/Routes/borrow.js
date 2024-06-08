import express from 'express';
import dbPromise from '../db.js'; // Adjust path if necessary

const router = express.Router();

// Route to add a borrow entry
router.post('/add', async (req, res) => {
    const { userID, amount, remark } = req.body;

    if (!userID || !amount || !remark) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const borrowData = JSON.parse(user.borrow || '{}');
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString();
        const date = now.getDate().toString();

        if (!borrowData[year]) {
            borrowData[year] = {};
        }
        if (!borrowData[year][month]) {
            borrowData[year][month] = {};
        }
        if (!borrowData[year][month][date]) {
            borrowData[year][month][date] = [];
        }

        borrowData[year][month][date].push([amount, remark]);

        await db.run('UPDATE Finance SET borrow = ? WHERE userID = ?', [
            JSON.stringify(borrowData), userID
        ]);

        res.status(201).json({ message: 'Borrow entry added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to delete a borrow entry
router.delete('/delete/:userID/:year/:month/:date/:index', async (req, res) => {
    const { userID, year, month, date, index } = req.params;

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const borrowData = JSON.parse(user.borrow || '{}');

        if (!borrowData[year] || !borrowData[year][month] || !borrowData[year][month][date] || !borrowData[year][month][date][index]) {
            return res.status(404).json({ error: 'Borrow entry not found' });
        }

        borrowData[year][month][date].splice(index, 1);

        if (borrowData[year][month][date].length === 0) {
            delete borrowData[year][month][date];
        }
        if (Object.keys(borrowData[year][month]).length === 0) {
            delete borrowData[year][month];
        }
        if (Object.keys(borrowData[year]).length === 0) {
            delete borrowData[year];
        }

        await db.run('UPDATE Finance SET borrow = ? WHERE userID = ?', [
            JSON.stringify(borrowData), userID
        ]);

        res.json({ message: 'Borrow entry deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;