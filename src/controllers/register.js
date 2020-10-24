const handleRegister = (db, bcrypt) => async (req, res) => {
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
        .catch(console.error);
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => {
      res.status(400).json('Unable to register.')
    });
};

module.exports = {
  handleRegister,
}