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

/**
 * Method pour ajouter un movie à la DB
 * @param {*} param0
 * @returns
 */
const createOne = ({ title, director, year, color, duration, user_id }) => {
  return connection.promise().query(
    'INSERT INTO movies(title, director, year, color, duration, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    [title, director, year, color, duration, user_id])
    .then(([result]) => {
      const id = result.insertId;
      return { id, title, director, year, color, duration };
    })
}

/**
 * Method pour mettre à jour un movies via son ID
 * @param {*} data
 * @param {*} id
 * @returns
 */
const updateOne = (data, id) => {
  return connection.promise().query(
    'UPDATE movies SET ? WHERE id = ?',
    [data, id])
    .then((result) => result)
}

const deleteOne = (id) => {
  return connection.promise().query(
    'DELETE FROM movies WHERE id = ?',
    [id])
    .then((result) => 'Movie deleted successfully')
}

module.exports = {
  findMany,
  findOne,
  validateMoviesData,
  createOne,
  updateOne,
  deleteOne
}