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

/* const sequelize = new Sequelize("lookmate", "root", "lookmate@123", {
  host: "0.0.0.0:3307",
  dialect: "mysql"
}); */


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
db.settings = require('../models/Settings')(sequelize, Sequelize);
db.stalk = require('../models/stalkusers')(sequelize, Sequelize);
db.notifications = require('../models/Notification')(sequelize,Sequelize);

//Relations
//for user
//info:commented on [22-05-2020] to stop getting appearance ID when verifying user with google auth.
//db.appearances.belongsTo(db.users);  
//db.appearances.hasMany(db.users);

db.comments.belongsTo(db.users, { foreignKey: 'user_id' });  
db.users.hasMany(db.comments);


db.appearances.belongsTo(db.users, { foreignKey: 'user_id' });  
db.users.hasMany(db.appearances,{ as: 'lm_appearance', foreignKey : 'user_id', targetKey: 'user_id'});
/* db.users.hasMany(db.rate); 
db.users.hasMany(db.stalk);
db.users.hasOne(db.setting); */

//for rate
db.rate.belongsTo(db.appearances, { foreignKey: 'appearance_id' }); 
db.appearances.hasMany(db.rate, { as: 'lm_rate', foreignKey : 'appearance_id', targetKey: 'appearance_id'});

db.rate.belongsTo(db.users, { foreignKey: 'user_id',targetKey: 'user_id' }); 
db.users.hasMany(db.rate, { as: 'lm_rate', foreignKey : 'user_id', targetKey: 'user_id'});

//db.comments.hasMany(db.appearances,{ as: 'lm_comment_appearance', foreignKey : 'appearance_id', targetKey: 'appearance_id'});

//for notifications and users
db.notifications.belongsTo(db.users, { foreignKey: 'user_id',targetKey: 'user_id' }); 
db.users.hasMany(db.notifications, { as: "lm_notification_user",foreignKey: 'user_id' , targetKey: 'user_id'});
//for notifications and appearance.
db.notifications.belongsTo(db.appearances, { foreignKey: 'appearance_id',targetKey: 'appearance_id' }); 
//db.appearances.hasMany(db.notifications, { as: "lm_notification_user",foreignKey: 'user_id' , targetKey: 'user_id'});


module.exports = db;  

