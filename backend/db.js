import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


const dbPromise = open({
    filename: 'database.db',
    driver: sqlite3.Database,
    mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    verbose: true
});

dbPromise.then(db => {
    db.configure('busyTimeout', 5000);  // 5sec ka intejaar
});

export default dbPromise;
