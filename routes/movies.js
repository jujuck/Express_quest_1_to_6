const moviesRouter = require('express').Router();
const Movies = require('../models/movies');

moviesRouter.get('/', (req, res) => {
  console.log("GEt Movies")
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

module.exports = moviesRouter;