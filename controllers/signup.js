var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller');
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var randomToken = require('random-token');
const { check, validationRwsult } = require('express-validator');
const { validationResult } = require('express-validator/src');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', [check('username').notEmpty().withMessage("username is reqiured"),
check('password').notEmpty().withMessage("password is reqiured"),
check('email').notEmpty().withMessage("email is reqiured")
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    var email_status = "not_verified";
    var email = req.body.email;
    var username = req.body.username;
    db.signup(req.body.username, req.body.email, req.body.password, email_status);
    var token = randomToken(8);
    db.verify(req.body.username, email, token);
    db.getuserid(email, function (err, result) {
        var id = result[0].id;
        var output = '<p>Dear ${username},</p>'
            '<p> Thank for Sign up.Your verfication token givine below:</p >'
            '<ul>'
                '<li>User ID: ${id}</li>'
               '<li>Token: ${token}</li>'
                
           ' </ul>'
           ' <p>Verify link: <a href ="http://localhost:3000/verify">Verify</a></p>'
    ;
    var transport = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure: true,
        auth:{
            user:"tushar9837shr@gmail.com",
            pass:"Mohan@90"
        }
    });
    var mailoptions ={
        from: 'tushar9837shr@gmail.com',
        to:email,
        subject: 'Email verification',
        html: output
    };
    transporter.sendMail(mailoptions, function(err,info){
        if(err){
            return console.log(err);
        }
        console.log(info);
    });
    res.send('Check your email for token to verify')
})
});

module.exports=router; 