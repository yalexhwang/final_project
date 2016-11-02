mcApp.controller('user_registeredCtrl', function($scope, $rootScope, $state, $cookies) {
	console.log('user_registeredCtrl');
	$scope.withNfc = 0;
	$scope.withPOB = 0;
	$scope.withParents = 0;

	var newUser = $cookies.getObject('newUser');
	console.log(newUser);
	newUser[5] = convertGender(newUser[5]);
	newUser[6] = convertRace(newUser[6]);
	newUser[7] = convertDate(newUser[7]);
	newUser[13] = convertHasId(newUser[13]);
	console.log(newUser);
	$scope.userRegistered = newUser;

	if ($cookies.getObject('newNfc')) {
		$scope.nfcRegistered = $cookies.getObject('newNfc');
		$scope.withNfc = 1;
		$cookies.remove('newNfc');
	}
	if ($cookies.getObject('pob')) {
		$scope.pobRegistered = $cookies.getObject('pob');
		$scope.withPOB = 1;
		$cookies.remove('pob');
	}
	if ($cookies.getObject('parents')) {
		$scope.parentsRegistered = $cookies.getObject('parents');
		$scope.withParents = 1;
		$cookies.remove('parents');
	}
	
	console.log($scope.userRegistered);
	console.log($scope.nfcRegistered);
	console.log($scope.pobRegistered);
	console.log($scope.parentsRegistered);
});
