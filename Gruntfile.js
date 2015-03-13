module.exports = function(grunt) {
	
	/******************************************************************
	 * 
	 *	CHANGABLE VARIABLES FOR GRUNTING FILES
	 *	
	*/
	
					// Name of HTML file to input and output
	var html = 		'superTween',	
	
		srcJS = [	// All JS to include in final file
					'Dev/_js/superTween_func.js',
				],
		srcCSS = [	// All CSS to include in final file
					'main',
				],
		buildProcess = [	// Processes to inititate on default Grunt
					'clean:build', 			// Clean working directory
					'cssmin', 				// CSS minify
					'concat:dist',	 		// JS concatenate
					'replace:logs',			// Remove logs
					'uglify', 				// JS uglify
					'targethtml', 			// HTML redirect src
					'processhtml', 			// Inline scripts
					'htmlcompressor', 		// Compress HTML
				//	'pngmin', 				// PNG compress
				//	'copy:images', 			// Directly copy images
					'copy:scripts', 		// Directly copy scripts
					'clean:temp',			// Clean temp files
				//	'environments:prod'		// Push to FTP
				//	'clean:supply', 		// Clean working directory
				//	'copy:supply', 			// Directly copy images
				//	'compress:supply', 		// Directly copy images
				],
		supplyProcess = [
					'clean:supply', 		// Clean working directory
					'copy:supply', 			// Directly copy images
					'compress:supply', 		// Directly copy images
				],
		deployProcess = [
					'environments:prod', 	// SSH to server
				],	//!NONFUNCTIONAL	
		gitProcess = [
					'clean:build', 			// Clean working directory	
					'cssmin', 				// CSS minify
					'replace:logs',			// Remove logs
					'uglify:git', 			// JS uglify
					'concat:git', 			// JS concatenate				
					'copy:git', 			// Directly copy scripts
					'targethtml', 			// HTML redirect src
					'processhtml', 			// Inline scripts
					'htmlcompressor', 		// Compress HTML
					'clean:temp',			// Clean temp files
					],
		gitJS = {
				concat: [
					'Dev/_js/superTween_prefix.js',
					'Grunt/superTween_func.js',
					'Dev/_js/superTween_eases.js'
					], 
				uglify: [
					'Dev/_js/superTween_func.js'
					]	
				}
				
					
		
	/*
	 * 
	 *	END OF VARIABLES
	 *
	*******************************************************************/
	
	// some variable processing for input and output
	var	devLoc= {'Grunt/temp2.html': 'Dev/'+html+'.html'};
	var buildLoc = {}
		buildLoc['Build/'+html+'.html'] = 'Grunt/temp.html';
	var backupImg = html+'.jpg';
	var supplyArchive = 'Supply/'+html+'.zip';
	var theCSS = sortCSS(srcCSS);
	
	
  	grunt.initConfig({
	  	
		pkg: grunt.file.readJSON('package.json'),
		
		//// AMEND HTML FILES TO LOOK TO COMPRESSED ASSETS ////
		targethtml: {
			dist: {
				files: devLoc
			}
		},
		
		//// COMPRESS THE HTML ////	
		htmlcompressor: {
			compile: {
				files: buildLoc,
				options: {
					type: 'html',
					preserveServerScript: true
				}
			}
		},
		
		//// REPLACE LOG CALLS ////
		replace: {
			logs: {
				src: 'Grunt/temp.js',       // source files array (supports minimatch) 
				dest: 'Grunt/',             // destination directory or file 
				replacements: [{
					from: 'App.log',        // string replacement 
					to: '//App.log'
				},{
					from: '//App.log = function',
					to: 'App.log = function'
				}]
			}
		},
		
		////  CLEAN THE BUILD FOLDER  ////
		clean: {
		  build: {
		    src: [ 'Build', 'Grunt' ]
		  },
		  temp: {
		    src: ["Grunt"]
		  },
		  supply: {
			src: ["Supply"] 
		  }
		},
		
		//// CSS CONCAT + MINIFICATION ////
		cssmin: {
		  	combine: {
				files: {
					'Grunt/All.min.css': theCSS[0]
				}
			}
		},
		
		//// JAVASCRIPT CONCAT ////
		concat: {
			options: {},
			dist: {
				src: srcJS,
				dest: 'Grunt/temp.js'
			},
			git: {
				src: gitJS.concat,
				dest: 'Build/superTween.min.js'
			}
		},
		
		//// JAVASCRIPT UGLIFY ////
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			git: {
				files: {
					'Grunt/superTween_func.js': gitJS.uglify
				}
			},
			dist: {
				files: {
					'Grunt/All.min.js': [
							'Grunt/temp.js'
					]
				}
			}
		},
		
		//// CONVERT JS & CSS TO INLINE ////	
		processhtml: {
			options: {
				data: {
					message: 'Hello world!'
				}
			},
			dist: {
				files: {
					'Grunt/temp.html': ['Grunt/temp2.html']
				}
			}
			/* PUT THIS IN THE HTML IF NEEDED
				<!-- build:<type>[:target] [inline] [value] -->
				...
				<!-- /build -->	
			*/
		},
		
		//// COPY FILES ////
		copy: {
			images: {
				files: [{ 
					cwd: 'Dev/_css', 
					expand: true,
					src: ['*.{jpg,svg,gif}'], 
					dest:'Build' 
				}]
			},
			scripts: {
				files: [{ 
					cwd: 'Grunt', 
					expand: true,
					src: [
						'All.min.css',
						'All.min.js'
						], 
					dest:'Build' 
				}]
			},
			git: {
				files: [{ 
					cwd: 'Grunt', 
					expand: true,
					src: [
						'All.min.css',
						'All.min.js'
						], 
					dest:'Build' 
				},{ 
					cwd: 'Dev/_js', 
					expand: true,
					src: [
						'timeline.js'
						], 
					dest:'Build' 
				}]
			},
			supply: {
				files: [{ 
					cwd: 'Dev', 
					expand: true,
					src: ['*.{jpg,svg,gif}'], 
					dest:'Supply' 
				}]
			}
		},
		
		//// COMPRESS PNGS ////
		pngmin: {
			compile: {
				options: {
					ext: '.png',                // use .png as extension for the optimized files 
					quality: '60-70',           // output quality should be between 65 and 80 like jpeg quality 
				},
				files: [{
					src: 'Dev/_css/*.png',
					dest: 'Build'
				}]
			}
		},

		//// PUSH TO SSH ////
	  	environments: {
			prod: {
				options: {
					host: /*'178.62.54.109',*/'',
					username: 'root',
					password: 'supernatural',
					port: '22',
					deploy_path: '',
					local_path: 'build',
					before_deploy: '',
					after_deploy: '',
					current_symlink: 'public_html'
				}
			}
	    },
	  	
	  	//// COMPRESS ALL FOR SUPPLY ////
		compress: {
			supply: {
				options: {
					archive: supplyArchive,
					pretty: true
				},
				files: [
					//{src: ['Grunt/'+html+'/**']}
					{expand: true, cwd: 'Build/', src: ['**'], dest: html}, // makes all src relative to cwd 

				]
			}
		},
	  	
	  	//// CONVERT ALL LESS FILES TO CSS ////
		less: {
			development: {
				options: {
					paths: ["Dev/_less/"],
					yuicompress: true
				},
				files: theCSS[1] 
			}
		},
		
		//// WATCH THE LESS FOLDER ////
		watch: {
			files: "Dev/_less/*.less",
			tasks: ["less"]
		}
	  	
	  	
	});

	grunt.loadNpmTasks('grunt-pngmin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-targethtml');
	grunt.loadNpmTasks('grunt-htmlcompressor');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-deploy');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-compress');
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	
	
	grunt.registerTask('watchLess', 'watch');
	grunt.registerTask('supply', supplyProcess);
	grunt.registerTask('deploy', deployProcess);
	
	grunt.registerTask('git', gitProcess);
	
	grunt.registerTask('default', buildProcess);
	

};


function sortCSS(elem){
	var buildCSS = [];
	var watchCSS = {};
	
	for(var i = 0; i < elem.length; i++){
		buildCSS.push("Dev/_css/"+elem[i]+".css");
		watchCSS["Dev/_css/"+elem[i]+".css"] = "Dev/_less/"+elem[i]+".less";
	}
	
	return [buildCSS, watchCSS];
}