const http = require('http');
const cors = require('cors');
const express = require('express');

require('dotenv').load;


const app = express();
const server = http.createServer(app);
const userRoute = require('./routers/userRoute');
const editUserRoute = require('./routers/editUserRoute');
const tagsRoute = require('./routers/tagsRoute');
const likesRoute = require('./routers/likesRoute')
const matchesRoute = require('./routers/matchRoute')

const whitelist = ['http://localhost:3001'];
const corsOptions = {
  origin(origin, callback) {
    if (process.env.NODE_ENV === 'devloppement') {
      callback(null, true);
    } else if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
      // callback(new Error('Not allowed by CORS'));
    }
  },
};
// Then pass them to cors:
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/user', userRoute);
app.use('/api/edit', editUserRoute);
app.use('/api/tags', tagsRoute);
app.use('/api/likes', likesRoute);
app.use('/api/matches', matchesRoute);

app.use('/', (req, res)=>{ res.status(404).json({ code: 404, message: 'Route not found'});})

server.listen(3000);