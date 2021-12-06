const authRouter = require('express').Router();
const { calculateToken } = require('../helpers/users');
const Users = require('../models/users');

authRouter.get('/checkCredentials', (req, res) => {
  const { email, password } = req.body;
  Users.findByEmail(email)
    .then((user) => {
      console.log(user)
      if (!user) {
        res.status(401).send('Invalid Credential')
      } else {
        const { hashedPassword, id } = user;
        Users.verifyPassword(password, hashedPassword)
          .then((results) => {
            if (results) {
              res.cookie('user_token', calculateToken(email, id));
              res.send();
            } else {
              res.status(401).send('Invalid Credential')
            }
          })
      }
    })
    .catch((err) => console.error(err))
})

module.exports = authRouter;