mcApp.controller('add_eventCtrl', function($scope, $rootScope, $http, $state, $cookies, InputService) {
	console.log('add_eventCtrl');

	$scope.event = {
		container: "",
		location: {address: "", city: "", state: "", zipcode: ""}
	};
	$scope.add = function() {
		var yr = $scope.date.getFullYear();
		var mo = $scope.date.getMonth() + 1;
		var date = $scope.date.getDate();
		if (date.toString().length < 2) {
			date = '0' + date;
		}
		var hr = Number($scope.timeHr) + Number($scope.timeAmPm);
		var min = $scope.timeMin;
		if (min.length < 2) {
			min = '0' + $scope.timeMin;
		}
		$scope.event.datetime = {
			year: yr.toString(),
			month: mo.toString(),
			date: date.toString(),
			hour: hr.toString(),
			min: min.toString()
		};
		console.log($scope.event);
		InputService.addEvent($scope.event)
		.then(function success(rspns) {
			console.log(rspns);
			$cookies.putObject('newEvent', rspns.data);
			$state.go('home.event_added')
		}, function fail(rspns) {
			console.log(rspns);
		});
	};

});