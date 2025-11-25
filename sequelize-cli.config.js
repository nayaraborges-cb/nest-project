require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    ...require(path.resolve('dist/database/config/database.js')),
  },
  production: {
    ...require(path.resolve('dist/database/config/database.js')),
  },
};
