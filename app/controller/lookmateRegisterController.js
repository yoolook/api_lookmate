var User = require('../models/User');
const bcrypt = require('bcryptjs');

//Operations object constructor
/* var Operation = function (operation) {
    this.nick_name = operation.nick_name;
    this.email = operation.email;
    this.password = bcrypt.hashSync(operation.password);
    this.createdAt = new Date();
    this.updatedAt = new Date();
}; */
//new register policies:
//1. Nick name would be user until someone sets it from welcome page or setting.
exports.register = function (req, res) {
    User.create({
        nick_name:"user",
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        createdAt: sequelize.fn('NOW'),
        updatedAt: sequelize.fn('NOW')
    }).then(users => {
        if (users) {
            //res.send(users);
            res.header("x-auth-token", User.generateAuthToken()).send({
                "code": 200,
                "success": "user registered sucessfully",
                "user": users.nick_name,
                "email": users.email,
                "new_user":true
            });
        } else {
            res.status(400).send('Error in insert new record');
        }
    }).catch(error => {
        res.send({
            "code": 400,
            "failed": "error ocurred" + error
        });
    });
}

