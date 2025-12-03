const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.SQL_DATABASE, process.env.SQL_USER, process.env.SQL_PASSWORD, {
host: process.env.SQL_HOST,
port: process.env.SQL_PORT || undefined,
dialect: process.env.SQL_DIALECT || 'mysql',
logging: false
});


module.exports = sequelize;