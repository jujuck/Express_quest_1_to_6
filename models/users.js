const connection = require('../db-config');
const Joi = require('joi');

/**
 * Method séparée permettant la validation de la données du formulaire
 * @param {*} data (req.body)
 * @param {*} forCreation (Différences selon Post ou Update)
 * @returns
 */
const validateUsersData = (data, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return Joi.object({
    email: Joi.string().email().max(255).required(presence),
    firstname: Joi.string().max(255).required(presence),
    lastname: Joi.string().max(255).required(presence),
    city: Joi.string().allow(null, '').max(255),
    language: Joi.string().allow(null, '').max(255),
  }).validate(data, { abortEarly: false });
};

/**
 * Methode pour retrouver un user
 * @param {*} filters: { req.query}
 * @returns
 */
const findMany = ({ filters: { language } }) => {
  let query = 'SELECT * FROM users';
  let sqlValues = [];
  console.log(language)

  if (language) {
    query += ' WHERE language = ?';
    sqlValues.push(language);
  }

  return connection.promise().query(query, sqlValues)
    .then(([results]) => {
      console.log(results);
      return results;
    })
};

/**
 * Methode pour retrouver un user via son id
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
 * Method pour ajouter un user à la DB
 * @param {*} param0
 * @returns
 */
const createOne = ({ title, director, year, color, duration }) => {
  return connection.promise().query(
    'INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)',
    [title, director, year, color, duration])
    .then(([result]) => {
      const id = result.insertId;
      return { id, title, director, year, color, duration };
    })
}

/**
 * Method pour mettre à jour un user via son ID
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

module.exports = {
  findMany,
  findOne,
  validateUsersData,
  createOne,
  updateOne
}