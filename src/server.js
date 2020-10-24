const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const app = express();
const knex = require('knex');
const { handleRegister } = require('./controllers/register');
const { handleSignin } = require('./controllers/signin');
const { handleProfile } = require('./controllers/profile');
const { handleImage } = require('./controllers/image');
const { handleHome } = require('./controllers/home');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', handleHome());
app.post('/signin', handleSignin(db, bcrypt));
app.post('/register', handleRegister(db, bcrypt));
app.get('/profile/:id', handleProfile(db));
app.put('/image', handleImage(db));

app.listen(3000, () => {
  console.log('Application running on port 3000');
});
