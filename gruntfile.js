'use strict';
var fs_ = require("fs");
var path_ = require("path");

function walkSync(folder, excludes) {
	var ex = excludes || [];
	var items = [];
	fs_.readdirSync(folder).forEach(function (f) {
		if (ex.indexOf(f) >= 0) return;
		var fullPath = folder + "/" + f;
		var stat = fs_.statSync(fullPath);
		items.push({ name: f, stat: stat });
		if (stat.isDirectory()) {
			walkSync(fullPath, null).forEach(function (_) {
				_.name = f + "/" + _.name;
				items.push(_);
			});
		}
	});
	return items;
}


function tsc2Grunt(tsConfig) {
	var tscOptions = tsConfig.compilerOptions;

	// convert outDir option to Grunt-ts style options
	var gruntTSC = { options: tscOptions };
	if (tscOptions.outDir != null) {
		gruntTSC.files = {};
		gruntTSC.files[tscOptions.outDir] = tsConfig.files;
	} else {
		gruntTSC.src = tsConfig.files;
	}

	return gruntTSC;
}
function endsWithIgnoreCase(str, suffix) {
	return str != null && suffix != null
		&& str.length >= suffix.length
		&& str.substr(str.length - suffix.length).toUpperCase() == suffix.toUpperCase();
}

function startsWithIgnoreCase(str, prefix) {
	return str != null && prefix != null
		&& str.length >= prefix.length
		&& str.substr(0, prefix.length).toUpperCase() == prefix.toUpperCase();
}

function isTS(path) {
	return path != null && endsWithIgnoreCase(path, ".ts") && !endsWithIgnoreCase(path, ".d.ts");
}

module.exports = function (grunt) {

	grunt.log.debug('Read tsconfig.json from current project directory!');
	var tsConfig = grunt.file.readJSON('tsconfig.json');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		ts: {
			default: tsc2Grunt(tsConfig)
		},

		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					quiet: false,
					clearRequireCache: false,
					timeout: 100000
				},
				src: ['test/**/*.js']
			}
		}
	});

	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask("default", ["ts:default"]);
	grunt.registerTask("build", ["ts:default", "mochaTest:test"]);
}