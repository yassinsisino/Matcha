const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    database: process.env.DBNAME,
    max:20,
});

module.exports = pool;