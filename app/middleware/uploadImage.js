/* Module is used for multipurpose
1. Storing images from feeed upload. (Case 1)
2. Storing images from profile picrture uploads. (case 2) */

var multer = require("multer");
var Jimp = require("jimp");
var uniqid = require("uniqid");
const infoMessages = require("../../config/info-messages");
const logger = require("../../logger");
var adminConfig = require("../../config/adminConf");

//Storage variable used for seed storage destination and name of the file.
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    if (req.body.upcode === "1")
      callback(null, adminConfig.profile_image_location);
    else callback(null, adminConfig.appearance_location);
  },
  filename: function (req, file, callback) {
    var fileExt = file.originalname.split(".").pop();
    if (req.body.upcode === "1")
      //uniqueImage: Creates a unique code here and which is used as a name of the iamge, saved into db with this name, UI needs to grab this name and use it as a profile image.
      callback(null, uniqid(adminConfig.uniqueImageCode) + "." + fileExt);
    else
      callback(
        null,
        file.fieldname +
          "_" +
          Date.now() +
          "_" +
          req.userDataFromToken.user_info.user_id +
          "." +
          fileExt
      );
  },
});

/* Here, multer accepts the storage we created in our previous step as the parameter. parameter used for both the cases
1. appearance file upload size limit is same for both the type of pictures.
2. todo: appearance_file_upload_count count should be one for profile picture. */

const upload = multer({
  limits: {
    fileSize: adminConfig.appearance_file_upload_size,
    files: adminConfig.appearance_file_upload_count,
  },
  //Get storage on the basis of request type.
  storage: storage,
  fileFilter: (req, file, cb) => {
    // if the file extension is in our accepted list
    if (
      adminConfig.accepted_extensions_of_image.some((ext) =>
        file.originalname.endsWith("." + ext)
      )
    ) {
      return cb(null, true);
    }
    // otherwise, return error
    return cb(
      new Error(
        infoMessages.ERROR_IMAGE_COUNT +
          ":" +
          adminConfig.accepted_extensions_of_image.join(", ")
      )
    );
  },
}).array("pictures", adminConfig.appearance_file_upload_count); //Field name and max count;

async function generateThumbnails(
  images,
  width,
  height = Jimp.AUTO,
  quality,
  destination
) {
  return await Promise.all(
    images.map(async (imgPath) => {
      const image = await Jimp.read(
        imgPath.destination + "/" + imgPath.filename
      );
      await image.resize(width, height);
      await image.quality(quality);
      await image.writeAsync(destination + imgPath.filename);
    })
  );
}

exports.uploadImageToServer = async function (req, res, next) {
  upload(req, res, async function (err) {
    if (err) {
      logger.error(infoMessages.ERROR_GENERAL_CATCH + " : " + error, {
        service: "upImage-*c1",
      });
      res.send({
        code: 400,
        failure: infoMessages.ERROR_GENERAL_CATCH,
      });
    } else {
      /* Before sending it to the next controller/module, we need to save it in the thumbnail folder as
            well.
            -using JIMP module (independent module) to save image as thumbnail, rest all can be deleted if found in package.json.
            */
      //generate thumbnail should run ony for case 1 not for case 2
      if (req.body.upcode === "1") var generateThumb = true;
      else
        var generateThumb = await generateThumbnails(
          req.files,
          adminConfig.thumbnail_width,
          adminConfig.thumbnail_height,
          adminConfig.thumbnail_quality,
          `${adminConfig.appearance_thumbnail_location}/`
        );
      //it just return a space, todo: get something in return if have time, although its working for time being.
      if (generateThumb) {
        var fileURL = [];
        req.files.forEach((files) => {
          fileURL.push(files.filename);
        });
        req.body.picture = fileURL;
        next();
      } else {
        logger.error(
          infoMessages.ERROR_GENERAL_CATCH + " : Thumbnail Generation Error ",
          { service: "upImage-*c2" }
        );
        res.send({
          code: 400,
          failure: infoMessages.ERROR_GENERAL_CATCH,
        });
      }
    }
  });
};
