const moviesRouter = require('express').Router();
const Movies = require('../models/movies');

moviesRouter.get('/', (req, res) => {
  const { max_duratin, color } = req.query;
  Movies.findMany({ filtter: { max_duration, color } })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error retrieving movies from databases')
    })
});

module.exports = moviesRouter;