module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 5
        },
        files: [{
           expand: true,
           cwd: "theme-app-extension/assets",
           src: ["**/*.{png,jpg,gif,ico}"],
           dest: "theme-app-extension/assets"
        }]
      }
    },
    uglify: {
      dist: {
        options: {
           sourceMap: false,
           banner: "/*! Copyright: https://apps.shopify.com/partners/maggicart */"
        },
        files: [{
          expand: true,
          // cwd: "",
          src: ["*.js", '!*.min.js', '!Gruntfile.js'],
          // dest: "",
          ext: '.min.js'
        }]
      }
    },
    cssmin: {
      dist: {
        options: {
           banner: "/*! Copyright: https://apps.shopify.com/partners/maggicart */"
        },
        files: [{
          expand: true,
          // cwd: "",
          src: ["*.css", '!*.min.css'],
          // dest: "",
          ext: '.min.css'
        }]
      }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-imagemin");
  // grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-uglify-es");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.file.setBase('./');
  grunt.registerTask("default", ["imagemin", "uglify", "cssmin"]);
};