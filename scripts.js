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

	this.getData = function(data) {
		var def = $q.defer();
		$http.get(url + '/get/' + data)
		.then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	}	

	this.getServiceData = function(svc_id) {
		var def = $q.defer();
		$http.get(url + '/services/' + svc_id)
		.then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	}

	this.getAllUsers = function() {
		var def = $q.defer();
		$http.get(url + '/users').then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	}

	this.getUser = function(nfcId) {
		var def = $q.defer();
		$http.get(url + '/users/' + nfcId).then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	}
});

mcApp.service('InputService', function($http, $rootScope, $q) {
	this.registerUser = function(userObj) {
		var def = $q.defer();
		$http.post(url + '/users', userObj)
		.then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	};

	this.editUser = function(obj, type) {
		var def = $q.defer();
		$http.post(url + '/edit_user', {
			obj: obj,
			type: type
		})
		.then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	};

	this.addEvent = function(eventObj, svc_id) {
		var def = $q.defer();
		$http.post(url + '/services/' + svc_id, eventObj)
		.then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	};

	this.editEvent = function(eventObj) {
		var def = $q.defer();
		$http.post(url + '/edit_event', eventObj)
		.then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	};

});

mcApp.service('DeleteService', function($http, $q) {
	this.deleteEvent = function(svc_id, dbid) {
		var def = $q.defer();
		$http.get(url + '/delete/service/' + svc_id + '?dbid=' + dbid).then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	}

	this.deleteUser = function(nfc_tag_id) {
		var def = $q.defer();
		$http.get(url + '/delete/user/' + nfc_tag_id)
		.then(function success(rspns) {
			def.resolve(rspns);
		}, function fail(rspns) {
			def.reject(rspns);
		});
		return def.promise;
	}
});

mcApp.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('register_nfc', {
		url: '/register/:nfc_tag_id',
		templateUrl: 'views/scanner/nfc_register.html',
		controller: 'nfc_registerCtrl'
	})
	.state('register_nfc.login', {
		url: '/login',
		templateUrl: 'views/scanner/nfc_register_login.html',
		controller: 'nfc_register_loginCtrl'
	})
	.state('register_nfc.register', {
		url: '/form',
		templateUrl: 'views/scanner/nfc_register_form.html',
		controller: 'nfc_register_formCtrl'
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
	.state('home.users', {
		url: '/users',
		templateUrl: 'views/users.html',
		controller: 'usersCtrl'
	})
	.state('home.userDetail', {
		url: '/user_detail',
		templateUrl: 'views/user_detail.html',
		controller: 'userDetailCtrl'
	})
	.state('home.register_user', {
		url: '/register_user',
		templateUrl: 'views/register_user.html',
		controller: 'register_userCtrl'
	})
	.state('home.user_registered', {
		url: '/user_registered',
		templateUrl: 'views/user_registered.html',
		controller: 'user_registeredCtrl'
	})

	.state('home.services', {
		url: '/services',
		templateUrl: 'views/services.html',
		controller: 'servicesCtrl'
	})
	.state('home.service1', {
		url: '/service1',
		templateUrl: 'views/service1.html',
		controller: 'service1Ctrl'
	})
	.state('home.service2', {
		url: '/service2',
		templateUrl: 'views/service2.html',
		controller: 'service2Ctrl'
	})
	.state('home.service3', {
		url: '/service3',
		templateUrl: 'views/service3.html',
		controller: 'service3Ctrl'
	})
	.state('home.service4', {
		url: '/service4',
		templateUrl: 'views/service4.html',
		controller: 'service4Ctrl'
	})
	.state('home.add_event', {
		url: '/add_event',
		templateUrl: 'views/add_event.html',
		controller: 'add_eventCtrl'
	})
	.state('home.event_added', {
		url: '/event_added',
		templateUrl: 'views/event_added.html',
		controller: 'event_addedCtrl'
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
	return date.getUTCFullYear() + '-' + ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2);
}

function convertTime(timeStr) {
	var time = new Date(timeStr);
	var hr = time.getUTCHours();
	var min = time.getUTCMinutes();
	if (min < 10) {
		min = "0" + min.toString();
	}
	if (hr > 12) {
		hr = hr - 12;
		return hr + ":" + min + " PM";
	} else if (hr == 12) {
		return hr + ":" + min + " PM";
	} else {
		return hr + ":" + min + " AM";
	}
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

