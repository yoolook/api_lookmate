var multer = require('multer');
var adminConfig = require('../../config/adminConf');
var Jimp = require('jimp');

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

async function generateThumbnails(images, width, height = Jimp.AUTO, quality, destination) {
    return await Promise.all(
        images.map(async imgPath => {
            const image = await Jimp.read(imgPath.destination + "/" + imgPath.filename);
            await image.resize(width, height);
            await image.quality(quality);
            await image.writeAsync(destination + imgPath.filename);
        })
    );
};

exports.uploadImageToServer = async function (req, res, next) {
    upload(req, res, async function (err) {
        if (err) {
            res.send({
                'code': 400,
                'failure': "Error:" + err
            });
        }
        else {
            /* Before sending it to the next controller/module, we need to save it in the thumbnail folder as
            well.
            -using JIMP module (independent module) to save image as thumbnail, rest all can be deleted if found in package.json.
            */  
            var generateThumb = await generateThumbnails(req.files, 200, 200, 20, `${adminConfig.appearance_thumbnail_location}/`);
            //it just return a space, todo: get something in return if have time, although its working for time being.
            if (generateThumb) {
                var fileURL = [];
                req.files.forEach(files => {
                    fileURL.push(files.filename)
                });
                req.body.picture = fileURL;
                next();
            } else {
                console.log("Error in producing thumbnail");
                res.send({
                    'code': 400,
                    'failure': "Could not generate thumbnails."
                });
            }
        }
    });
};


