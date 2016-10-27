mcApp.controller('mainCtrl', function($scope, $rootScope, $state, $cookies, DataService) {
	console.log('mainCtrl');
	if ($rootScope.loggedIn == 0) {
		$state.go('login');
	} 

	DataService.getData('main')
	.then(function success(rspns) {
		console.log(rspns);
		$scope.nfcArr = [];
		var nfc = rspns.data.nfc;
		for (var i = 0; i < nfc.length; i++) {
			nfc[i][2] = convertDate(nfc[i][2]);
			nfc[i][7] = convertGender(nfc[i][7]);
			nfc[i][8] = convertRace(nfc[i][8]);
			nfc[i][9] = convertDate(nfc[i][9]);
			$scope.nfcArr.push(nfc[i]);		
		}

		$scope.containerArr = [];
		var cont = rspns.data.container;
		for (var i = 0; i < cont.length; i++) {
			$scope.containerArr.push(cont[i]);
		}
	}, function fail(rspns) {
		console.log('error: ' + rspns);
	});


});