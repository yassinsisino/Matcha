const http = require('http');

const express = require('express');
require('dotenv').config();

const db = require('./database');
const app = express();
const server = http.createServer(app);


// const client  = db.connect()
// .then (() => {
//     const res = client.query('SELECT NOW()')
//     .then (() => {
//         console.log(res);
//         client.release();
//     })

// })

app.use((req, res, next) => {
    res.send('<h1>Bienvenu sur matcha...<h1>');
    console.log(process.env.DBHOST);
});

server.listen(3000);