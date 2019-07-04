const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    database: process.env.DBNAME,
});

function query(req) {
    pool.connect()
    .then( (client) => {
        return client.query(req)
        .then(res => {
            client.release()
            console.log(res.row[0])
        })
        .catch(err => {
            console.log('erreur requet', err)
            client.release();
        })
    })
}
module.exports = query;