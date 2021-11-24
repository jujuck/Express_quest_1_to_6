const connexion = require('./db-config');
const express = require('express');
const Joi = require('joi');
const app = express();
const { setupRoutes } = require('./routes');

const port = process.env.PORT || 3000;

app.use(express.json());
setupRoutes(app);

connexion.connect((err) => {
  if (err) {
    console.error('error connecting' + err.stack)
  } else {
    console.log('connected as id ' + connexion.threadId)
  }
})


// Before was the route api/movies/:id

// Before was the /api/movies route

// Before was the post route for movie

app.put("/api/movies/:id", (req, res) => {
  console.log("API / Movies / id to put")
  const movieId = req.params.id;
  const { title, director, year, color, duration } = req.body;

  const { error } = Joi.object({
    title: Joi.string().max(255),
    director: Joi.string().max(255),
    year: Joi.number().integer().min(1888),
    color: Joi.number().min(0),
    duration: Joi.number().integer().min(1),
  }).validate({ title, director, year, color, duration }, { abortEarly: false });

  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {

    connexion.promise().query(
      'SELECT * FROM movies WHERE id = ?',
      [movieId])
      .then((result) => {
        if (result[0].length) {
          console.log(req.body)
          connexion.promise().query(
            'UPDATE movies SET ? WHERE id = ?',
            [req.body, movieId])
            .then((result) => {
              res.send({ id: movieId, ...req.body })
            })
            .catch((err) => {
              res.send("Error updating the movies")
            })
        }
        else res.status(404).send('Movie not found');
      }).catch((err) => {
        res.send('Error retrieving data from database');
      })
  }
})

app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  connexion.promise().query(
    'SELECT * FROM users WHERE id = ?',
    [userId])
    .then((result) => {
      if (result[0].length) res.status(201).json(result[0]);
      else res.status(404).send('User not found');
    }).catch((err) => {
      res.send('Error retrieving data from database');
    })
});

app.get('/api/users', (req, res) => {
  let query = 'SELECT * FROM users';
  if (req.query.language) query += ' WHERE language = ?'

  connexion.promise().query(query, [req.query.language])
    .then((result) => {
      res.json(result[0]);
    }).catch((err) => {
      res.send('Error retrieving data from database');
    })
});

app.post('/api/users', (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;

  const { error } = Joi.object({
    email: Joi.string().email().max(255).required(),
    firstname: Joi.string().max(255).required(),
    lastname: Joi.string().max(255).required(),
    city: Joi.string().allow(null, '').max(255),
    language: Joi.string().allow(null, '').max(255),
  }).validate({ firstname, lastname, email, city, language }, { abortEarly: false });

  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    connexion.promise().query(
      'INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)',
      [firstname, lastname, email, city, language])
      .then((result) => {
        res.send('User successfully saved');
      })
      .catch((err) => {
        res.send('Error saving the user');
      })
  }
})

app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const { email, firstname, lastname, city, language } = req.body;

  const { error } = Joi.object({
    email: Joi.string().email().max(255),
    firstname: Joi.string().max(255),
    lastname: Joi.string().max(255),
    city: Joi.string().allow(null, '').max(255),
    language: Joi.string().allow(null, '').max(255),
  }).validate({ firstname, lastname, email, city, language }, { abortEarly: false });

  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    connexion.promise().query(
      'UPDATE users SET ? WHERE id = ?',
      [req.body, userId])
      .then((result) => {
        res.send("User updated successfully")
      })
      .catch((err) => {
        res.send("Error updating the user")
      })
  }
})

app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  connexion.promise().query(
    'DELETE FROM users WHERE id = ?',
    [userId])
    .then((result) => {
      res.send('User deleted successfully')
    })
    .catch((err) => {
      res.send("Error deleting the user")
    })
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});