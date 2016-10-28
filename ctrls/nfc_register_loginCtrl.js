mcApp.controller('nfc_register_loginCtrl', function($scope, $rootScope, $cookies, $state, AuthService) {

	$scope.adminLogin = {};

	$scope.logIn = function() {
		console.log($scope.adminLogin);

		AuthService.logIn($scope.adminLogin.name, $scope.adminLogin.password)
		.then(function success(rspns) {
			if (rspns == true) {
				$scope.admin = $cookies.getObject('admin');
				console.log($scope.admin);
				$state.go('register_nfc.register');
			} else {
				alert("Please try again.");
			}
		}, function fail(rspns) {
			console.log(rspns);
			alert("Please try again.");
		});
	};

});