mcApp.controller('registerCtrl', function($scope, $rootScope, $http, $state, $cookies, InputService) {
	if ($rootScope.loggedIn == 0) {
		$state.go('login');
	}
	$cookies.remove('newUser');
	$cookies.remove('newNfc');
	$cookies.remove('pob');
	$cookies.remove('parents');

	$scope.previewReady = 0;
	$scope.enterPOB = 0;
	$scope.enterParents = 0;
	$scope.newUser = {
		'nfc': "", 'mname': "", 'race': "",
		'hasPOB': 0, 'hasParents': 0
	};
	$scope.parents = {'father': "", 'mother': ""};
	$scope.pob = {'hospital': "", 'city': "", 'county': "", 'state': ""};
		
	$scope.openPOB = function() {
		if ($scope.enterPOB == 0) {
			$scope.enterPOB = 1;
		} else {
			$scope.enterPOB = 0;
		}
	};

	$scope.openParents = function() {
		if ($scope.enterParents == 0) {
			$scope.enterParents = 1;
		} else {
			$scope.enterParents = 0;
		}
	}
	// $scope.previewPhoto = function() {
	// 	var img = document.getElementById('preview');
	// 	console.log(img);
	// 	var reader = new FileReader();
	// 	reader.readAsDataURL(photo);
	// 	reader.onload = function() {
	// 		console.log(reader.result);
	// 		img.innerHTML = "<img src=" + reader.result + ">"
	// 		$scope.previewReady = 1;
	// 	}
	// };

	$scope.register = function(file) {
		//NFC exists or not
		if (($scope.nfc == "") || ($scope.nfc == undefined)) {
			$scope.newUser.nfc = "";
		} else {
			$scope.newUser.nfc = $scope.nfc;
		}

		//Convert Date 
		var dob = $scope.dob;
		$scope.newUser.dob = dob.getUTCFullYear() + '-' + ('00' + (dob.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + dob.getUTCDate()).slice(-2);
		//POB entered
		if ($scope.enterPOB) {
			$scope.newUser.hasPOB = 1;
			$scope.newUser.pob = $scope.pob;
		}
		//Parents Name entered
		if ($scope.enterParents) {
			$scope.newUser.hasParents = 1;
			$scope.newUser.parents = $scope.parents;
		}
		//hasID value
		if ($scope.hasID == true) {
			$scope.newUser.hasID = 1;
		} else {
			$scope.newUser.hasID = 0;
		}

		//photo
		var photo = document.getElementById('file').files[0];
    console.log(photo);
    if (photo == undefined) {
    	$scope.newUser.photo = "";
    	console.log($scope.newUser);
			InputService.registerUser($scope.newUser)
			.then(function success(rspns) {
				console.log(rspns);
				$cookies.putObject('newUser', rspns.data.user);
				if (rspns.data.nfc !== "") {
					$cookies.putObject('newNfc', rspns.data.nfc);
				}
				if (rspns.data.pob !== "") {
					$cookies.putObject('pob', rspns.data.pob);
				}
				if (rspns.data.parents !== "") {
					$cookies.putObject('parents', rspns.data.parents);
				}
				$state.go('home.user_registered');
			}, function fail(rspns) {
				console.log(rspns);
				alert('Please try again.');
			});
    } else {
    	 if (photo.size > 1000000) {
	    	alert('It exceeds the size limit (1MB)');
	    } else {
	    	var reader = new FileReader();
		    reader.readAsDataURL(photo);
		    reader.onload = function() {
		      console.log(reader.result);
		      $scope.newUser.photo = reader.result;
		     
		    	console.log($scope.newUser);
					InputService.registerUser($scope.newUser)
					.then(function success(rspns) {
						console.log(rspns);
						if (rspns.data.user[8] !== "") {
							rspns.data.user[8] = "Uploaded";
						} else {
							rspns.data.user[8] = "N/A";
						}
						$cookies.putObject('newUser', rspns.data.user);
						if (rspns.data.nfc !== "") {
							$cookies.putObject('newNfc', rspns.data.nfc);
						}
						if (rspns.data.pob !== "") {
							$cookies.putObject('pob', rspns.data.pob);
						}
						if (rspns.data.parents !== "") {
							$cookies.putObject('parents', rspns.data.parents);
						}
						$state.go('home.user_registered');
					}, function fail(rspns) {
						console.log(rspns);
						alert('Please try again.');
					});
		    };
		    reader.onerror = function(error) {
		      console.log('Error: ', error);
		    };
	    }
    }
   
		
	};


});