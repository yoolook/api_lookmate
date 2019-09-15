var multer = require('multer');
var adminConfig = require('../../config/adminConf');

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
        callback(null, adminConfig.appearance_location);
    },
    filename: function (req, file, callback) {
        var fileExt = file.originalname.split('.').pop();
        callback(null, file.fieldname + "_" + Date.now() + "_" + req.userDataFromToken.user_info.user_id + "." + fileExt);
    }
});

/* Here, multer accepts the storage we created in our previous step as the parameter. The function */
const upload = multer({
    limits: {
        fileSize: adminConfig.appearance_file_upload_size,
        files: adminConfig.appearance_file_upload_count
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
}).array("pictures", adminConfig.appearance_file_upload_count); //Field name and max count;

exports.uploadImageToServer = async function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            res.send({
                'code': 400,
                'failure': "Error:" + err
            });
        }
        else {
            var fileURL = [];
            req.files.forEach(files => {
                fileURL.push(files.path)
            });
            req.body.picture = fileURL;
            next();
        }
    });
};


