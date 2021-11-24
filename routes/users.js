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
usersRouter.post('/', (req, res) => {
  const error = Users.validateUsersData(req.body);
  if (error.details) {
    res.status(422).json({ validationErrors: error.details })
  } else {
    Users.createOne(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err)
        res.send('Error saving the user');
      })
  }
})

usersRouter.put("/:id", (req, res) => {
  // Vérification de la validité de la donnée envoyée
  const error = Users.validateUsersData(req.body, false);
  if (error.details) {
    res.status(422).json({ validationErrors: error.details })
  } else {
    // Vérification si le film exist
    Users.findOne(req.params.id)
      .then((user) => {
        if (user) {
          Users.updateOne(req.body, req.params.id)
            .then((result) => {
              res.status(200).json({ ...user[0][0], ...req.body });
            });
          return;
        }
        return res.status(404).json({ msg: 'Record not found' })
      })
      .catch((err) => {
        res.status(500).send('Error updating the movie');
      })
  }
})

usersRouter.delete("/:id", (req, res) => {
  Users.deleteOne(req.params.id)
    .then((result) => {
      res.json(result);
    }).catch((err) => {
      res.send('Error deleting users from database');
    })
});

module.exports = usersRouter;