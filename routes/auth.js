const authRouter = require('express').Router();
const Users = require('../models/users');

authRouter.get('/checkCredentials', (req, res) => {
  const { email, password } = req.body;
  Users.findPasswordFromEmail(email)
    .then((results) => {
      console.log(results[0][0])
      if (!results[0][0]) {
        res.status(401).send('Invalid Credential')
      } else {
        Users.verifyPassword(password, results[0][0].hashedPassword)
          .then((results) => {
            if (results) {
              res.status(200).send('User credentials are valid')
            } else {
              res.status(401).send('Invalid Credential')
            }
          })
      }
    })
    .catch((err) => console.error(err))
})

module.exports = authRouter;