mcApp.controller('loginCtrl', function($scope, $rootScope, $http, $state, AuthService) {
	console.log('loginCtrl!');
	if ($rootScope.loggedIn == 1)  {
		$state.go('home.main');
	} 

	$scope.logIn = function() {
		AuthService.logIn($scope.adminName, $scope.password)
		.then(function success(rspns) {
			if (rspns == true) {
				$state.go('home.main');
			} else {
				alert("Please try again.");
			}
		}, function fail(rspns) {
			console.log(rspns);
			alert("Please try again.");
		});
	};


});