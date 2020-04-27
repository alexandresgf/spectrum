/**
 * SPM - SPECTRUM PACKAGE MANAGER
 *
 * SPM is a tool for create the necessary application structure for the projects developed to the Spectrum System.
 * Also, it serves to packing your project and send to the Spectrum Servers and be reviewed by our game masters.
 *
 * @author	Alexandre Ferreira (contato@grindsoft.com.br)
 */
'use strict';

var fs = require('fs');
var git = require('gift');
var fstream = require('fstream');
var tar = require('tar');
var zlib = require('zlib');
var http = require('http');

var SPM = function() {
	/**
	 * Private members
	 */
	var _regex = new RegExp('([^\/]+)\/?$', 'gm');
	var _fileName;
	var _username;
	var _password;
	var _host = 'http://localhost:8080';
	var _repo = git('http://github.com/grindsoft/spectrumapp.git');
	var _rootName;
	var _folderTree = [
		'/app/audio',
		'/app/img',
		'/app/js',
		'/res',
		'/res/screenshots',
		'/res/videos',
	];

	var _create = function() {
		console.info('Cloning %s into %s project folder', _repo.path, _rootName);

		git.clone(_repo.path, _rootName, function(err, repo) {
			if (err)
				throw err;

			console.info('Creating the other structure:');

			for (var it = 0; it < _folderTree.length; it++) {
				var folderName = _rootName + _folderTree[it];

				if (!fs.existsSync(folderName)) {
					if (!fs.mkdirSync(folderName))
						console.info('Creating: %s', folderName);
					else
						console.error('[ERROR] Can\'t create the following path %s, verify folder permissions!', folderName);
				} else {
					console.error('[ERROR] The folder "%s" already exist!', (folderName.split('/')).pop());
				}
			}
		});
	};

	var _sendFile = function() {
		var file = fs.statSync(_fileName);
		var input = fs.readFileSync(_fileName, {encoding: 'base64'});
		var buffer = new Buffer(input, 'base64');
		var reqConf = {
			host: 'localhost',
			port: 8081,
			path: '/developer/upload/' + _fileName,
			method: 'GET',
			headers: {
				'Authorization': _username + ':' + _password,
				'Content-Length': file.size
			}
		};
		var req = http.request(reqConf);

		req.on('finish', function() {
			console.log('Done, without errors!');
		});

		console.log('Sending file %s with %s bytes...', _fileName, file.size);
		req.write(buffer);
		req.end();
	};

	var _compress = function(appPath) {
		var output = fs.createWriteStream(_fileName);

		output.on('close', function() {
			console.log('File created successfully!');
			_sendFile();
		});

		console.log('Generating %s file...', _fileName);
		fstream.Reader({'path': appPath, 'type': 'Directory'})
			.pipe(tar.Pack())
			.pipe(zlib.Gzip())
			.pipe(output);
	};

	/**
	 * Public members
	 */
	return {
		create: function(appName) {
			_rootName = appName || 'SpectrumApp';
			_create();
		},

		publish: function(appPath, username, password) {
			_fileName = _regex.exec(appPath)[1] + '.tar.gz';
			_username = username;
			_password = password;
			_compress(appPath);
		},

		update: function() {
			// code here!
		}
	};
};

module.exports = SPM;