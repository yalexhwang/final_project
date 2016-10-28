mcApp.controller('nfc_registerCtrl', function($scope, $rootScope, $cookies, $state, $stateParams, AuthService) {
	console.log('nfc_registerCtrl');
	console.log($stateParams.nfc_tag_id);
	$rootScope.nfc_tag_id = $stateParams.nfc_tag_id;

	if ($cookies.getObject('admin')) {
		console.log('cookies found');
		console.log($cookies.getObject('admin'));
		$state.go('register_nfc.register');
	} else {
		$state.go('register_nfc.login');
	}

});