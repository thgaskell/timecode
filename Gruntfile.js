module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            js: {
                files: ['timecode.js', 'test/**/*.js'],
                tasks: ['test'],
                options: {
                    livereload: true,
                },
            }
        },
        jshint: {
            all: ['timecode.js']
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['test/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        }
    });

    //Load NPM tasks 
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-env');

    //Making grunt default to force in order not to break the project.
    //grunt.option('force', true);

    //Default task(s).
    grunt.registerTask('default', ['jshint']);

    //Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest']);

};
