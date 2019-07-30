const http = require('http');

const express = require('express');

require('dotenv').load;

const app = express();
const server = http.createServer(app);
const userRoute = require('./routers/userRoute');
const editUserRoute = require('./routers/editUserRoute');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/user', userRoute);



server.listen(3000);