
angular.module('groupManagement')
  .controller('eventDetailsCtrl', function ($scope,$http) {
  	$scope.targetObj;

  	$http.get('/eventDetails').success(function (targetEvent){
  		$scope.targetObj = targetEvent.data;
      console.log($scope.targetObj.image.length);
      for(var i = 1; i < $scope.targetObj.image.length+1; i++) {
        $('.contentDetailImage:nth-child('+i+')').css('display','inline');
        $('.contentDetailImage:nth-child('+i+')').attr('src',$scope.targetObj.image[i-1]);
      }
  	})
  	.error(function () {
  		console.log('Invalid Event');
  	})
  })