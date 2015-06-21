'use strict';

/**
 * @ngdoc overview
 * @name dashbordUc1App
 * @description
 * # dashbordUc1App
 *
 * Main module of the application.
 */
angular
  .module('groupManagement', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'chart.js',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home_page.html',
        controller: 'homepageCtrl'      
      })
      .when('/content',{
        templateUrl: 'views/content.html',
        controller: 'contentpageCtrl'           
      })
      .when('/content/eventDetails',{
        templateUrl: 'views/eventDetail.html',
        controller: 'eventDetailsCtrl'
      })
      .when('/userProfile',{
        templateUrl: 'views/userProfile.html',
        controller: 'userProfileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
