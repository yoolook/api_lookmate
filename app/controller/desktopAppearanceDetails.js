var db = require('../database/connection');

/* Get appearance details on desktop from pictureId:
- User Name
From self table:
- location of photo
- created date.
- caption

todo:
RiskLevelHere:4/5
*/
exports.getDesktopRelatedAppearanceDetails = async function (req, res) {
    console.log("get rate appearnce: " + req.params.pictureId);
    db.appearances.findOne({
        attributes: ['picture', 'location', 'caption' ,'createdAt'],
        include: [
            {
                attributes: ['nick_name','lastProfilePicId'],
                model: db.users
            }
        ],
        where: db.sequelize.and({ picture: req.params.pictureId }),
    }).then((desktopAppearanceDetails) => {
        if (desktopAppearanceDetails) {
            res.send({
                "code": 200,
                "pictureDetails": desktopAppearanceDetails,
            });

        }
    }).catch((error) => {
        res.send({
            "code": 400,
            "message": "server failed" + error
        });
    });
};