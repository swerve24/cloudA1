'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3',
  'myApp.version',
  'ngMaterial'
])

.run(['$location', '$timeout' , function($location, $timeout){
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  console.log("User is signed in")
  $timeout(function () {
      $location.path('view2');
  }, 10);
  //$scope.$applyAsync();

  } else {

    console.log("User is not signed in");
    $timeout(function () {
        $location.path('view1');
    }, 10);


  }
});
}])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
