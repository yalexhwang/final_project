mcApp.controller('event_addedCtrl', function($scope, $rootScope, $cookies, $state) {
	console.log('event_addedCtrl');

	if ($cookies.getObject('newEvent')) {
		var event = $cookies.getObject('newEvent');
		$scope.event = event;
		if (event.category == 0) {
			$scope.cateogry = 'Physical Nourishment'
		} else if (event.category == 1) {
			$scope.cateogry = 'Wellness'
		}
	}
});