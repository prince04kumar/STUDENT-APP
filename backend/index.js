import express from 'express';
import cors from 'cors';
import dbPromise from './db.js'; // Adjust path if necessary
import authRout from './Routes/auth.js'; // Adjust path if necessary
import borrowRout from './Routes/borrow.js'; // Adjust path if necessary
import expensesRout from './Routes/expenses.js'; // Adjust path if necessary
import receivedRout from './Routes/received.js'; // Adjust path if necessary
import normalsRout from './Routes/normals.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware to log requests and responses
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${JSON.stringify(req.body)}`);

    const originalSend = res.send;
    res.send = function (body) {
        console.log(`[${new Date().toISOString()}] Response sent:`, body);
        return originalSend.apply(res, arguments);
    };

    next();
});


app.use(express.json()); 
app.use(cors()); 
app.use(express.urlencoded({ extended: true })); 

// Routes
app.use('/api/auth', authRout);
app.use('/api/borrow', borrowRout);
app.use('/api/expenses', expensesRout);
app.use('/api/received', receivedRout);
app.use('/api/normals', normalsRout);

// Default route
app.get('/', (req, res) => {
    res.json({"message": "Server kaam kr raha"});
});

const PORT = process.env.PORT || 3000;

dbPromise.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
    });
}).catch(err => {
    console.error('DB Error:', err);
});
