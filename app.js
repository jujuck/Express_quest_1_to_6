const express = require('express');
const app = express();
const { setupRoutes } = require('./routes');

const port = process.env.PORT || 3000;

app.use(express.json());
setupRoutes(app);

// Before was the route api/movies/:id

// Before was the /api/movies route

// Before was the post route for movie

// Before was the put route for movies

// Before was the all theusers route

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});