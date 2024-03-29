
    exports.index = function(req, res) {
        var fecha = new Date();
		var dia = ("0" + fecha.getUTCDate()).slice(-2);
		var mes = ("0" + (fecha.getUTCMonth() + 1)).slice(-2);														// se le añade 1 porque van de 0 a 11
		var anio = fecha.getUTCFullYear();
        fecha = dia + '-' + mes + '-' + anio;
        res.render('support/index', {user: req.session.user, fecha: fecha, errors: []});
    };






    exports.send_mail = function(req, res) {

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





    exports.upload = function(req, res, next) {
        var fs = require('fs-extra');
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            if (filename) {
                console.log("Uploading: " + filename);
                fstream = fs.createWriteStream('public/support_upload/' + req.session.user.username + '-' + req.session.user.centro + '-' + filename);					// Path where image will be uploaded
                file.pipe(fstream);
                fstream.on('close', function () {
                    console.log("Upload Finished of " + filename);
                    res.redirect('back');           										// where to go next
                });
            } else {
                res.render('avisos/aviso_sin_nombre', {errors: []});
            };

        });
    };
