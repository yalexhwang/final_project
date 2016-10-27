mcApp.controller('databaseCtrl', function($scope, $rootScope, $http, $state) {
	console.log('databaseCtrl');
	if (($rootScope.loggedIn == 0) && ($rootScope.token == 1)) {
		$state.go('login');
	}
});