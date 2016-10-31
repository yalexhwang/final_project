mcApp.controller('service3Ctrl', function($scope, $cookies, $state, InputService, DataService) {
	console.log('service3Ctrl');

	DataService.getServiceData(0).then(function success(rspns) {
		console.log(rspns);
		var events = rspns.data.events;
		$scope.physicalEventsArr = [];
		for (var i = 0; i < events.length; i++) {
			var event = {
				name: events[i].name,
				location: events[i].location,
				contact: events[i].contact,
				container: events[i].container,
				datetime: convertTime(events[i].datetime)
			};
			$scope.physicalEventsArr.push(event);
		}
	}, function fail(rspns) {
		console.log(rspns);
	});

});