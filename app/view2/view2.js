'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])


.controller('View2Ctrl', ['$scope', function($scope) {

$scope.allContacts = []
// $scope.allContacts =
firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/Phone Contacts/').on('value', function(snapshot){
  $scope.allContacts.length = 0;
  snapshot.forEach(function(childSnapshot){
    $scope.allContacts.push(childSnapshot.val());
  });
  $scope.$applyAsync();

});




  $scope.addContact = function(){
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/Phone Contacts/' + $scope.contactName).update({
      Name: $scope.contactName,
      PhoneNumber: $scope.contactPhone

    })
    $scope.$applyAsync();
    console.log("Added Contact....")
  }

  $scope.logout = function(){
    firebase.auth().signOut().then(function() {

}, function(error) {
  // An error happened.
});
  }

}]);
