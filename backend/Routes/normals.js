import express from 'express';
import dbPromise from '../db.js'; 

const router = express.Router();


const calculateSum = (data) => {
    let sum = 0;
    for (const year in data) {
        for (const month in data[year]) {
            for (const date in data[year][month]) {
                for (const entry of data[year][month][date]) {
                    sum += parseInt(entry[0]); 
                }
            }
        }
    }
    return sum;
};


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
            earnedSum: receivedSum - spendSum 
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


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
                    earnedSum: receivedSum - spendSum 
                };
            }
        }

        res.json({ months });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/get-sum-summary-year/:userID/:year', async (req, res) => {
    const { userID, year } = req.params;

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const borrowData = JSON.parse(user.borrow || '{}');
        const receivedData = JSON.parse(user.received || '{}');
        const spendData = JSON.parse(user.spend || '{}');

        const borrowSum = borrowData[year] ? calculateSum({ [year]: borrowData[year] }) : 0;
        const receivedSum = receivedData[year] ? calculateSum({ [year]: receivedData[year] }) : 0;
        const spendSum = spendData[year] ? calculateSum({ [year]: spendData[year] }) : 0;

        res.json({
            borrowSum,
            receivedSum,
            spendSum,
            earnedSum: receivedSum - spendSum 
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/get-detailed-summary/:userID/:year/:month', async (req, res) => {
    const { userID, year, month } = req.params;

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const borrowData = JSON.parse(user.borrow || '{}');
        const receivedData = JSON.parse(user.received || '{}');
        const spendData = JSON.parse(user.spend || '{}');

        const borrowEntries = borrowData[year] && borrowData[year][month] ? borrowData[year][month] : {};
        const receivedEntries = receivedData[year] && receivedData[year][month] ? receivedData[year][month] : {};
        const spendEntries = spendData[year] && spendData[year][month] ? spendData[year][month] : {};

        res.json({
            borrowEntries,
            receivedEntries,
            spendEntries
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/get-overall-summary/:userID', async (req, res) => {
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

        const borrowSum = calculateSum(borrowData);
        const receivedSum = calculateSum(receivedData);
        const spendSum = calculateSum(spendData);

        res.json({
            borrowSum,
            receivedSum,
            spendSum,
            earnedSum: receivedSum - spendSum
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/get-daily-summary/:userID/:year/:month', async (req, res) => {
    const { userID, year, month } = req.params;

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const borrowData = JSON.parse(user.borrow || '{}');
        const receivedData = JSON.parse(user.received || '{}');
        const spendData = JSON.parse(user.spend || '{}');

        const days = {};

        if (borrowData[year] && borrowData[year][month]) {
            for (const date in borrowData[year][month]) {
                const borrowSum = calculateSum({ [year]: { [month]: { [date]: borrowData[year][month][date] } } });
                days[date] = days[date] || { borrowSum: 0, receivedSum: 0, spendSum: 0 };
                days[date].borrowSum += borrowSum;
            }
        }

        if (receivedData[year] && receivedData[year][month]) {
            for (const date in receivedData[year][month]) {
                const receivedSum = calculateSum({ [year]: { [month]: { [date]: receivedData[year][month][date] } } });
                days[date] = days[date] || { borrowSum: 0, receivedSum: 0, spendSum: 0 };
                days[date].receivedSum += receivedSum;
            }
        }

        if (spendData[year] && spendData[year][month]) {
            for (const date in spendData[year][month]) {
                const spendSum = calculateSum({ [year]: { [month]: { [date]: spendData[year][month][date] } } });
                days[date] = days[date] || { borrowSum: 0, receivedSum: 0, spendSum: 0 };
                days[date].spendSum += spendSum;
            }
        }

        for (const date in days) {
            days[date].earnedSum = days[date].receivedSum - days[date].spendSum; 
        }

        res.json({ days });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/get-detailed-summary-date/:userID/:year/:month/:date', async (req, res) => {
    const { userID, year, month, date } = req.params;

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const borrowData = JSON.parse(user.borrow || '{}');
        const receivedData = JSON.parse(user.received || '{}');
        const spendData = JSON.parse(user.spend || '{}');

        const borrowEntries = borrowData[year] && borrowData[year][month] && borrowData[year][month][date]
            ? borrowData[year][month][date]
            : [];
        const receivedEntries = receivedData[year] && receivedData[year][month] && receivedData[year][month][date]
            ? receivedData[year][month][date]
            : [];
        const spendEntries = spendData[year] && spendData[year][month] && spendData[year][month][date]
            ? spendData[year][month][date]
            : [];

        res.json({
            borrowEntries,
            receivedEntries,
            spendEntries
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/get-daily-4-summary/:userID/:year/:month', async (req, res) => {
    const { userID, year, month } = req.params;

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const borrowData = JSON.parse(user.borrow || '{}');
        const receivedData = JSON.parse(user.received || '{}');
        const spendData = JSON.parse(user.spend || '{}');

        const days = {};

        
        if (borrowData[year] && borrowData[year][month]) {
            for (const date in borrowData[year][month]) {
                const borrowSum = calculateSum({ [year]: { [month]: { [date]: borrowData[year][month][date] } } });
                days[date] = days[date] || { borrowSum: 0, receivedSum: 0, spendSum: 0 };
                days[date].borrowSum += borrowSum;
            }
        }

        
        if (receivedData[year] && receivedData[year][month]) {
            for (const date in receivedData[year][month]) {
                const receivedSum = calculateSum({ [year]: { [month]: { [date]: receivedData[year][month][date] } } });
                days[date] = days[date] || { borrowSum: 0, receivedSum: 0, spendSum: 0 };
                days[date].receivedSum += receivedSum;
            }
        }

        
        if (spendData[year] && spendData[year][month]) {
            for (const date in spendData[year][month]) {
                const spendSum = calculateSum({ [year]: { [month]: { [date]: spendData[year][month][date] } } });
                days[date] = days[date] || { borrowSum: 0, receivedSum: 0, spendSum: 0 };
                days[date].spendSum += spendSum;
            }
        }

        
        for (const date in days) {
            days[date].earnedSum = days[date].receivedSum - days[date].spendSum;
        }

        
        const dailySummaries = Object.keys(days).map(date => ({
            date,
            ...days[date]
        }));

        res.json({ dailySummaries });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/get-detailed-summary-4/:userID/:year/:month/:date', async (req, res) => {
    const { userID, year, month, date } = req.params;

    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM Finance WHERE userID = ?', [userID]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const borrowData = JSON.parse(user.borrow || '{}');
        const receivedData = JSON.parse(user.received || '{}');
        const spendData = JSON.parse(user.spend || '{}');

        const borrowSum = borrowData[year] && borrowData[year][month] && borrowData[year][month][date]
            ? calculateSum({ [year]: { [month]: { [date]: borrowData[year][month][date] } } })
            : 0;

        const receivedSum = receivedData[year] && receivedData[year][month] && receivedData[year][month][date]
            ? calculateSum({ [year]: { [month]: { [date]: receivedData[year][month][date] } } })
            : 0;

        const spendSum = spendData[year] && spendData[year][month] && spendData[year][month][date]
            ? calculateSum({ [year]: { [month]: { [date]: spendData[year][month][date] } } })
            : 0;

        const earnedSum = receivedSum - spendSum; 

        res.json({
            borrowSum,
            receivedSum,
            spendSum,
            earnedSum
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
