const http = require('http');

const express = require('express');
require('dotenv').load;

const query = require('./database');
const app = express();
const server = http.createServer(app);

query('SELECT NOW()');

app.use((req, res, next) => {
    res.send('<h1>Bienvenu sur matcha...<h1>');
});

server.listen(3000);