'use strict'
//input source [dbConfig, adminConfig]
var adminConfig = require("../config/adminConf");
const dbConfigSecret = require("./init-cache");
const dbConfig = dbConfigSecret.get('dbConfig');
console.log("DB Config", dbConfig);
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB_NAME, dbConfig.DB_USER, dbConfig.DB_PASSWORD, {
  host: dbConfig.DB_HOST,
  dialect: adminConfig.db_dialect,
  port: adminConfig.db_port,
  operatorsAliases: false,
  logging: false,
  pool: adminConfig.db_pool
})
// Connect all the models/tables in the database to a db object, 
//so everything is accessible via one object
const db = {};
db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//Models/tables
db.users = require('../app/models/User')(sequelize, Sequelize);
db.comments = require('../app/models/Comments')(sequelize, Sequelize);  
db.appearances = require('../app/models/Appearance')(sequelize, Sequelize);
db.rate = require('../app/models/RateApp')(sequelize, Sequelize);
db.settings = require('../app/models/Settings')(sequelize, Sequelize);
db.stalk = require('../app/models/stalkusers')(sequelize, Sequelize);
db.notifications = require('../app/models/Notification')(sequelize,Sequelize);

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