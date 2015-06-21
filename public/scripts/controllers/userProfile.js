angular.module('groupManagement')
  .controller('userProfileCtrl', function ($scope,$http,$q) {

    $scope.userProfile;
    $scope.oldPassword;
    $scope.newPassword1;
    $scope.newPassword2;
    $scope.realName;
    $scope.occupation;
    $scope.selfDiscription;

    $http.get('/userProfile').success(function (profile) {
      if(!profile.data) {
        window.location.href = '#/';
      }
      else {
        $scope.userProfile = profile.data;

        if($scope.userProfile.occupation){
          $('.occupationShowItem').css('display','inline');
        }
        else{
          $('.occupationInputItem').css('display','inline');
        }
        $scope.selfDiscription = $scope.userProfile.selfDiscription;

        //Combine the http service with one promise
        $q.all([
        //-------------get personal event----------------        
          $http.get('/yourEvent').success(function (obj) {
            $scope.myEvents = obj.data;
          })
          .error(function (){
            console.log('Cannot get personal events.')
          }),

          //-------------get personal Topics----------------       
          $http.get('/yourTopic').success(function (obj) {
            $scope.myTopics = obj.data;
          })
          .error(function (){
            console.log('Cannot get personal events.')
          })
        ]).then(function () {
          setTimeout(function () {
            $('#userProfile').fadeIn();
          },200);
        })

      }
    }).error(function () {
      window.location.href = '#/';
    })

  	
  	var clickBinding = function () {
  		$('.sideBarTab').click(function () {
  			$('.active').removeClass('active');
  			$(this).addClass('active');
  			var target = $(this).attr('data-show');
        $('.shownPanel').removeClass('shownPanel');
        $(target).addClass('shownPanel');
  		})
      $('.profilePanel .passwordChangeButton').click(function() {
        $('.passwordChange').slideDown();
        $('.passwordChangeButton').css('display','none');
        $('.secButton').fadeIn();
      })
      $('.passwordConfirmButton').click(function() {
        var newPassword = {
          password: $scope.newPassword1
        }
        if($scope.newPassword1 === $scope.newPassword2&&(window.btoa($scope.oldPassword) === $scope.userProfile.password)&&($scope.newPassword1)) {
          $http.post('/changePassword',newPassword).success(function () {
            alert('Password has been changed');
          })
          .error(function () {
            console.log('Cannot change password');
          })
        }
        else{
          alert('Please check your input!');
        }
      })
      $('.secButton').click(function() {
        $('.secButton').css('display','none');
        $('.passwordChangeButton').fadeIn();
        $('.passwordChange').slideUp();
      })
      $('.occupationUnit .changeOccupationButton').click(function (){
        $('.occupationInputItem').fadeIn();
        $('.occupationShowItem').css('display','none');
      })
      $('button.occupationInputItem').click(function () {
        if($scope.userProfile.occupation) {
          $('.occupationInputItem').css('display','none');
          $('.occupationShowItem').fadeIn(); 
        } 
      })
  	}

    $scope.updateName = function () {
      var data = {
        name: $scope.realName
      }
      $http.post('/updateName',data).success(function () {
        location.reload();
      })
      .error(function (){
        console.log('Real name cannot be updated')
      })
    }
    $scope.updateOccupation = function () {
      var data = {
        occupation: $scope.occupation
      }
      $http.post('/updateOccuption',data).success(function (){
        console.log('Your occupation has been updated.');
        location.reload();
      })
      .error(function () {
        alert('Occupation cannot be updated.');
      })
    }

    $scope.updateSelfDiscription = function () {
      var data = {
        selfDiscription: $scope.selfDiscription
      }
      $http.post('/updateSelfDiscription',data).success(function (){
        alert('Your self discription has been updated.');
      })
      .error(function () {
        alert('Self discription cannot be updated.');
      })
    }

  	clickBinding();
  })