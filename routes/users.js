const usersRouter = require('express').Router();
const Users = require('../models/users');

usersRouter.get('/', (req, res) => {
  const { language } = req.query;
  Users.findMany({ filters: { language } })
    .then((result) => {
      res.json(result);
    }).catch((err) => {
      res.send('Error retrieving users from database');
    })
})

module.exports = usersRouter;