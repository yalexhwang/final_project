mcApp.controller('homeCtrl', function($scope, $rootScope, $http, $state, $cookies, AuthService) {
	console.log('homeCtrl!');
	$rootScope.$on('$stateChangeStart', function(e, toState, fromState) {
		if ($cookies.getObject('admin')) {
			AuthService.isLoggedIn($cookies.getObject('admin'))
			.then(function success(rspns) {
				if (rspns == true) {
					$state.go(toState);
				} else {
					$state.go('login');
				}
			}, function fail(rspns) {
				$state.go('login');
			});
		}
	});

	if ($rootScope.loggedIn == 0) {
		$state.go('login');
	}
	$scope.admin = $cookies.getObject('admin');

	$scope.logout = function() {
		console.log('logout!');
		if ($cookies.getObject('admin')) {
			AuthService.logOut($cookies.getObject('admin')[0])
			.then(function success(rspns) {
				if (rspns == true) {
					$cookies.remove('admin');
					$state.go('login');
				} 
			}, function fail(rspns) {
				console.log(rspns);
			});
		}
	}


});