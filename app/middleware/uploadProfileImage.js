var multer = require('multer');
var uniqid = require('uniqid');
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
        callback(null, "./ProfileImages");
    },
    filename: function (req, file, callback) {
        req.body.pictureCode=uniqid('lookmateImage');
        var fileExt = file.originalname.split('.').pop();
        callback(null, req.body.pictureCode + "." + fileExt);
    }
});

/* Here, multer accepts the storage we created in our previous step as the parameter. The function */
var upload = multer({
    storage: Storage
}).array("profileImage", 1); //Field name and max count

exports.uploadProfilePicOnFolder = async function (req, res, next) {
    upload(req, res, function (err) {
        if (err)
            res.send({
                'code':400,
                'failure':"Error:" + err
            });
        next();
    });
};


