mcApp.controller('service3Ctrl', function($scope, $cookies, $state, InputService, DataService, DeleteService) {
	DataService.getServiceData(0).then(function success(rspns) {
		console.log(rspns);
		var events = rspns.data.events;
		$scope.physicalEventsArr = [];
		for (var i = 0; i < events.length; i++) {
			var event = {
				dbid: events[i].dbid,
				name: events[i].name,
				location: events[i].location,
				contact: events[i].contact,
				container: events[i].container,
				datetime: convertDate(events[i].datetime) + " " +convertTime(events[i].datetime)
			};
			$scope.physicalEventsArr.push(event);
		}
		console.log($scope.physicalEventsArr);
	}, function fail(rspns) {
		console.log(rspns);
	});

		$scope.removeEvent = function(index) {
		console.log(index);
		var temp = $scope.physicalEventsArr;
		$scope.physicalEventsArr = [];
		for (var i = 0; i < temp.length; i++) {
			if (i !== index) {
				$scope.physicalEventsArr.push(temp[i]);
			}
		}
		DeleteService.deleteEvent(0, temp[index].dbid)
		.then(function success(rspns) {
			$scope.openEdit = 0;
			$state.go('home.service3');
		}, function fail(rspns) {
			console.log(rspns);
		});
	};

	$scope.editEvent = function(that) {
		console.log(that);
		that.openEdit = !that.openEdit;
	}

	$scope.eventEdited = {
		name: "", container: "", 
		address: "", city: "", state: "", zipcode: "",
		contact: ""
	};
	$scope.editedTime = {hr: "", min: "", AmPm: "" };

	$scope.doneEditing = function(index, that) {
		console.log($scope.eventEdited);
		that.openEdit = !that.openEdit;
		var event = { name: "", container: "", location: {address: "", city: "", state: "", zipcode: ""}, contact: "", datetime: {year: "", month: "", date: "", hour: "", min: ""}, dbid: $scope.physicalEventsArr[index].dbid };
		var yr;
		var mo;
		var date;
		var hr;
		var min;
		if (($scope.editedDate !== undefined) && ($scope.editedDate !== "")) {
			var yr = $scope.editedDate.getFullYear();
			var mo = $scope.editedDate.getMonth() + 1;
			var date = $scope.editedDate.getDate();
			if (date.toString().length < 2) {
				date = '0' + date;
			}
			event.datetime.year = yr.toString();
			event.datetime.month = mo.toString();
			event.datetime.date = date.toString();
		}
		if (($scope.editedTime.hr !== undefined) && ($scope.editedTime.hr !== "") && ($scope.editedTime.min !== undefined) && ($scope.editedTime.min !== "") && ($scope.editedTime.AmPm !== undefined) && ($scope.editedTime.AmPm !== "")) {
			var hr = Number($scope.editedTime.hr) + Number($scope.editedTime.AmPm);
			var min = $scope.editedTime.min;
			if ((min.length < 2) && (min !== undefined)) {
				min = '0' + $scope.eventEdited.timeMin;
			}
			event.datetime.hour = hr.toString();
			event.datetime.min = min.toString();
		}

		if (($scope.eventEdited.name !== undefined) && ($scope.eventEdited.name !== "")) {
			event.name = $scope.eventEdited.name;
		}
		if (($scope.eventEdited.container !== undefined) && ($scope.eventEdited.container !== "")) {
			event.container = $scope.eventEdited.container;
		}

		if (($scope.eventEdited.address !== undefined) && ($scope.eventEdited.address !== "")) {
			event.location.address = $scope.eventEdited.address;
		}
		if (($scope.eventEdited.city !== undefined) && ($scope.eventEdited.city !== "")) {
			event.location.city = $scope.eventEdited.city;
		}
		if (($scope.eventEdited.state !== undefined) && ($scope.eventEdited.state !== "")) {
			event.location.state = $scope.eventEdited.state;
		}
		if (($scope.eventEdited.zipcode !== undefined) && ($scope.eventEdited.zipcode !== "")) {
			event.location.zipcode = $scope.eventEdited.zipcode;
		}
		if (($scope.eventEdited.contact !== undefined) && ($scope.eventEdited.contact !== "")) {
			event.contact = $scope.eventEdited.contact;
		}
		event.category = "0";
		console.log(event);
		InputService.editEvent(event).then(function success(rspns) {
			console.log(rspns);
			$scope.eventEdited.name = "";
			$scope.eventEdited.container = "";
			$scope.eventEdited.address = "";
			$scope.eventEdited.city = "";
			$scope.eventEdited.state = "";
			$scope.eventEdited.zipcode = "";
				
			$state.go('home.services');
		}, function fail(rspns) {
			console.log(rspns);
			alert('Sorry, please try again');
		});
	};
});