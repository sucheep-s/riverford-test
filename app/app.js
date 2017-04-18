var myApp = angular.module('myApp', ['ui.router', 'myApp.templates', 'ui.bootstrap', 'ngAnimate', 'ngFileUpload']);

myApp.config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise("/readfile");

  $stateProvider
  .state('readFile', {
    url: '/readfile',
    controller: 'ReadFileController',
    templateUrl: 'views/upload.html'
  })
  .state('results',{
    url: '/results',
    controller: 'ResultsController',
    templateUrl: 'views/results.html'
  });

}]);

//set underscore configuration
var underscore = angular.module('underscore', []);

underscore.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);