const http = require('http');

const express = require('express');

require('dotenv').load;

// const db = require('./database');
const app = express();
const server = http.createServer(app);
const userRoute = require('./routers/userRoute');
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/user', userRoute);


// app.use((req, res, next) => {
//     db('SELECT NOW()', (res1) => {
//         // res.write('<h1>Bienvenu sur matcha...<h1>');
//         // res.write('<h1>Bienvenu sur matcha...<h1>');
//         // res.end('<h1>Bienvenu sur matcha...<h1>');
//         res.json(res1);
//     });
// });

server.listen(3000);