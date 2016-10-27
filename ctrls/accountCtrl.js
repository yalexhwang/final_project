mcApp.controller('accountCtrl', function($scope, $rootScope, $http) {
	console.log('accountCtrl!');
	console.log($rootScope.admin);
	if (($rootScope.loggedIn == 0) && ($rootScope.token == 1)) {
		$state.go('login');
	}
});