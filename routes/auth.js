const authRouter = require('express').Router();
const Users = require('../models/users');

authRouter.get('/checkCredentials', (req, res) => {
  const { email, password } = req.body;
  Users.findPasswordFromEmail(email)
    .then((results) => {
      console.log(results[0][0].hashedPassword)
      Users.verifyPassword(password, results[0][0].hashedPassword)
        .then((results) => {
          console.log(results)
          res.send('User credentials are valid')
        })
    })
    .catch((err) => console.error(err))
})

module.exports = authRouter;