mcApp.controller('nfc_register_formCtrl', function($scope, $rootScope, $cookies, $state, AuthService, InputService) {
	$scope.registered = 0;

	$scope.admin = $cookies.getObject('admin');
	console.log($scope.admin);
	$scope.nfc_tag_id = $rootScope.nfc_tag_id;
	
	$scope.logOut = function() {
		console.log($scope.admin);
		AuthService.logOut($scope.admin[0])
		.then(function success(rspns) {
			if (rspns == true) {
				$cookies.remove('admin');
				$state.go('register_nfc.login');
			} else {
				alert("Please try again.");
			}
		}, function fail(rspns) {
			console.log(rspns);
			alert("Please try again.");
		});
	};

	$scope.enterPOB = 0;
	$scope.enterParents = 0;
	$scope.newUser = {
		'nfc': "", 'mname': "", 'race': "",
		'hasPOB': 0, 'hasParents': 0
	};
	$scope.parents = {'father': "", 'mother': ""};
	$scope.pob = {'hospital': "", 'city': "", 'county': "", 'state': ""};

	$scope.register = function() {
		//NFC exists or not
		$scope.newUser.nfc = $scope.nfc_tag_id;

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
		
		console.log($scope.newUser);
		InputService.registerUser($scope.newUser)
		.then(function success(rspns) {
			console.log(rspns);
			$scope.userRegistered = rspns.data.user;
			if (rspns.data.nfc !== "") {
				$scope.newNfc = rspns.data.nfc;
			}
			if (rspns.data.pob !== "") {
				$scope.newPob = rspns.data.pob;
				$scope.withPOB = 1;
			} else {
				$scope.withPOB = 0;
			}
			if (rspns.data.parents !== "") {
				$scope.newParents = rspns.data.parents;
				$scope.withParents = 1;
			} else {
				$scope.withParents = 0;
			}
			$scope.registered = 1;
		}, function fail(rspns) {
			console.log(rspns);
			alert('Please try again.');
		});
	};
});