var mcApp = angular.module('mcApp', ['ui.router', 'ngCookies', 'ui.bootstrap', 'duScroll']);
var url = "http://localhost:5000";

mcApp.service('AuthService', function($http, $rootScope, $cookies, $q) {

	this.logIn = function(name, password) {
		var def = $q.defer();
		$http.post(url + '/login', {
			adminName: name,
			password: password
		}).then(function success(rspns) {
			if (rspns.data.passFail == 1 && rspns.data.obj) {
				$rootScope.loggedIn = 1;
				$cookies.putObject('admin', rspns.data.obj);
				def.resolve(true);
			} else {
				$rootScope.loggedIn = 0;
				def.reject(false);
			}
		}, function fail(rspns) {
			$rootScope.loggedIn = 0;
			def.reject(false);
		});
		return def.promise;
	};

	this.isLoggedIn = function(admin) {
		var def = $q.defer();
		$http.post(url + '/isLoggedIn', {
			admin: admin
		}).then(function success(rspns) {
			if (rspns.data.passFail == 1) {
				$rootScope.loggedIn = 1;
				console.log("isLoggedIn true");
				def.resolve(true);
			} else {
				$rootScope.loggedIn = 0;
				console.log("isLoggedIn false (1st)");
				def.resolve(false);
			}
		}, function fail(rspns) {
			$rootScope.loggedIn = 0;
			console.log("isLoggedIn false (2nd)");
			def.resolve(false);
		});
		return def.promise;
	};

	this.logOut = function(adminId) {
		var def = $q.defer();
		$http.post(url + '/logout', {
			adminId: adminId
		}).then(function success(rspns) {
			if (rspns.status == 200) {
				$rootScope.loggedIn = 0;
				$rootScope.admin = undefined;
				$rootScope.token = undefined;
				def.resolve(true);
			} else {
				def.resolve(false);
			}
		}, function fail(rspns) {
			def.reject(false);
		});
		return def.promise;
	}

});

mcApp.service('DataService', function($http, $rootScope, $q) {
	var def = $q.defer();
	this.getData = function(data) {
		$http.get(url + '/get/' + data)
		.then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	}	
});

mcApp.service('InputService', function($http, $rootScope, $q) {
	var def = $q.defer();
	this.registerUser = function(userObj) {
		$http.post(url + '/register_user', userObj)
		.then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	};
});

mcApp.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('register_nfc', {
		url: '/register/:nfc_tag_id',
		templateUrl: 'views/nfc_register.html',
		controller: 'nfc_registerCtrl'
	})
	.state('register_nfc.login', {
		url: '/register/login',
		templateUrl: 'views/nfc_register_login.html',
		controller: 'nfc_registerCtrl'
	})
	.state('register_nfc.register', {
		url: '/register/form',
		templateUrl: 'views/nfc_register_form.html',
	})
	.state('login', {
		url: '/',
		templateUrl: 'views/login.html',
		controller: 'loginCtrl'
	})
	.state('home', {
		url: '/home',
		templateUrl: 'views/home.html',
		controller: 'homeCtrl'
	})
	.state('home.main', {
		url: '/main',
		templateUrl: 'views/main.html',
		controller: 'mainCtrl'
	})
	.state('home.register_user', {
		url: '/register_user',
		templateUrl: 'views/register.html',
		controller: 'registerCtrl'
	})
	.state('home.user_registered', {
		url: '/user_registered',
		templateUrl: 'views/user_registered.html',
		controller: 'user_registeredCtrl'
	})
	.state('home.database', {
		url: '/database',
		templateUrl: 'views/database.html',
		controller: 'databaseCtrl'
	})
	.state('home.account', {
		url: '/account',
		templateUrl: 'views/account.html',
		controller: 'accountCtrl'
	})
	$urlRouterProvider.otherwise('/');

});



function convertDate(dateStr) {
	var date = new Date(dateStr);
	// console.log(date.getUTCFullYear() + '-' + ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
 //            ('00' + date.getUTCDate()).slice(-2));
	return date.getUTCFullYear() + '-' + ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2);
}

function convertGender(gender) {
	if (gender == 'm') {
		return 'Male';
	} else if (gender == 'f') {
		return 'Female';
	} else {
		return 'Other';
	}
}

function convertRace(race) {
	switch (race) {
		case '1': 
			return "American Indian or Alaska Native";
		case '2':
			return "Asian or Asian American";
		case '3':
			return "Black or African American";
		case '4':
			return "Native Hawaiian or Other Pacific Islander";
		case '5':
			return "White";
		case '6':
			return "Other";
		default:
			return "N/A";
	}
}

function convertHasId(id) {
	if (id == 1) {
		return "Yes";
	} else {
		return "No";
	}
}

