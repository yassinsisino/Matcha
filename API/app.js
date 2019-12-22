const http = require('http');
const cors = require('cors');
const express = require('express');

require('dotenv').load;


const app = express();
const server = http.createServer(app);
const userRoute = require('./routers/userRoute');
const editUserRoute = require('./routers/editUserRoute');

const whitelist = ['http://localhost:3001'];
const corsOptions = {
  origin(origin, callback) {
    if (process.env.NODE_ENV === 'devloppement') {
      callback(null, true);
    } else if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
// Then pass them to cors:
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/user', userRoute);
app.use('/api/edit', editUserRoute);



server.listen(3000);