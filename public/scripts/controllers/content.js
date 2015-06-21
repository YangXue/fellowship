angular.module('groupManagement')
  .controller('contentpageCtrl', function ($scope,$http,passingValue,$cacheFactory) {
  	$scope.user;
  	$scope.eventTitle;
  	$scope.eventDetails;
  	$scope.login = true;
    $scope.changeSign;
    $scope.signUpUserName;
    $scope.signUpPassword;
    $scope.signUpPasswordConfirmation;
    $scope.topicTheme;
    $scope.topicContent;

    var imageArray = [];
    var imageUrl = [];

  	$http.get('/content').success(function (user){
  		if(!user.data) {
  			$scope.login = false;
  		}
  		else{
  			$scope.user = user.data.toUpperCase();
  		}
  	})
  	.error(function (){
  		console.log('Something is Wrong');
  	})

  	$http.get('/futureEvent').success(function (eventDetail) {
  		$scope.postEvent = eventDetail.data;
      console.log($scope.postEvent);
  	})
  	.error(function () {
  		console.log('Cannot get comming event.');
  	})

  	var flipCard = function () {
  		$('.contentSection').flip();
  	}


  	var clickBinding = function () {
  		$('#content .addNewUser').click(function () {
  			$('#signUpModal').modal('show');
  		});
      $('#content .addNewEvent').click(function () {
        $('#createEventModal').modal('show');
      });
      $('#content .addNewTopic').click(function () {
        $('#createTopicModal').modal('show');
      })

  		$('#createEventButton').click(function () {
          console.log(imageUrl);
  	  		var eventInfo = {
  				eventTitle: $scope.eventTitle,
          image: imageUrl,
  				owner: $scope.user,
  				details: $scope.eventDetails
  			};
  			if($scope.login === true && $scope.eventTitle && $scope.eventDetails) {
  				$http.post('/createEvent',eventInfo).success(function (){
  					console.log('Event created!');
  				})
  				.error(function () {
  					console.log('Cannot create event!');
  				})
  			}
  		});

      $('#imageUploadButton').click(function () {
        $('#imageUpload').click();
      })

      $('#imageUpload').on('change',function() {
        var file = document.getElementById('imageUpload');
        if(imageArray.length<3&&file.files[0]){
          imageArray.push(file.files[0]);
          $('#imageUpload').val('');
          if(imageArray.length>=3){
            $('#imageUploadButton').css('display','none');
          }
          var n = imageArray.length;
          var reader = new FileReader();
          reader.onload = function (e) {
            $('#imageContainer'+n+'').fadeIn();
            $('#imageContainer'+n+'').attr('src', e.target.result);
            imageUrl[n-1] = e.target.result;
          }
          console.log(imageArray);
          reader.readAsDataURL(imageArray[n-1]);
        }
      })

      $('.imageContainer').click(function(){
        $(this).css('display','none');
        $(this).attr('src','');
        $('#imageUploadButton').fadeIn();
        if($(this).attr('id') === 'imageContainer1') {
          imageArray.shift();
        }
        else if($(this).attr('id') === 'imageContainer2') {
          if($('#imageContainer1').css('display') !== 'none') {
            imageArray.splice(1,1);
          }
          else {
            imageArray.shift();
          }
        }
         else if($(this).attr('id') === 'imageContainer3') {
          if(imageArray.length === 3){
            imageArray.splice(2,1);
          }
          else if(imageArray.length === 2){
            imageArray.splice(1,1);
          }
          else imageArray.shift();
        }
        console.log(imageArray);
      })
  	}

    $scope.signUp = function () {
      if($scope.signUpPassword === $scope.signUpPasswordConfirmation) {
        userInfo = {
          userName: $scope.signUpUserName,
          password: $scope.signUpPassword
        };
        $http.post('/createUser',userInfo).success(function (data, status, headers, config) {
          location.reload();
          console.log(data);
        })
        .error(function () {
          console.log('There is something wrong.');
        })
      }
      else {
        alert('Password not match!');
      }
    }

    $scope.createTopic = function () {
      if($scope.topicTheme !== null && $scope.topicContent !== null) {
        var topicObj = {
          theme: $scope.topicTheme,
          content: $scope.topicContent,
          author: $scope.user,
          commingTime: $scope.topicCommingTime
        }
      }
      $http.post('/createTopics',topicObj).success(function () {
        console.log('New topic created, waiting for administrator checking.');
      })
      .error(function () {
        console.log('Cannot create topic!');
      })   
    }

    $scope.viewDetail = function (e) {
      var info = {
        eventId: $(e.target).attr('data')
      };
      $http.post('/eventDetails',info).success(function() {
        window.location.href = '#/content/eventDetails';
      })
      .error(function () {
        console.log('Error!');
      })
    }

  	flipCard();
  	clickBinding();
  })