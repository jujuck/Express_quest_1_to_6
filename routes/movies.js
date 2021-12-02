const moviesRouter = require('express').Router();
const Movies = require('../models/movies');
const Users = require('../models/users');

moviesRouter.get('/', (req, res) => {
  const { max_duration, color } = req.query;
  console.log(color)
  Movies.findMany({ filters: { max_duration, color } })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error retrieving movies from databases')
    })
});

moviesRouter.get('/:id', (req, res) => {
  Movies.findOne(req.params.id)
    .then((result) => {
      if (result[0].length) res.status(201).json(result[0]);
      else res.status(404).send('Movie not found');
    }).catch((err) => {
      res.send('Error retrieving data from database');
    })
});

moviesRouter.post('/', (req, res) => {
  console.log("Post Movie")
  console.log(req.cookies)
  const error = Movies.validateMoviesData(req.body);
  console.log(error)
  if (error) {
    res.status(422).json({ validationErrors: error.details })
  } else {
    if (req.cookies.user_token) {
      Users.findOnebyToken(req.cookies.user_token)
        .then(result => {
          console.log(result)
          const user_id = { user_id: result[0][0].id }
          Movies.createOne({ ...req.body, ...user_id })
            .then((result) => {
              res.send(result);
            })
            .catch((err) => {
              res.send('Error saving the movie');
            })
        })
        .catch(err => console.error(err))
    } else {
      res.status(401).send('Invalid users')
    }
  }
})

moviesRouter.put("/:id", (req, res) => {
  // Vérification de la validité de la donnée envoyée
  const error = Movies.validateMoviesData(req.body, false);
  if (error) {
    res.status(422).json({ validationErrors: error.details })
  } else {
    // Vérification si le film exist
    Movies.findOne(req.params.id)
      .then((movie) => {
        if (movie) {
          existingMovie = movie;
          console.log("Updating")
          Movies.updateOne(req.body, req.params.id)
            .then((result) => {
              res.status(200).json({ ...movie[0][0], ...req.body });
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
moviesRouter.delete("/:id", (req, res) => {
  Movies.deleteOne(req.params.id)
    .then((result) => {
      res.json(result);
    }).catch((err) => {
      res.send('Error deleting movies from database');
    })
});

module.exports = moviesRouter;