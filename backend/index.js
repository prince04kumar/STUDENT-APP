import express from 'express';
import cors from 'cors';
import dbPromise from './db.js'; // Adjust path if necessary
import authRout from './Routes/auth.js'; // Adjust path if necessary
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

// Middleware
app.use(express.json()); 
app.use(cors()); 
app.use(express.urlencoded({ extended: true })); 

// Routes
app.use('/api/auth', authRout);

// Default route
app.get('/', (req, res) => {
    res.json({"message": "Server is running"});
});

const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000

dbPromise.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
    });
}).catch(err => {
    console.error('DB Error:', err);
});
