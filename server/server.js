'use strict';

var Restify = require('restify');
var Logger = require('bunyan');
var zlib = require('zlib');
var tar = require('tar');
var fs = require('fs');
var Models = require('./models');

var model = new Models();
var log = new Logger({
	name: 'SpectrumServer',
	streams: [
		{
			level: 	'debug',
			stream: process.stdout
		},
		{
			level: 	'info',
			path: 	__dirname + '/logs/server.log'	
		}
	]
});
var server = Restify.createServer({name: 'SpectrumServer', log: log});

/**
 * Server Configuration
 */
server.use(Restify.bodyParser());
server.use(Restify.CORS());

/**
 * GET Services
 */
server.get('/user/list', function(req, res, next) {
	log.info('[GET] Request from %s:%s', req.connection.remoteAddress, req.connection.remotePort);
	model.User.findAll({attributes: ['username', 'email', 'user_type', 'registered']})
		.success(function(users) {
			log.info('Found %s registered user(s) in table \"spm_user\"', users.length);
			res.json(users);
		});

	return next();
});

server.get('/game/genre/list', function(req, res, next) {
	log.info('[GET] Request from %s:%s', req.connection.remoteAddress, req.connection.remotePort);
	model.GameGenre.findAll()
		.success(function(genres) {
			log.info('Found %s registered genre(s) in table \"spm_game_genre\"', genres.length);
			res.json(genres);
		});

	return next();
});

server.get('/market/list', function(req, res, next) {
	log.info('[GET] Request from %s:%s', req.connection.remoteAddress, req.connection.remotePort);
	model.Game.findAll()
		.success(function(games) {
			log.info('Found %s registered game(s) in table \"spm_game\"', games.length);

			for (var i = 0; i < games.length; i++)
				games[i].img_cover = 'data:image/png;base64,' + fs.readFileSync(games[i].img_cover, 'base64');

			res.json(games);
		});

	return next();
});

server.get('/market/add/:gameId/:username', function(req, res, next) {
	log.info('[GET] Request from %s:%s', req.connection.remoteAddress, req.connection.remotePort);
	model.Game.find(req.params['gameId'])
		.success(function(game) {
			model.User.find({where: {username: req.params['username']}})
				.success(function(user) {
					var shelf = model.Shelf.build({
						spm_game_id: req.params['gameId'],
						spm_user_id: user.id
					});

					shelf.save()
						.success(function() {
							log.info('The game %s was added successfully to %s shelf', game.name, user.username);
							res.send(1);

							return next();
						});
				})
				.error(function() {
					log.error('The username %s doesn\'t exist', req.params['username']);
					res.send(0);

					return next();
				});
		})
		.error(function() {
			log.error('The game doen\'t exist');
			res.send(0);

			return next();
		});
});

/**
 * POST Services
 */
server.post('/user/add', function(req, res, next) {
	log.info('[POST] Request from %s:%s', req.connection.remoteAddress, req.connection.remotePort);
	log.info('Processing a request for create a new account');

	if (typeof req.params['username'] === 'undefined' || 
			typeof req.params['email'] === 'undefined' ||
			typeof req.params['password'] === 'undefined') {
		log.error('Error on trying to save data in the database: undefined type');
	} else {
		var user = model.User.build({
			username	: req.params['username'],
			email		: req.params['email'],
			password	: req.params['password']
		});

		user.save()
			.success(function() {
				log.info('The new user was created successfully in the database');
			})
			.error(function() {
				log.error('Error on trying to create a new user in the database');
			});
	}

	return next();
});

server.post('/game/add', function(req, res, next) {
	log.info('[POST] Request from %s:%s', req.connection.remoteAddress, req.connection.remotePort);
	log.info('Processing a request for create a new game');

	return next();
});

server.post('/game/genre/add', function(req, res, next) {
	log.info('[POST] Request from %s:%s', req.connection.remoteAddress, req.connection.remotePort);
	log.info('Processing a request for create a new game genre');

	if (typeof req.params['name'] === 'undefined' || req.params['name'] === '') {
		log.error('Error on trying to save data in the database: undefined type');
	} else {
		var genre = model.GameGenre.build({name: req.params['name']});

		genre.save()
			.success(function() {
				log.info('The new genre was created successfully in the database');
			})
			.error(function() {
				log.error('Error on trying to create a new genre in the database');
			});
	}

	return next();
});

/**
 * DELETE Services
 */
server.del('/game/genre/remove/:id', function(req, res, next) {
	log.info('[DEL] Request from %s:%s', req.connection.remoteAddress, req.connection.remotePort);
	var genre = model.GameGenre.build({id: req.params['id']});
	var genreName;

	model.GameGenre.find(req.params['id'])
		.success(function(genre) {
			genreName = genre.name;
		})
		.error(function() {
			log.error('Error on trying to get genre name from the database');
		});

	genre.destroy()
		.success(function() {
			log.info('The genre \"%s\" was deleted successfully', genreName);
		})
		.error(function() {
			log.error('Error on trying to delete a genre from the database');
		});

	return next();
});

/**
 * Spectrum Package Manager (SPM)
 */
server.get('/developer/upload/:fileName', function(req, res, next) {
	req.on('data', function(data) {
		var uploadsPath = __dirname + '/uploads';
		var appsPath = __dirname + '/apps';
		var filePath = uploadsPath + '/' + req.params['fileName'];
		
		fs.writeFileSync(filePath, data, {'encoding': 'base64'});
		fs.createReadStream(filePath)
			.pipe(zlib.createGunzip())
			.pipe(tar.Extract({path: appsPath}))
			.on('error', function(err) {
				log.error('Error on trying to uncompress the file %s: %s', req.params['fileName'], err);
			})
			.on('end', function() {
				var folderName = req.params['fileName'].split('.')[0];
				var folderPath = appsPath + '/' + folderName;
				var settings = JSON.parse(fs.readFileSync(folderPath + '/package.json'));
				var game = model.Game.build({
					name: settings.name,
					description: settings.description,
					img_cover: folderPath + '/res/icon.png',
					img_bg: null,
					spm_game_genre_id: 1
				});

				game.save()
					.success(function() {
						log.info('The game %s has been added successfully', settings.name);
						res.end();

						return next();
					})
					.error(function() {
						log.error('Error on trying to add the game %s in the database', settings.name);
						res.end();

						return next();
					});

				log.info('The file %s has been extracted to apps folder', req.params['fileName']);
			});
		
		log.info('File %s was received with %s bytes', req.params['fileName'], data.length);
	});
});

/**
 * Start the server!
 */
server.listen(8081, function() {
	log.info('%s started at %s', server.name, server.url);
});