
angular.module('groupManagement')
  .controller('homepageCtrl', function ($scope,$http) {
	$scope.role = 'oldUser';
	$scope.loginUserName = '';
	$scope.loginPassword = '';
	$scope.signUpUserName ='';
	$scope.signUpPassword = '';
	$scope.signUpPasswordConfirmation = '';

	$('#homePage .rolePick input').click(function () {
		if($(this).attr('value') === 'login') {
			$scope.role = 'oldUser';
		}
		else {
			$scope.role = 'newUser';
		}
		$scope.$apply();
	})

	$scope.signUp = function () {
		if($scope.signUpPassword === $scope.signUpPasswordConfirmation) {
			userInfo = {
				userName: $scope.signUpUserName,
				password: $scope.signUpPassword
			};
			$http.post('/createUser',userInfo).success(function (data, status, headers, config) {
				window.location.href = '#/content';
			})
			.error(function () {
				console.log('There is something wrong.');
			})
		}
		else {
			alert('Password not match!');
		}
	}

	$scope.login = function () {
		var loginInfo ={
			userName: $scope.loginUserName,
			password: $scope.loginPassword			
		};
		if($scope.loginUserName && $scope.loginPassword) {
			$http.post('/userLogin',loginInfo).success(function (data, status, headers, config) {
				window.location.href = '#/content';
				console.log(data);
			})
			.error(function () {
				console.log('Something is wrong');
			})
		}
		else {
			alert('Fill the fucking blanks!');
		}
	}
  });