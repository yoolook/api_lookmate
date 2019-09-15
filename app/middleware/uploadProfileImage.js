var multer = require('multer');
var uniqid = require('uniqid');
var adminConfig = require('../../config/adminConf');

//Generate a unique identifier for the image and update it in the user details database.
/* 
https://dzone.com/articles/upload-files-or-images-to-server-using-nodejs
fieldname: Field name specified in the form.
originalname: Name of the file on the user’s computer.
encoding: Encoding type of the file.
mimetype: Mime type of the file.
size: Size of the file in bytes.
destination: The folder to which the file has been saved.
filename: The name of the file in the destination.
path: The full path to the uploaded file.
buffer: A Buffer of the entire file. */

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, adminConfig.profile_image_location);
    },
    filename: function (req, file, callback) {
        req.body.pictureCode=uniqid('lookmateImage');
        var fileExt = file.originalname.split('.').pop();
        callback(null, req.body.pictureCode + "." + fileExt);
    }
});

/* Here, multer accepts the storage we created in our previous step as the parameter. The function */
const upload = multer({
    limits: {
        fileSize: adminConfig.profile_image_upload_size,
        files: adminConfig.profile_image_file_count
    },
    storage: Storage,
    fileFilter: (req, file, cb) => {
        // if the file extension is in our accepted list
        if (adminConfig.accepted_extensions_of_image.some(ext => file.originalname.endsWith("." + ext))) {
            return cb(null, true);
        }
        // otherwise, return error
        return cb(new Error('Only ' + adminConfig.accepted_extensions_of_image.join(", ") + ' files are allowed!'));
    }
}).array("profileImage", adminConfig.profile_image_file_count);


exports.uploadProfilePicOnFolder = async function (req, res, next) {
    upload(req, res, function (err) {
        if (err)
            res.send({
                'code':400,
                'failure':"Error:" + err
            });
        else
            next();
    });
};


