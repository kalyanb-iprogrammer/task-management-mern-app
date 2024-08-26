const { Sequelize, Op, DataTypes, QueryTypes } = require('sequelize');

require('dotenv').config({ path: '.env' });

const operatorsAliases = {
    $or   : Op.or,
    $eq   : Op.eq,
    $lt   : Op.lt,
    $gt   : Op.gt,
    $lte  : Op.lte,
    $gte  : Op.gte,
    $ne   : Op.ne,
    $like : Op.like,
    $not  : Op.not,
    $in   : Op.in,
    $nin  : Op.nin,
    $and  : Op.and
  }

const sequelize = new Sequelize(process.env.MYSQL_DBNAME, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
   //  logging: console.log, // uncomment on development
    operatorsAliases: operatorsAliases,
    pool: {
      max: 5, // Maximum number of connections in the pool
      min: 0, // Minimum number of connections in the pool
      acquire: 30000, // Maximum time (in milliseconds) to wait for a connection to be acquired
      idle: 10000 // Maximum time (in milliseconds) for a connection to be idle before being released
    }
})

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

 module.exports = {
    sequelize,
    QueryTypes,
    DataTypes,
    Sequelize
 }