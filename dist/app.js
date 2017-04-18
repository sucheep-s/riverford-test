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
myApp.factory('FileService', function($http){

	var factory = {};

  var fileObj = {};

  factory.setFile = function(obj){

    fileObj = obj;

  };

  factory.getFile = function(obj){

    return fileObj;

  };

	return factory;

});
myApp.controller('ResultsController', function($scope, $state, FileService){

	$scope.init = function(){

		//redirect if there is no file
		if(_.isEmpty(FileService.getFile())){

			$state.go('readFile');

		}else{

			$scope.file = FileService.getFile();
			
			$scope.mode = '';

			$scope.mostCommonLetter = '';
			console.log($scope.file);
			//Set String Mode
			if($scope.file.mode.length > 1){

				$scope.file.mode.forEach(function(obj, idx){

					if(idx === $scope.file.mode.length-1 ){
						$scope.mode += obj.wordCount.toString();
					}else{
						$scope.mode += obj.wordCount.toString() + ', ';
					}

				});		

			}else{

				$scope.mode += $scope.file.mode[0].wordCount.toString();

			}
			$scope.mode += '  ( ' + $scope.file.mode[0].count.toString() + ' times )';

			//Set String Most Common Letter
			if($scope.file.mostCommonLetter.length > 1){

				$scope.file.mostCommonLetter.forEach(function(obj, idx){

					if(idx === $scope.file.mostCommonLetter.length-1 ){
						$scope.mostCommonLetter += obj.letter;
					}else{
						$scope.mostCommonLetter += obj.letter + ', ';
					}

				});		

			}else{

				$scope.mostCommonLetter += $scope.file.mostCommonLetter[0].letter.toString();

			}
			$scope.mostCommonLetter += '  ( ' + $scope.file.mostCommonLetter[0].count.toString() + ' letters )';

		}

	};

	$scope.newFile = function(){

		$state.go('readFile');

	};

});

myApp.controller('ReadFileController', function($scope, $state, $timeout, Upload, FileService){

	$scope.fileIsNotUploaded = true; //set collapsed 
  $scope.cssLoader = false; //hide loading
  $scope.showSelectFile = true; //show select file button

  $scope.$watch('file', function () {
    if(typeof $scope.file !== 'undefined') {
        $scope.fileIsNotUploaded = false; //to show collapsed animation
    }
  });

	$scope.uploadFile = function(file){

		//uploading file by ng-file-upload
		if(!file.$error){

			Upload.upload({

          url: '/api/upload',
          data: {
            file: file
          }

      }).then(function (resp) {

          FileService.setFile(resp.data);
          $timeout(function () {
            $state.go('results');
          }, 2000);          
          
      }, function (resp) {

          console.log('Error status: ' + resp.status);

      }, function (evt) {

          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          $scope.showSelectFile = false;
          $scope.fileIsNotUploaded = true;
          $scope.cssLoader = true;

      });

		}

	};	  

});

angular.module('myApp.templates', []).run(['$templateCache', function ($templateCache) {
  "use strict";
  $templateCache.put("views/results.html",
    "<div class=container ng-init=init()><div class=result_header><h1>RESULTS</h1></div><div class=table-responsive><table class=\"table table_result\"><tr><td class=result_title>Word Count :</td><td class=result_value>{{file.wordCount}}</td></tr><tr><td class=result_title>Line Count :</td><td class=result_value>{{file.lineCount}}</td></tr><tr><td class=result_title>Mean :</td><td class=result_value>{{file.mean}}</td></tr><tr><td class=result_title>Mode :</td><td class=result_value>{{mode}}</td></tr><tr><td class=result_title>Median :</td><td class=result_value>{{file.median}}</td></tr><tr><td class=result_title>Most Common Letter :</td><td class=result_value>{{mostCommonLetter}}</td></tr></table></div><div class=\"row row_reselect_file\"><div class=col-md-12><button class=\"btn btn_reselect_file\" ng-click=newFile()>SELECT A NEW FILE</button></div></div></div>");
  $templateCache.put("views/upload.html",
    "<div class=container><div class=\"row row_select_file\" ng-show=showSelectFile><div class=col-md-12><button class=\"btn btn_select_file\" ngf-select ng-model=file ngf-multiple=false ngf-pattern=\"'text/*'\" ngf-accept=\"'text/*'\" ngf-max-size=20MB>Select File</button></div></div><section class=file_details uib-collapse=fileIsNotUploaded><div class=table-responsive><table class=\"table table_result\"><tr><td class=result_title>File Name :</td><td class=result_value>{{file.name}}</td></tr><tr><td class=result_title>File Size :</td><td class=result_value>{{ file.size?((file.size)/1024).toFixed(2)+'KB':''}}</td></tr><tr><td class=result_title>File Type :</td><td class=result_value>{{file.type}}</td></tr></table></div><div class=\"row row_btn_upload\"><div class=col-md-12><button class=\"btn btn-success btn_upload\" ng-click=uploadFile(file)>Read File</button></div></div></section><div class=loader ng-show=cssLoader>Loading...</div></div>");
}]);
