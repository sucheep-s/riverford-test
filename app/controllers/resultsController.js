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
