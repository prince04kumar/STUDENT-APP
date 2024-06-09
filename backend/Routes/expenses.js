import express from 'express';
import dbPromise from '../db.js'; // Adjust path if necessary

const router = express.Router();

// Route to add an expense entry
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

        const spendData = JSON.parse(user.spend || '{}');
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString();
        const date = now.getDate().toString();

        if (!spendData[year]) {
            spendData[year] = {};
        }
        if (!spendData[year][month]) {
            spendData[year][month] = {};
        }
        if (!spendData[year][month][date]) {
            spendData[year][month][date] = [];
        }

        spendData[year][month][date].push([amount, remark]);

        await db.run('UPDATE Finance SET spend = ? WHERE userID = ?', [
            JSON.stringify(spendData), userID
        ]);

        res.status(201).json({ message: 'Expense entry added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to delete an expense entry
router.delete('/delete/:userID/:year/:month/:date/:index', async (req, res) => {
    const { userID, year, month, date, index } = req.params;

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const spendData = JSON.parse(user.spend || '{}');

        if (!spendData[year] || !spendData[year][month] || !spendData[year][month][date] || !spendData[year][month][date][index]) {
            return res.status(404).json({ error: 'Expense entry not found' });
        }

        spendData[year][month][date].splice(index, 1);

        if (spendData[year][month][date].length === 0) {
            delete spendData[year][month][date];
        }
        if (Object.keys(spendData[year][month]).length === 0) {
            delete spendData[year][month];
        }
        if (Object.keys(spendData[year]).length === 0) {
            delete spendData[year];
        }

        await db.run('UPDATE Finance SET spend = ? WHERE userID = ?', [
            JSON.stringify(spendData), userID
        ]);

        res.json({ message: 'Expense entry deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get expense data for a specific date, month, and year
router.get('/get-by-date/:userID/:year/:month/:date', async (req, res) => {
    const { userID, year, month, date } = req.params;

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const spendData = JSON.parse(user.spend || '{}');

        if (!spendData[year] || !spendData[year][month] || !spendData[year][month][date]) {
            return res.status(404).json({ error: 'No expense entries found for the specified date' });
        }

        const spendEntries = spendData[year][month][date];

        res.json({ spendEntries });
    } catch (err) {
        console.error('Error fetching expense entries:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get expense summary for a specific month and date
router.get('/summary/:userID/:year/:month/:date', async (req, res) => {
    const { userID, year, month, date } = req.params;

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const spendData = JSON.parse(user.spend || '{}');
        const monthlySpendEntries = spendData[year]?.[month] || {};
        const dailySpendEntries = monthlySpendEntries[date] || [];

        // Calculate total spend for the month
        let monthlyTotal = 0;
        for (const day in monthlySpendEntries) {
            const entries = monthlySpendEntries[day];
            for (const [amount] of entries) {
                monthlyTotal += parseFloat(amount);
            }
        }

        // Calculate total spend for the specific date
        let dailyTotal = 0;
        for (const [amount] of dailySpendEntries) {
            dailyTotal += parseFloat(amount);
        }

        // Calculate overall total spend
        let overallTotal = 0;
        for (const yearKey in spendData) {
            for (const monthKey in spendData[yearKey]) {
                for (const dayKey in spendData[yearKey][monthKey]) {
                    const entries = spendData[yearKey][monthKey][dayKey];
                    for (const [amount] of entries) {
                        overallTotal += parseFloat(amount);
                    }
                }
            }
        }

        res.json({
            month: { entries: monthlySpendEntries, total: monthlyTotal },
            date: { entries: dailySpendEntries, total: dailyTotal },
            overallTotal
        });
    } catch (err) {
        console.error('Error fetching expense summary:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
