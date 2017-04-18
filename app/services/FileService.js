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