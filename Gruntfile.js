module.exports = function(grunt) {

	/******************************************************************
	 *
	 *	CHANGABLE VARIABLES FOR GRUNTING FILES
	 *
	*/

		// name of library
		var baseFilename = 'superTween',

		srcJS = [	// All JS to include in final file
					'src/superTween.js',
					'src/superTween_CSSPlugin.js',
					'src/superTween_360Plugin.js',
				],
		buildProcess = [	// Processes to inititate on default Grunt
					'clean:build', 			// Clean working directory
					'concat:dist',	 		// JS concatenate
					'uglify', 				// JS uglify
				];

	/*
	 *
	 *	END OF VARIABLES
	 *
	*******************************************************************/

	//helpers
	var uglify_files = {};
	uglify_files['build/' + baseFilename + '.min.js'] = 'build/' + baseFilename + '.js';


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		////  CLEAN THE BUILD FOLDER  ////
		clean: {
		  build: {
		    src: [ 'build', ]
		  },
		  temp: {
		    src: ["grunt"]
		  }
		},

		//// JAVASCRIPT CONCAT ////
		concat: {
			options: {
				banner: '/*! <%= pkg.name %> version <%= pkg.version %>. Created <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				src: srcJS,
				dest: 'build/' + baseFilename + '.js'
			}
		},

		//// JAVASCRIPT UGLIFY ////
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> version <%= pkg.version %>. Created <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: uglify_files
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', buildProcess);

};
