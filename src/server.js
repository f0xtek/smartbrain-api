const bcrypt = require('bcrypt');
const express = require('express');
const app = express();

const database = {
  users: [
    {
      id: 123,
      name: 'Luke',
      email: 'luke@example.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: 124,
      name: 'Becky',
      email: 'becky@example.com',
      password: 'woody',
      entries: 0,
      joined: new Date(),
    }
  ]
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
    res.json('Success!');
  } else {
    res.status(400).json('Username or password is incorrect');
  }
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: database.users[database.users.length - 1].id + 1,
    name,
    email,
    password: passwordHash,
    entries: 0,
    joined: new Date(),
  };
  database.users.push(newUser);
  res.status(200).json(newUser);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (Number(id) === user.id) {
      found = true;
      return res.status(200).json(user);
    }
  });
  if (!found) {
    res.status(404).json(`User with ID ${id} not found!`);
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (Number(id) === user.id) {
      found = true;
      user.entries++;
      return res.status(200).json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json(`User with ID ${id} not found!`);
  }
});

app.listen(3000, () => {
  console.log('Application running on port 3000');
});
