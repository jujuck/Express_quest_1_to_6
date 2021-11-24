const connection = require('../db-config');

const findMany = ({ filters: { color, max_duration } }) => {
  let query = 'SELECT * FROM movies';
  let value = [];

  if (color && max_duration) {
    query += ' WHERE color = ? AND duration = ?';
    value.push(color, max_duration)
  } else if (color) {
    query += ' WHERE color = ?';
    value.push(color)
  } else if (max_duration) {
    query += ' WHERE duration < ?';
    value.push(max_duration)
  }
  return connection.promise().query(query, sqlValues).then(([results]) => results);
};

module.exports = {
  findMany
}