const movies = require('./movies');

const setupRoutes = (app) => {
  app.use('api/movies', moviesRouter);
};

module.exports = {
  setupRoutes,
}