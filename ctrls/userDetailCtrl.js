mcApp.controller('userDetailCtrl', function($scope, $rootScope, $cookies, $state, InputService, DataService) {
	console.log('userDetailCtrl');
	console.log($rootScope.userNfc);
	DataService.getUser($rootScope.userNfc).then(function success(rspns) {
		var user = rspns.data;
		$scope.user = {
			age: user.age,
			container_id: user.container_id,
			dob: convertDate(user.dob),
			gender: convertGender(user.gender),
			nfc: user.nfc_tag,
			race: convertRace(user.race),
			dbid: user.user_dbid,
			registered_at: convertDate(user.registered_at),
			pob: user.pob,
			parents: user.parents
		};
		if (user.name.middle == "") {
			$scope.user.name = user.name.first + " " + user.name.last;
		} else {
			$scope.user.name = user.name.first + " " + user.name.middle + " " + user.name.last;
		}
		console.log($scope.user);
	}, function fail(rspns) {
		console.log(rspns);
	});


	// if (userInfo.middle_name == "") {
	// 	$scope.user.name = userInfo.first_name + " " + userInfo.last_name;
	// } else {
	// 	$scope.user.name = userInfo.first_name + " " + userInfo.middle_name + " " + userInfo.last_name;
	// }
	// $scope.user.age = $rootScope.age;
	// $scope.user.race = convertRace($rootScope.race);
	// $scope.user.gender = convertGender($rootScope.gender);
	// $scope.user.device = $rootScope.device;
	// $scope.user.dob = convertDate($rootScope.dob);
	// $scope.user.dbid = $rootScope.dbid;


});