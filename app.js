
	process.env.DATABASE_URL = "mysql://hlc8zs78z1roel2t:biq7tknwyoazsa2i@e7qyahb3d90mletd.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/hlfv8tuthjqlbwaa"; // URL registrosdemantenimiento.com
    // process.env.DATABASE_URL = "postgres://lvonbcovdrtbaa:b5b80cad7dc41d45cf866f832a3c3975acce458bbd76ecb026af40a37cd5f414@ec2-54-75-231-3.eu-west-1.compute.amazonaws.com:5432/dcf1adebavapbt?ssl=true";
    // process.env.DATABASE_URL = "sqlite://:@:/";           // activar para local
    process.env.DATABASE_STORAGE = "quiz.sqlite";
	process.env.PASSWORD_ENCRYPTION_KEY= "asdfghjklzxcvbnmqwertyuiop";
    process.env.NODE_SMTP_PASS = "Y3kxw4_0";


	var express = require('express');
	var busboy = require('connect-busboy');                 //middleware for form/file upload
	var path = require('path');
	var favicon = require('serve-favicon');
	var logger = require('morgan');
	var cookieParser = require('cookie-parser');
	var bodyParser = require('body-parser');
	var partials = require('express-partials');             // paquete para manejar vistas parciales del layout.ejs
	var methodOverride = require('method-override');
	var session = require('express-session');
	var routes = require('./routes/index');

	var app = express();

	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');

	app.use(partials());                                    	// instala el middleware que da soporte a vistas parciales

	app.use(favicon(__dirname + '/public/favicon.ico'));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(cookieParser('incipro'));								// semilla que llevara la cookie
	app.use(session());
	app.use(methodOverride('_method'));				// para utilizar en edit.ejs y encapsular el post como put
	app.use(busboy());
	app.use(express.static(path.join(__dirname, 'public')));

	// Helpers dinamicos:
	app.use(function(req, res, next) {
		if (!req.session.redir) {								// si no existe lo inicializa
			req.session.redir = '/';
		}
		if (!req.path.match(/\/login|\/logout|\/user/)) { 		// guardar path en session.redir para despues de logout volver a la misma vista del login
			req.session.redir = req.path;						// req.path es le path de donde se hizo el login
		}
		res.locals.session = req.session;						// Hacer visible req.session en las vistas
		next();
	});

	app.use(function(req, res, next) {
		if (req.session.user) {
			if (Date.now() - req.session.user.lastRequestTime > 60*60*1000) {
				delete req.session.user;
			} else {
				req.session.user.lastRequestTime = Date.now();
			}
		}
		next();
	});

	app.use('/', routes);
	//app.use('/users', users);

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: err,
				errors: []
			});
		});
	};

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {},
			errors: []
		});
	});


	Number.prototype.formatNumber = function(c, d, t) {
		var n = this,
			c = isNaN(c = Math.abs(c)) ? 2 : c,
			d = d == undefined ? "," : d,					// en caso de no pasar parametro d
			t = t == undefined ? "." : t,					// en caso de no pasar parametro t
			s = n < 0 ? "-" : "",							// si es negativo
			i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
			j = (j = i.length) > 3 ? j % 3 : 0;
			return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
		};


	nombreMes = function(numero_mes) {
	    var nombre_mes;
	    if (numero_mes === 1) { nombre_mes = "Enero"};
	    if (numero_mes === 2) { nombre_mes = "Febrero"};
	    if (numero_mes === 3) { nombre_mes = "Marzo"};
	    if (numero_mes === 4) { nombre_mes = "Abril"};
	    if (numero_mes === 5) { nombre_mes = "Mayo"};
	    if (numero_mes === 6) { nombre_mes = "Junio"};
	    if (numero_mes === 7) { nombre_mes = "Julio"};
	    if (numero_mes === 8) { nombre_mes = "Agosto"};
	    if (numero_mes === 9) { nombre_mes = "Septiembre"};
	    if (numero_mes === 10) { nombre_mes = "Octubre"};
	    if (numero_mes === 11) { nombre_mes = "Noviembre"};
	    if (numero_mes === 12) { nombre_mes = "Diciembre"};
	    return nombre_mes;
	};



	module.exports = app;
	// app.listen(3000);
