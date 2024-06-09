import express from 'express';
import dbPromise from '../db.js'; // Adjust path if necessary

const router = express.Router();

// Route to add a received entry
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

        const receivedData = JSON.parse(user.received || '{}');
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString();
        const date = now.getDate().toString();

        if (!receivedData[year]) {
            receivedData[year] = {};
        }
        if (!receivedData[year][month]) {
            receivedData[year][month] = {};
        }
        if (!receivedData[year][month][date]) {
            receivedData[year][month][date] = [];
        }

        receivedData[year][month][date].push([amount, remark]);

        await db.run('UPDATE Finance SET received = ? WHERE userID = ?', [
            JSON.stringify(receivedData), userID
        ]);

        res.status(201).json({ message: 'Received entry added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to delete a received entry
router.delete('/delete/:userID/:year/:month/:date/:index', async (req, res) => {
    const { userID, year, month, date, index } = req.params;

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const receivedData = JSON.parse(user.received || '{}');

        if (!receivedData[year] || !receivedData[year][month] || !receivedData[year][month][date] || !receivedData[year][month][date][index]) {
            return res.status(404).json({ error: 'Received entry not found' });
        }

        receivedData[year][month][date].splice(index, 1);

        if (receivedData[year][month][date].length === 0) {
            delete receivedData[year][month][date];
        }
        if (Object.keys(receivedData[year][month]).length === 0) {
            delete receivedData[year][month];
        }
        if (Object.keys(receivedData[year]).length === 0) {
            delete receivedData[year];
        }

        await db.run('UPDATE Finance SET received = ? WHERE userID = ?', [
            JSON.stringify(receivedData), userID
        ]);

        res.json({ message: 'Received entry deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get received data for a specific date, month, and year
router.get('/get-by-date/:userID/:year/:month/:date', async (req, res) => {
    const { userID, year, month, date } = req.params;

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const receivedData = JSON.parse(user.received || '{}');

        if (!receivedData[year] || !receivedData[year][month] || !receivedData[year][month][date]) {
            return res.status(404).json({ error: 'No received entries found for the specified date' });
        }

        const receivedEntries = receivedData[year][month][date];

        res.json({ receivedEntries });
    } catch (err) {
        console.error('Error fetching received entries:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get received summary for a specific month and date
router.get('/summary/:userID/:year/:month/:date', async (req, res) => {
    const { userID, year, month, date } = req.params;

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const receivedData = JSON.parse(user.received || '{}');
        const monthlyReceivedEntries = receivedData[year]?.[month] || {};
        const dailyReceivedEntries = monthlyReceivedEntries[date] || [];

        // Calculate total received for the month
        let monthlyTotal = 0;
        for (const day in monthlyReceivedEntries) {
            const entries = monthlyReceivedEntries[day];
            for (const [amount] of entries) {
                monthlyTotal += parseFloat(amount);
            }
        }

        // Calculate total received for the specific date
        let dailyTotal = 0;
        for (const [amount] of dailyReceivedEntries) {
            dailyTotal += parseFloat(amount);
        }

        // Calculate overall total received
        let overallTotal = 0;
        for (const yearKey in receivedData) {
            for (const monthKey in receivedData[yearKey]) {
                for (const dayKey in receivedData[yearKey][monthKey]) {
                    const entries = receivedData[yearKey][monthKey][dayKey];
                    for (const [amount] of entries) {
                        overallTotal += parseFloat(amount);
                    }
                }
            }
        }

        res.json({
            month: { entries: monthlyReceivedEntries, total: monthlyTotal },
            date: { entries: dailyReceivedEntries, total: dailyTotal },
            overallTotal
        });
    } catch (err) {
        console.error('Error fetching received summary:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
