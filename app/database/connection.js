/* const Sequelize = require("sequelize");

const sequelize = new Sequelize("lookmate", "root", "lookmate@123", {
  host: "127.0.0.1",
  dialect: "mysql"
});

module.exports = sequelize;
global.sequelize = sequelize;   */
'use strict'
//const Sequelize = require('sequelize');  
//require('dotenv').config({path: 'yourfile.env'})

//console.log(process.env.DATABASE_NAME) 

//const env = require('./env');  

const Sequelize = require("sequelize");

const sequelize = new Sequelize("lookmate", "root", "lookmate@123", {
  host: "127.0.0.1",
  dialect: "mysql"
});

/* module.exports = sequelize;
global.sequelize = sequelize; */

/* const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {  
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  dialect: env.DATABASE_DIALECT,
  define: {
    underscored: true
  }
}); */
// Connect all the models/tables in the database to a db object, 
//so everything is accessible via one object
const db = {};
db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//Models/tables
db.users = require('../models/User')(sequelize, Sequelize);
db.comments = require('../models/Comments')(sequelize, Sequelize);  
db.appearances = require('../models/Appearance')(sequelize, Sequelize);
db.rate = require('../models/RateApp')(sequelize, Sequelize);
db.setting = require('../models/Settings')(sequelize, Sequelize);
db.stalk = require('../models/stalkusers')(sequelize, Sequelize);

//Relations
//for user
db.appearances.belongsTo(db.users);  
db.appearances.hasMany(db.users);

db.comments.belongsTo(db.users, { foreignKey: 'user_id' });  
db.users.hasMany(db.comments);
/* db.users.hasMany(db.rate); 
db.users.hasMany(db.stalk);
db.users.hasOne(db.setting); */

//for appearance
db.appearances.belongsTo(db.rate);  
db.appearances.hasMany(db.rate);

db.comments.hasMany(db.appearances);

module.exports = db;  

