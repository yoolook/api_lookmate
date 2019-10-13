'use strict'
const Sequelize = require('sequelize');  
const env = require('./env');  
const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {  
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  dialect: env.DATABASE_DIALECT,
  define: {
    underscored: true
  }
});
// Connect all the models/tables in the database to a db object, 
//so everything is accessible via one object
const db = {};
db.Sequelize = Sequelize;  
db.sequelize = sequelize;
//Models/tables
db.user = require('User.js')(sequelize, Sequelize);  
db.comment = require('Comments.js')(sequelize, Sequelize);  
db.appearance = require('Appearance.js')(sequelize, Sequelize);
db.rate = require('RateApp.js')(sequelize, Sequelize);
db.setting = require('Settings.js')(sequelize, Sequelize);
db.stalk = require('stalkusers.js')(sequelize, Sequelize);

//Relations
//for user
db.users.belongsTo(db.appearance);  
db.users.hasMany(db.appearance);
db.users.hasMany(db.comment);
db.users.hasMany(db.rate); 
db.users.hasMany(db.stalk);
db.users.hasOne(db.setting);

//for appearance
db.appearance.belongsTo(db.rate);  
db.appearance.hasMany(db.rate);
db.appearance.hasMany(db.comment);

module.exports = db;  