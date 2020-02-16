const axios = require('axios')
const pool = require('./index');
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');

const SALTROUND = 10

const checkDB = async (nbr) => {
  const PASSWORD = await bcrypt.hash('Qwerty123.', SALTROUND).then(hash => hash).catch(err => console.log('error', err))
  const request = {
    name: 'get number of users',
    text: 'SELECT iduser FROM users',
  }
  pool.query(request)
    .then(data => {
      console.log(data.rowCount)
      if (data.rowCount < nbr) {
        getUsers(nbr)
          .then(data => {
            const Data = data.data.results
            Data.map(async (user, index) => {
              let photo = await axios.get(user.picture.medium, { responseType: 'arraybuffer' })
              const image = Buffer.from(photo.data).toString('base64');
              const firstname = user.name.first
              const lastname = user.name.last
              const username = user.login.username
              const dateOfBirth = user.dob.date
              const mail = user.email
              const password = PASSWORD
              const gender = user.gender === 'male' ? 'M' : 'W'
              const orientation = user.gender === 'male' ? 'W' : 'M'
              const photos = JSON.stringify({ profil: 'img1', img1: image, img2: '', img3: '', img4: '', img5: '' })
              const active = Math.floor(Math.random() * 2);
              const location = JSON.stringify(user.location.coordinates)
              const activationKey = uniqid(Date.now() + '-')

              const request = {
                name: 'Add user',
                text: 'INSERT INTO users(firstname, lastname, username, mail, password, activationkey, photos, dateofbirth, gender, orientation, active, location) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
                values: [firstname, lastname, username, mail, password, activationKey, photos, dateOfBirth, gender, orientation, active, location]
              }
              pool.query(request)
                .then(res => console.log('ajout user ', index))
                .catch(err => err)
            })
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
    .catch(err => {
      console.log('error database', err)
    })
}

const getUsers = nbUsers => {
  return axios.get(`https://randomuser.me/api/?exc=id,phone,cell,nat&nat=fr,gb,us&results=${nbUsers}`)
}



module.exports = {
  getUsers,
  checkDB,
}