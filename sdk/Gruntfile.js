module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			dist: {
				src: [
					'src/Intro.js',
					'src/Spectrum.js',
					'src/Gamepad.js',
					'src/Outro.js'
				],
				dest: 'build/<%= pkg.name %>-<%= pkg.version %>.js'
			}
		},
		jshint: {
			options: {
				predef: [
					'input'
				]
			},
			dist: {
				src: 'build/<%= pkg.name %>-<%= pkg.version %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> build generated at <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'build/<%= pkg.name %>-<%= pkg.version %>.js',
				dest: 'build/<%= pkg.name %>-<%= pkg.version %>.min.js'
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['concat', 'jshint', 'uglify']);
};