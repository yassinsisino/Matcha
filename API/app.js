const http = require('http');

const express = require('express');

require('dotenv').load;

const app = express();
const server = http.createServer(app);
const userRoute = require('./routers/userRoute');
const editUserRoute = require('./routers/editUserRoute');
const tagsRoute = require('./routers/tagsRoute');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/user', userRoute);
app.use('/api/edit', editUserRoute);
app.use('/api/tags', tagsRoute);

app.use('/', (req, res)=>{ res.status(404).json({ code: 404, message: 'Route not found'});})

server.listen(3000);