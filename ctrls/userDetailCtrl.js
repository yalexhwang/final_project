mcApp.controller('userDetailCtrl', function($scope, $rootScope, $cookies, $state, InputService, DataService, InputService) {
	console.log($rootScope.userNfc);
	var user;
	DataService.getUser($rootScope.userNfc).then(function success(rspns) {
		user = rspns.data;
		console.log(user);
		$scope.user = {
			dbid: user.dbid,
			device: {
				nfc_tag_id: user.nfc_tag_id,
				container_id: user.container_id,
				registered_at: user.registered_at
			},
			age: user.age,
			gender: convertGender(user.gender),
			race: convertRace(user.race),
			dob: convertDate(user.dob),
		};

		if (user.name.middle == "") {
			$scope.user.name = user.name.first + " " + user.name.last;
		} else {
			$scope.user.name = user.name.first + " " + user.name.middle + " " + user.name.last;
		}
		if (user.photo) {
			$scope.user.photo = user.photo;
		} else {
			$scope.user.photo = 'http://www.placehold.it/220x260';
		}

		if (user.employment == "") {
			$scope.user.employment = 'N/A';
		} else {
			$scope.user.employment = user.employment;
		}
		if (user.pob == "") {
			$scope.user.pob = {
				hospital: "N/A",
				city: "N/A",
				county: "N/A",
				state: "N/A"
			};
		} else {
			$scope.user.pob = user.pob;
		}
		if (user.parents == "") {
			$scope.user.parents = {
				father: "N/A",
				mother: "N/A"
			};
		} else {
			$scope.user.parents = user.parents;
		}
		if (user.hasID == 0) {
			$scope.user.hasID = "No";
		} else if (user.hasID == 1) {
			$scope.user.hasID = "Yes"
		} else {
			$scope.user.hasID = "N/A";
		}
		console.log("User for display:")
		console.log($scope.user);
	}, function fail(rspns) {
		console.log(rspns);
	});

	$scope.editUser = 0;
	$scope.openEditUser = function() {
		if ($scope.editUser == 0) {
			$scope.editUser = 1;
		} else {
			$scope.editUser = 0;
		}
	};

	$scope.updateUser = function() {
		console.log($scope.editedName);
		console.log($scope.editedDOB);
		console.log($scope.editedAge);
		console.log($scope.editedGender);
		console.log($scope.editedRace);
		var name = $scope.editedName;
		var dob = $scope.editedDOB;
		var age = $scope.editedAge;
		var gender = $scope.editedGender;
		var race = $scope.editedRace;
		var userObj = {};

		if (name == undefined) {
			userObj.name = {
				first: "",
				last: "",
				middle: ""
			};
		} else {
			userObj.name = {
				first: "",
				last: "",
				middle: ""
			}
			var nameArr = name.split(" ");
			console.log(nameArr);
			if (nameArr.length > 2) {
				userObj.name.first = nameArr[0];
				userObj.name.last = nameArr[nameArr.length - 1];
				userObj.name.middle = "";
				for (var i = 1; i < nameArr.length - 1; i++) {
					userObj.name.middle += nameArr[i];
				}
			} else {
				userObj.name.first = nameArr[0];
				userObj.name.last = nameArr[1]
			}
		}
		if (dob == null) {
			userObj.dob = "";
		} else {
			userObj.dob = dob.getUTCFullYear() + '-' + ('00' + (dob.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + dob.getUTCDate()).slice(-2);
		}
		if (age == undefined) {
			userObj.age = "";
		} else {
			userObj.age = age;
		}
		if (gender == undefined) {
			userObj.gender = "";
		} else {
			userObj.gender = gender;
		}
		if (race == undefined) {
			userObj.race = "";
		} else {
			userObj.race = race;
		}
		userObj.dbid = $scope.user.dbid;
		console.log(userObj);
		InputService.editUser(userObj, 'user')
		.then(function success(rspns) {
			console.log(rspns);
			$state.go('home.users');
		}, function fail(rspns) {
			console.log(rspns);
			alert('Error: try again');
		});
	};

	$scope.editHasID = 0;
	$scope.openEditHasID = function() {
		if ($scope.editHasID == 0) {
			$scope.editHasID = 1;
		} else {
			$scope.editHasID = 0;
		}
	};

	$scope.has = {};
	$scope.updateHasID = function() {
		console.log($scope.has.hasID);
		if (($scope.has.hasID !== undefined) && ($scope.has.hasID !== user.hasID)) {
			var userObj = { dbid: $scope.user.dbid, hasID: $scope.has.hasID};
			InputService.editUser(userObj, 'hasID')
			.then(function success(rspns) {
				console.log(rspns);
				$state.go('home.users');
			}, function fail(rspns) {
				console.log(rspns);
				alert('Error: try again');
			});
		}
		
	};

	$scope.editPob = 0;
	$scope.openEditPOB = function() {
		if ($scope.editPob == 0) {
			$scope.editPob = 1;
		} else {
			$scope.editPob = 0;
		}
	};

	$scope.pob = {hospital: "", city: "", county: "", state: ""};
	$scope.updatePOB = function() {
		console.log($scope.pob);
		var pob = $scope.pob;
		if ((pob.hospital == "") && (pob.city == "") && (pob.county == "") && (pob.state == "")) {

		} else {
			if (user.pob == "") {
				pob.new = 1;
			} else {
				pob.new = 0;
			}
			pob.dbid = $scope.user.dbid;
			console.log(pob);
			InputService.editUser(pob, 'pob')
			.then(function success(rspns) {
				console.log(rspns);
				$state.go('home.users');
			}, function fail(rspns) {
				console.log(rspns);
				alert('Error: try again');
			});
		}
		
	};

	$scope.editParents = 0;
	$scope.openEditParents = function() {
		if ($scope.editParents == 0) {
			$scope.editParents = 1;
		} else {
			$scope.editParents = 0;
		}
	};
	$scope.parents = {};
	$scope.updateParents = function() {
		console.log($scope.parents);
		var parents = $scope.parents;
		if ((parents.father !== "") && (parents.father !== "")) {
			if (user.parents == "") {
				parents.new = 1;
			} else {
				parents.new = 0;
			}
			parents.dbid = $scope.user.dbid;
			console.log(parents);
			InputService.editUser(parents, 'parents')
			.then(function success(rspns) {
				console.log(rspns);
				$state.go('home.users');
			}, function fail(rspns) {
				console.log(rspns);
				alert('Error: try again');
			});
		}
		
		
	};

});