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
