const dbConfig = require('../Initialize/initialize-secrets'); //Getting values from secrets.
const { env } = require('process');
var adminConfig = require('./adminConf');
/* module.exports = {
    HOST: dbConfig.dbConfigSecret.DB_HOST || env.DB_HOST || process.env.DB_HOST,
    USER: dbConfig.dbConfigSecret.DB_USER || env.DB_USER || process.env.DB_USER,
    PASSWORD: dbConfig.dbConfigSecret.DB_PASSWORD || env.DB_PASSWORD || process.env.DB_PASSWORD,
    DB: dbConfig.dbConfigSecret.DB_NAME || env.DB_NAME || process.env.DB_NAME,
    port: adminConfig.db_port || env.DB_PORT || process.env.DB_PORT,
    dialect: adminConfig.db_dialect,
    pool: adminConfig.db_pool
  }; */


  //In case secrets are not working:
/*   module.exports = {
    HOST: env.DB_HOST || process.env.DB_HOST,
    USER: env.DB_USER || process.env.DB_USER,
    PASSWORD: env.DB_PASSWORD || process.env.DB_PASSWORD,
    DB: env.DB_NAME || process.env.DB_NAME,
    port: env.DB_PORT || process.env.DB_PORT,
    dialect: adminConfig.db_dialect,
    pool: adminConfig.db_pool
  }; */