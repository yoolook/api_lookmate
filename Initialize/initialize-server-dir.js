
var fs = require('fs');
var adminConfig = require('../config/adminConf');
function intializeLookmateDirectories() {
  if (!fs.existsSync(adminConfig.appearance_location)) {
    fs.mkdirSync(adminConfig.appearance_location);
  }

  if (!fs.existsSync(adminConfig.appearance_thumbnail_location)) {
    fs.mkdirSync(adminConfig.appearance_thumbnail_location);
  }

  if (!fs.existsSync(adminConfig.profile_image_location)) {
    fs.mkdirSync(adminConfig.profile_image_location);
  }
}

module.exports = intializeLookmateDirectories();

