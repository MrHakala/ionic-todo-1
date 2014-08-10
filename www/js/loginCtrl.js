'use strict';

app.controller('loginCtrl', function($scope, $rootScope, $firebase, $firebaseSimpleLogin){
	var ref = new Firebase('https://cnote.firebaseio.com/')

	// Simple Login object
	$scope.auth = $firebaseSimpleLogin(ref)

	$scope.user = null;

	$scope.login = function(provider){
		$scope.auth.$login(provider)
	}

	$scope.logout = function(){
		$scope.auth.$logout()

		// reset the user object and clear cookies
		$rootScope.$on('$firebaseSimpleLogin:logout', function(e){
			$scope.user = null

			window.cookies.clear(function(){
				console.log('Cookies cleared!')
			})
		})
	}

	// On successful login, set user object
	$rootScope.$on('$firebaseSimpleLogin:login', function(event, user){
		$scope.user = user
	})

	// catch errors
	$rootScope.$on('$firebaseSimpleLogin:error', function(e, err){
		console.log('Error logging user in: ' + err)
	})
})