const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const app = express();
const knex = require('knex');

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

app.get('/', (req, res) => {
  res.redirect('/signin');
});

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => res.json(user[0]))
          .catch(err => res.status(500).json('Unable to retrieve user'));
      } else {
        res.status(400).json('Username or password incorrect');
      }
    })
    .catch(err => res.status(400).json('Username or password incorrect'));
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  db.transaction(trx => {
    trx.insert({
      hash: passwordHash,
      email: email,
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*') // return the inserted user to the caller
        .insert({
          name,
          email: loginEmail[0],
          joined: new Date(),
        })
        .then(user => res.json(user[0]))
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => {
      res.status(400).json('Unable to register.')
    });
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user);
      } else {
        res.status(404).json('User not found.')
      }
    })
    .catch(err => res.status(500).json('Error getting user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('Unable to get entries'));
});

app.listen(3000, () => {
  console.log('Application running on port 3000');
});
