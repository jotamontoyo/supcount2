
    // var models = require('../models/models.js');






    exports.index = function(req, res, next) {

        res.render('support/index', {user: req.session.user, errors: []});

    };


    exports.send_mail = function(req, res) {

        console.log('user mail............: ' + req.session.user.email);
        console.log('subject............: ' + req.body.subject);



        'use strict';
        const nodemailer = require('nodemailer');

        let transporter = nodemailer.createTransport({				// create reusable transporter object using the default SMTP transport
            host: 'registrosdemantenimiento.com',
            port: 465,
            secure: true, 											// secure:true for port 465, secure:false for port 587
            auth: {
                user: 'noreply@registrosdemantenimiento.com',
                pass: process.env.NODE_SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false							// do not fail on invalid certs
            }
        });

        let mailOptions = {																						// setup email data with unicode symbols
            from: req.session.user.email,	 		               	// sender address
            to: 'support@registrosdemantenimiento.com', 															// list of receivers
            subject: req.body.subject, 								// Subject line
            text: 'Nueva solicitud de soporte.', 								// plain text body
            html: req.body.text

        };

        transporter.sendMail(mailOptions, (error, info) => {							// send mail with defined transport object
            if (error) {
                return console.log(error);
            };
            console.log('Message %s sent: %s', info.messageId, info.response);
            res.redirect('/support');
        });



    };
