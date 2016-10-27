mcApp.controller('nfc_registerCtrl', function($scope, $rootScope, $cookies, $state, $stateParams, AuthService) {
	console.log('nfc_registerCtrl');
	console.log($stateParams.nfc_tag_id);
	$scope.adminIn = 0;
	if ($cookies.getObject('admin')) {
		console.log('you are logged in');
		$scope.msg = "Hi, " + $cookies.getObject('admin')[3];
		$scope.adminIn = 1;
		$state.go('register_nfc.register');
	} else {
		$scope.msg = "Please log in.";
		$state.go('register_nfc.login');
	}

	$scope.nfc_tag_id = $stateParams.nfc_tag_id;

	$scope.logIn = function() {
		AuthService.logIn($scope.adminName, $scope.password)
		.then(function success(rspns) {
			if (rspns == true) {
				$state.go('register_nfc.register');
			} else {
				alert("Please try again.");
			}
		}, function fail(rspns) {
			console.log(rspns);
			alert("Please try again.");
		});
	};
	$scope.logOut = function() {
		if ($cookies.getObject('admin')) {
			AuthService.logOut($cookies.getObject('admin')[0])
			.then(function success(rspns) {
				if (rspns == true) {
					$cookies.remove('admin');
					$state.go('register_nfc.login');
				} 
			}, function fail(rspns) {
				console.log(rspns);
			});
		}
	};

});