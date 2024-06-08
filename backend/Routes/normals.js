import express from 'express';
import dbPromise from '../db.js'; // Adjust path if necessary

const router = express.Router();

// Helper function to calculate the sum of amounts
const calculateSum = (data) => {
    let sum = 0;
    for (const year in data) {
        for (const month in data[year]) {
            for (const date in data[year][month]) {
                for (const entry of data[year][month][date]) {
                    sum += parseInt(entry[0]); // Assuming entry[0] is the amount and is a string
                }
            }
        }
    }
    return sum;
};

// Route to get the sum of borrows, received, and earned for the ongoing month
router.get('/get-sum-summary/:userID', async (req, res) => {
    const { userID } = req.params;
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString();

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const borrowData = JSON.parse(user.borrow || '{}');
        const receivedData = JSON.parse(user.received || '{}');
        const spendData = JSON.parse(user.spend || '{}');

        const borrowSum = borrowData[currentYear] && borrowData[currentYear][currentMonth]
            ? calculateSum({ [currentYear]: { [currentMonth]: borrowData[currentYear][currentMonth] } })
            : 0;
        const receivedSum = receivedData[currentYear] && receivedData[currentYear][currentMonth]
            ? calculateSum({ [currentYear]: { [currentMonth]: receivedData[currentYear][currentMonth] } })
            : 0;
        const spendSum = spendData[currentYear] && spendData[currentYear][currentMonth]
            ? calculateSum({ [currentYear]: { [currentMonth]: spendData[currentYear][currentMonth] } })
            : 0;

        res.json({
            borrowSum,
            receivedSum,
            spendSum,
            earnedSum: receivedSum - spendSum // Assuming earned = received - spend
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get the sum of borrows, received, and earned for each month
router.get('/get-sum-summary-month/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const borrowData = JSON.parse(user.borrow || '{}');
        const receivedData = JSON.parse(user.received || '{}');
        const spendData = JSON.parse(user.spend || '{}');

        const months = {};
        const now = new Date();
        const currentYear = now.getFullYear().toString();

        // Iterate over the borrow data to calculate sums for each month
        for (const year in borrowData) {
            for (const month in borrowData[year]) {
                const borrowSum = calculateSum({ [year]: { [month]: borrowData[year][month] } });
                const receivedSum = receivedData[year] && receivedData[year][month]
                    ? calculateSum({ [year]: { [month]: receivedData[year][month] } })
                    : 0;
                const spendSum = spendData[year] && spendData[year][month]
                    ? calculateSum({ [year]: { [month]: spendData[year][month] } })
                    : 0;

                months[`${year}-${month}`] = {
                    borrowSum,
                    receivedSum,
                    spendSum,
                    earnedSum: receivedSum - spendSum // Assuming earned = received - spend
                };
            }
        }

        res.json({ months });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;