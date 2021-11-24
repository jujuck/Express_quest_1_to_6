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
    email: Joi.string().email().max(255).presence(presence),
    firstname: Joi.string().max(255).presence(presence),
    lastname: Joi.string().max(255).presence(presence),
    city: Joi.string().allow(null, '').max(255).presence('optional'),
    language: Joi.string().allow(null, '').max(255).presence('optional'),
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
    'SELECT * FROM users WHERE id = ?',
    [id])
    .then((results) => results)
}

/**
 * Method pour ajouter un user à la DB
 * @param {*} param0
 * @returns
 */
const createOne = ({ email, firstname, lastname, city, language }) => {
  return connection.promise().query(
    'INSERT INTO users (email, firstname, lastname, city, language) VALUES (?, ?, ?, ?, ?)',
    [email, firstname, lastname, city, language])
    .then(([result]) => {
      const id = result.insertId;
      return { id, email, firstname, lastname, city, language };
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
    'UPDATE users SET ? WHERE id = ?',
    [data, id])
    .then((result) => result)
}

const deleteOne = (id) => {
  return connection.promise().query(
    'DELETE FROM users WHERE id = ?',
    [id])
    .then((result) => 'User deleted successfully')
}

module.exports = {
  findMany,
  findOne,
  validateUsersData,
  createOne,
  updateOne,
  deleteOne
}