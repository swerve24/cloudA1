'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'

        });
    }])

        .controller('View1Ctrl', ['$scope', function($scope) {

        ///////// logging in
        $scope.login = function(){
          firebase.auth().signInWithEmailAndPassword($scope.lemail, $scope.lpwd).catch(function(error) {
          alert("PASSWORD OR EMAIL NOT CORRECT")
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
        }

        ///////// REGISTERING
        $scope.register = function() {

      
          firebase.auth().createUserWithEmailAndPassword($scope.uemail, $scope.pword).then(function(){
            firebase.database().ref('users/' + firebase.auth().currentUser.uid).update({

              email: $scope.uemail
            });



          }).catch(function(error) {
            alert("Email has already been used. Enter another email.")

            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
});


        }




        $scope.home2 = function() {
            $scope.hom = true;
        }
        console.log("its working");

        $(function() {

    $('#login-form-link').click(function(e) {
    	$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

});



    }]);
