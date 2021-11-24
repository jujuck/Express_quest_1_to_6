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

usersRouter.get('/:id', (req, res) => {
  Users.findOne(req.params.id)
    .then((result) => {
      if (result[0].length) res.status(201).json(result[0]);
      else res.status(404).send('User not found');
    }).catch((err) => {
      res.send('Error retrieving data from database');
    })
});

module.exports = usersRouter;