'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', function($scope) {

        $scope.home = function() {
            $scope.view_teams = false;
            $scope.show_standing = false;
            $scope.wasX = false;
            $scope.EC = false;
            $scope.WC = false;
        }
        console.log("its working");
        $scope.teamnames = [];
        $scope.view_teams = false;
        $scope.show_standing = false;
        $scope.wasX = false;
        $scope.standingList = [];
        // var statslist = []
        $scope.statslist = [];
        $scope.EW = false;

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        $scope.fanImages = [];
        firebase.database().ref("teamName").on('value', function(snapshot) {
            $scope.fanImages.length = 0;
            snapshot.forEach(function(childSnapshot) {
                $scope.fanImages.push(childSnapshot.val().url);
            });
            $scope.$applyAsync();
            console.log($scope.fanImages);
        });

        $scope.changeDiv = function() {
            $scope.view_teams = true;
        }

        $scope.standingDiv = function() {
            $scope.show_standing = true;
        }
        var uploadButton;
        uploadButton = document.getElementById("file");
        uploadButton.addEventListener('change', function(e) {
            var file = e.target.files[0];

            firebase.storage().ref(guid()).put(file).then(function(snapshot) {
                console.log(snapshot);
                firebase.database().ref("teamName").push({
                    url: snapshot.a.downloadURLs[0]
                });
            });
            console.log("HI");
        });

        $scope.uploadImage = function() {
            uploadButton.click();
        }

        // THIS DISPLAYS THE WESTERN CONFERENCE STANDINGS WHEN CLICKED
        // ITS ONLY CALLED EASTERNDIV BECAUSE THATS THE HOME STATUS
        $scope.westernDiv = function() {
            $scope.WC = true;
            $scope.EC = false;

            $scope.winsList = [];
            $scope.westWinsList = []


            for (var b = 0; b < $scope.standingList.length; b++) {
                if ($scope.standingList[b].Conference == "Western") {
                    $scope.winsList.push({
                        wins: $scope.standingList[b].Wins,
                        key: $scope.standingList[b].Key,
                        city: $scope.standingList[b].City,
                        name: $scope.standingList[b].Name,
                        losses: $scope.standingList[b].Losses
                    });
                }

            }

            function Comparator(a, b) {
                if (a[0] > b[0]) return -1;
                if (a[0] < b[0]) return 1;
                return 0;
            }



            $scope.westWinsList = $scope.winsList.sort(Comparator);
            console.log($scope.westWinsList);

            $scope.EW = true;
        }

        $scope.easternDiv = function() {
            $scope.WC = false;
            $scope.EC = true;

            console.log("List");
            console.log($scope.standingList);
            $scope.winsList = [];
            $scope.eastWinsList = [];

            for (var b = 0; b < $scope.standingList.length; b++) {
                if ($scope.standingList[b].Conference == "Eastern") {
                    $scope.winsList.push({
                        wins: $scope.standingList[b].Wins,
                        key: $scope.standingList[b].Key,
                        city: $scope.standingList[b].City,
                        name: $scope.standingList[b].Name,
                        losses: $scope.standingList[b].Losses
                    });
                }
            }

            function Comparator(a, b) {
                if (a[0] > b[0]) return -1;
                if (a[0] < b[0]) return 1;
                return 0;
            }



            $scope.eastWinsList = $scope.winsList.sort(Comparator);
            console.log($scope.eastWinsList);
            $scope.EW = false;

        }


        $(function() {
            $(":file").change(function() {
                if (this.files && this.files[0]) {
                    var reader = new FileReader();
                    reader.onload = imageIsLoaded;
                    reader.readAsDataURL(this.files[0]);
                }
            });
        });

        function imageIsLoaded(e) {
            $('#myImg').attr('src', e.target.result);
        }; //calls the function named previewFile()


        $scope.teamSelected = function(index) {
            // console.log($scope.teamnames[index]);
            $scope.pickTeam = $scope.teamnames[index];
            $scope.pickTeamStats = $scope.statslist[index];

            document.getElementById("pageteam").style.backgroundColor = "#" + $scope.pickTeam.PrimaryColor
            document.getElementById("welc").style.color = "#" + $scope.pickTeam.SecondaryColor
            document.getElementById("conf1").style.color = "#" + $scope.pickTeam.TertiaryColor
            document.getElementById("conf2").style.backgroundColor = "#" + $scope.pickTeam.SecondaryColor
            document.getElementById("conf3").style.backgroundColor = "#" + $scope.pickTeam.TertiaryColor
            document.getElementById("divi1").style.color = "#" + $scope.pickTeam.PrimaryColor
            document.getElementById("fantasy1").style.color = "#" + $scope.pickTeam.PrimaryColor
            document.getElementById("fantasy2").style.backgroundColor = "#" + $scope.pickTeam.SecondaryColor
            document.getElementById("off1").style.color = "#" + $scope.pickTeam.PrimaryColor
            document.getElementById("off2").style.backgroundColor = "#" + $scope.pickTeam.SecondaryColor
            document.getElementById("def1").style.color = "#" + $scope.pickTeam.PrimaryColor
            document.getElementById("def2").style.backgroundColor = "#" + $scope.pickTeam.SecondaryColor


            // console.log($scope.teamnames[index])
            console.log($scope.pickTeamStats);




        }

        // Getting the Team Info here

        $.ajax({
                url: "https://api.fantasydata.net/v3/nba/scores/JSON/teams",
                beforeSend: function(xhrObj) {
                    // Request headers
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "56636fc0fb6142f9aa2227f3daa5f13b");
                },
                type: "GET",
                // Request body
                data: "{body}",
            })
            .done(function(data) {
                // console.log(data);
                for (var i = 0; i < data.length; i++) {
                    $scope.teamnames.push(data[i])

                }


                // console.log($scope.teamnames)
            })
            .fail(function() {
                alert("error");
            });


        //Getting Extended Team Stats
        $.ajax({
                url: "https://api.fantasydata.net/v3/nba/scores/{JSON}/TeamSeasonStats/{2017}?",
                beforeSend: function(xhrObj) {
                    // Request headers
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "56636fc0fb6142f9aa2227f3daa5f13b");
                },
                type: "GET",
                // Request body
                teamdata: "{body}",
            })
            .done(function(teamdata) {
                for (var m = 0; m < teamdata.length; m++) {
                    $scope.statslist.push(teamdata[m])
                }

            })
            .fail(function() {
                alert("error");
            });


        //Getting the Standings
        $.ajax({
                url: "https://api.fantasydata.net/v3/nba/scores/{JSON}/Standings/{2016}?",
                beforeSend: function(xhrObj) {
                    // Request headers
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "56636fc0fb6142f9aa2227f3daa5f13b");
                },
                type: "GET",
                // Request body
                standingdata: "{body}",
            })
            .done(function(standingdata) {
                for (var n = 0; n < standingdata.length; n++) {
                    $scope.standingList.push(standingdata[n])
                }

                // console.log(standingdata)



            })
            .fail(function() {
                alert("error");
            });
        // $scope.formInfo = [];

        $scope.name = "denesh";


        $scope.formSubmit = function(event, form) {
            $scope.formInfo = {
                firstname: $scope.fname,
                lastname: $scope.lname
            };

            console.log($scope.formInfo)


        }

    }]);
