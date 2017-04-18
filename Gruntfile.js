module.exports = function(grunt){

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      options : {
        force : true
      },
      main : ['dist', 'app/tmp', 'assets/js/app.js'],
    },

    jshint: {
      all: [ 'Gruntfile.js', 'app/*.js', 'app/**/*.js']
    },

    html2js: {
      options: {
        base: 'app',
        module: 'myApp.templates',
        singleModule: true,
        useStrict: true,
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        }
      },
      main: {
        src: [ 'app/views/*.html' ],
        dest: 'app/tmp/template.js'
      }
    },
    concat: {
      /*options: {
        separator: ';'
      },*/
      app: {
        src: [
        'app/*.js',
        'app/services/*.js',
        'app/controllers/*.js',
        'app/tmp/*.js'
         ],
        dest: 'dist/app.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'assets/js/app.js': [ 'dist/app.js' ]
        },
        options: {
          mangle: false
        }
      }
    }

  });

  // Task configuration
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');

  // Loading of tasks and registering tasks
  grunt.registerTask('build', [ 'clean', 'jshint', 'html2js', 'concat:app', 'uglify:dist']);

};
