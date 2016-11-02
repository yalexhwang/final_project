mcApp.controller('loginCtrl', function($scope, $rootScope, $http, $state, AuthService) {
	if ($rootScope.loggedIn == 1)  {
		$state.go('home.main');
	} 

	$scope.error = 0;
	$scope.logIn = function() {
		AuthService.logIn($scope.adminName, $scope.password)
		.then(function success(rspns) {
			if (rspns == true) {
				$state.go('home.main');
			} else {
				$scope.errorMsg = "Please try again.";
				$scope.error = 1;
			}
		}, function fail(rspns) {
			$scope.errorMsg = "Something went wrong. Please try again.";
			$scope.error = 1;
		});
	};


});