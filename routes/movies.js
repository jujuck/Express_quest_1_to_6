const moviesRouter = require('express').Router();
const jwt_decode = require('jwt-decode');
const Movies = require('../models/movies');

moviesRouter.get('/', (req, res) => {
  const { max_duration, color } = req.query;
  if (req.cookies.user_token) {
    const { id } = jwt_decode(req.cookies.user_token)
    Movies.findMany({ filters: { max_duration, color, id } })
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error retrieving movies from databases')
      })
  } else {
    res.status(401).send('invalid users')
  }


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
  const error = Movies.validateMoviesData(req.body);
  if (error) {
    res.status(422).json({ validationErrors: error.details })
  } else {
    if (req.cookies.user_token) {
      const decodeToken = jwt_decode(req.cookies.user_token)
      console.log(decodeToken);
      if (decodeToken.id) {
        const user_id = { user_id: decodeToken.id }
        Movies.createOne({ ...req.body, ...user_id })
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            res.send('Error saving the movie');
          })
      } else {
        res.status(401).send('Invalid users')
      }
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