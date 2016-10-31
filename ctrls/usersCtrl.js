mcApp.controller('usersCtrl', function($scope, $rootScope, $cookies, $state, InputService, DataService) {
	console.log('usersCtrl');

	DataService.getAllUsers().then(function success(rspns) {
		console.log(rspns);
		users = rspns.data;
		$scope.usersArr = [];
		for (var i = 0; i < rspns.data.length; i++) {
			var user = {};
			if (rspns.data[i].middle_name == "") {
				user.name = rspns.data[i].first_name + " " + rspns.data[i].last_name;
			} else {
				user.name = rspns.data[i].first_name + " " + rspns.data[i].middle_name + " " + rspns.data[i].last_name;
			}
			user.info = "";
			if (rspns.data[i].hasID) {
				user.info += " has ID; "
			}
			if (rspns.data[i].pob) {
				user.info += " place of birth; "
			}
			if (rspns.data[i].parents) {
				user.info += " parents' full name; "
			}
			if (rspns.data[i].employment) {
				user.info += " employment profile; "
			}
			user.dbid = rspns.data[i].dbid;
			user.device = rspns.data[i].device;
			user.age = rspns.data[i].age;
			user.gender = convertGender(rspns.data[i].gender);
			user.race = convertRace(rspns.data[i].race);
			user.dob = convertDate(rspns.data[i].dob);
			$scope.usersArr.push(user);
		}

	}, function fail(rspns) {
		console.log(rspns);
	});


	$scope.showDetail = function(index) {
		console.log(index);
		$rootScope.userNfc = $scope.usersArr[index].device;
	}
});