"use strict";
Error.stackTraceLimit = 100;
var astPasses = require("./ast_passes.js");

module.exports = function( grunt ) {
    var isCI = !!grunt.option("ci");

    var license;
    function getLicense() {
        if( !license ) {
            var fs = require("fs");
            var text = fs.readFileSync("LICENSE", "utf8");
            text = text.split("\n").map(function(line, index){
                return " * " + line;
            }).join("\n")
            license = "/**\n" + text + "\n */\n";
        }
        return license
    }

    function writeFile( dest, content ) {
        grunt.file.write( dest, content );
        grunt.log.writeln('File "' + dest + '" created.');
    }

    var gruntConfig = {};

    var getGlobals = function() {
        var fs = require("fs");
        var file = "./src/constants.js";
        var contents = fs.readFileSync(file, "utf8");
        var rconstantname = /CONSTANT\(\s*([^,]+)/g;
        var m;
        var globals = {
            "console": false,
            "require": false,
            "module": false,
            "define": false
        };
        while( ( m = rconstantname.exec( contents ) ) ) {
            globals[m[1]] = false;
        }
        return globals;
    }

    gruntConfig.pkg = grunt.file.readJSON("package.json");

    gruntConfig.jshint = {
        all: {
            options: {
                globals: getGlobals(),

                "bitwise": false,
                "camelcase": true,
                "curly": true,
                "eqeqeq": true,
                "es3": true,
                "forin": true,
                "immed": true,
                "latedef": false,
                "newcap": true,
                "noarg": true,
                "noempty": true,
                "nonew": true,
                "plusplus": false,
                "quotmark": "double",
                "undef": true,
                "unused": true,
                "strict": false,
                "trailing": true,
                "maxparams": 7,
                "maxlen": 80,

                "asi": false,
                "boss": true,
                "eqnull": true,
                "evil": true,
                "expr": false,
                "funcscope": false,
                "globalstrict": false,
                "lastsemic": false,
                "laxcomma": false,
                "laxbreak": false,
                "loopfunc": true,
                "multistr": true,
                "proto": false,
                "scripturl": true,
                "smarttabs": false,
                "shadow": true,
                "sub": true,
                "supernew": false,
                "validthis": true,

                "browser": true,
                "jquery": true,
                "devel": true,


                '-W014': true,
                '-W116': true,
                '-W106': true,
                '-W064': true,
                '-W097': true
            },

            files: {
                src: [
                    "./src/deque.js"
                ]
            }
        }
    };

    if( !isCI ) {
        gruntConfig.jshint.all.options.reporter = require("jshint-stylish");
    }

    gruntConfig.bump = {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        false: true,
        pushTo: 'master',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
      }
    };

    grunt.initConfig(gruntConfig);
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bump');


    grunt.registerTask( "build", function() {
        var fs = require("fs");
        var CONSTANTS_FILE = "./src/constants.js";

        astPasses.readConstants(fs.readFileSync(CONSTANTS_FILE, "utf8"), CONSTANTS_FILE);
        var fileNames = ["deque.js"];
        fileNames.forEach(function(fileName){
            var src = fs.readFileSync("./src/" + fileName, "utf8");
            src = astPasses.removeComments(src, fileName);
            src = astPasses.expandConstants(src, fileName);
            src = getLicense() + src;
            writeFile("./js/" + fileName, src);
        });
    });

    grunt.registerTask( "testrun", function() {
        var fs = require("fs");
        var done = this.async();
        var Mocha = require("mocha");

        var mochaOpts = {
            reporter: "spec",
            timeout: 500,
            slow: Infinity
        };

        var mocha = new Mocha(mochaOpts);

        fs.readdirSync("./test").forEach(function(fileName) {
            mocha.addFile("./test/" + fileName);
        });

        mocha.run(function(err){
            if( err ) {
                process.stderr.write(test.title + "\n" + err.stack + "\n");
                done(err);
            }
            else {
                done();
            }
        }).on( "fail", function( test, err ) {
            process.stderr.write(test.title + "\n" + err.stack + "\n");
            done(err);
        });
    });

    grunt.registerTask( "test", ["jshint", "build", "testrun"] );
    grunt.registerTask( "default", ["jshint", "build"] );

};
