const connection = require('../db-config');
const Joi = require('joi');

/**
 * Method séparée permettant la validation de la données du formulaire
 * @param {*} data (req.body)
 * @param {*} forCreation (Différences selon Post ou Update)
 * @returns
 */
const validateMoviesData = (data, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return Joi.object({
    title: Joi.string().max(255).presence(presence),
    director: Joi.string().max(255).presence(presence),
    year: Joi.number().integer().min(1888).presence(presence),
    color: Joi.number().presence(presence).min(0),
    duration: Joi.number().integer().min(1).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

/**
 * Methode pour retrouver un film
 * @param {*} filters: { req.query}
 * @returns
 */
const findMany = ({ filters: { color, max_duration } }) => {
  let query = 'SELECT * FROM movies';
  let sqlValues = [];

  if (color && max_duration) {
    query += ' WHERE color = ? AND duration = ?';
    sqlValues.push(color, max_duration)
  } else if (color) {
    query += ' WHERE color = ?';
    sqlValues.push(color)
  } else if (max_duration) {
    query += ' WHERE duration < ?';
    sqlValues.push(max_duration)
  }
  return connection.promise().query(query, sqlValues)
    .then(([results]) => results)
};

/**
 * Methode pour retrouver un film via son id
 * @param {*} id (req.params)
 * @returns
 */
const findOne = (id) => {
  return connection.promise().query(
    'SELECT * FROM movies WHERE id = ?',
    [id])
    .then((results) => results)
}

const createOne = ({ title, director, year, color, duration }) => {
  return connection.promise().query(
    'INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)',
    [title, director, year, color, duration])
    .then(([result]) => {
      const id = result.insertId;
      return { id, title, director, year, color, duration };
    })
}

module.exports = {
  findMany,
  findOne,
  validateMoviesData,
  createOne
}