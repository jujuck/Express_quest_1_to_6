const connection = require('../db-config');

const findMany = ({ filters: { color, max_duration } }) => {
  console.log(color)
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

const findOne = (id) => {
  return connection.promise().query(
    'SELECT * FROM users WHERE id = ?',
    [id])
    .then((results) => results)
}

module.exports = {
  findMany,
  findOne
}