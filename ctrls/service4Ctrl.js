mcApp.controller('service4Ctrl', function($scope, $cookies, $state, InputService, DataService) {
	console.log('service4Ctrl');
	DataService.getServiceData(1).then(function success(rspns) {
		console.log(rspns);
		var events = rspns.data.events;
		$scope.wellnessEventsArr = [];
		for (var i = 0; i < events.length; i++) {
			var event = {
				name: events[i].name,
				location: events[i].location,
				contact: events[i].contact,
				container: events[i].container,
				datetime: convertTime(events[i].datetime)
			};
			$scope.wellnessEventsArr.push(event);
		}
	}, function fail(rspns) {
		console.log(rspns);
	});
});