const {Pool} = require ('pg');

require('dotenv').config();

const pool = new Pool({
    host: process.env.DBHOST,
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
});

module.exports = pool;
