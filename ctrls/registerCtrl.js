mcApp.controller('registerCtrl', function($scope, $rootScope, $http, $state, $cookies, InputService) {
	console.log('registerCtrl');
	if ($rootScope.loggedIn == 0) {
		$state.go('login');
	}

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
		if (($scope.nfc == "") || ($scope.nfc == undefined)) {
			$scope.newUser.nfc = "";
		} else {
			$scope.newUser.nfc = $scope.nfc;
		}
		//Scanned NFC or not
		if ($scope.scanned == 1) {
			$scope.newUser.nfc = $scope.nfcScanned;
		}

		//Convert Date 
		var dob = $scope.dob;
		$scope.newUser.dob = dob.getUTCFullYear() + '-' + ('00' + (dob.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + dob.getUTCDate()).slice(-2);
		//get dob as string (yyyy-mm-dd)
		// var dobYrStr;
		// var dobMoStr;
		// var dobDtStr;
		// if ($scope.dobYr == undefined) {
		// 	dobYrStr = '1000';
		// } else {
		// 	dobYrStr = $scope.dobYr.toString();
		// }
		// if ($scope.dobMo == undefined) {
		// 	dobMoStr = '01';
		// } else {
		// 	dobMoStr = $scope.dobMo.toString();
		// }
		// if ($scope.dobDt == undefined) {
		// 	dobDtStr = '01';
		// } else {
		// 	dobDtStr = $scope.dobDt.toString();
		// }

		// if (dobMoStr.length === 1) {
		// 	dobMoStr = "0" + dobMoStr;
		// 	console.log("dobMo: " + dobMoStr);
		// }
		// if (dobDtStr.length === 1) {
		// 	dobDtStr = "0" + dobDtStr;
		// 	console.log("dobDt: " + dobDtStr);
		// }
		// $scope.newUser.dob = dobYrStr + "-"
		//  + dobMoStr + "-" + dobDtStr;

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
			$cookies.putObject('newUser', rspns.data.user);
			if (rspns.data.nfc !== null) {
				$cookies.putObject('newNfc', rspns.data.nfc);
			}
			if (rspns.data.pob !== null) {
				$cookies.putObject('pob', rspns.data.pob);
			}
			if (rspns.data.parents !== null) {
				$cookies.putObject('parents', rspns.data.parents);
			}
			$state.go('home.user_registered');
		}, function fail(rspns) {
			console.log(rspns);
			alert('Please try again.');
		});
	};


});