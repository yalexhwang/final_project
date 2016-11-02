mcApp.controller('event_addedCtrl', function($scope, $rootScope, $cookies, $state) {

	if ($cookies.getObject('newEvent')) {
		var event = $cookies.getObject('newEvent');
		console.log(event);
		if (event.category == 0) {
			event.category = 'Physical Nourishment'
		} else if (event.category == 1) {
			event.category = 'Wellness'
		}
		event.datetime = convertDate(event.datetime) + " " + convertTime(event.datetime);
		if (event.container == null) {
			event.container = "N/A";
		}
		if (event.contact == null) {
			event.contact = "N/A";
		}
		$scope.event = event;
	} else {
		$state.go('home.add_event');
	}
});