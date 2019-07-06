
angular.module('citiesApp')
.controller('loginController', ['$location','$scope','$http', 'setHeadersToken','localStorageModel', function ($location,$scope, $http, setHeadersToken,localStorageModel) {

        self = this;
        self.serverUrl = 'http://localhost:3000/';

        //update index controller - guest
        $scope.indxCtrl.headers = [
            {hashbang:"#/login",value:"Login"},
            {hashbang:"#/register",value:"Register"},
            {hashbang:"#/poi",value:"Points Of Interest"},
            {hashbang:"#/about",value:"About"}];
        $scope.indxCtrl.numberOfSaved = 0;
        $scope.indxCtrl.showSavedIcon = false;
        $scope.indxCtrl.username = "guest";
        localStorageModel.updateLocalStorage('token', "");
        localStorageModel.updateLocalStorage('savedList', []);

        self.threePopular = [];
        self.threePopularId = [];
        self.success = true;
        self.message = "";
        self.username = "";
        self.Password = "";
        self.userLogged = false;

        self.threepopular = function () {
            $http.get(self.serverUrl + "Poi/popular")
                .then(function (response) {
                    popular = response.data.result;
                    if (popular.length > 0) {
                        for (i = 0; i < popular.length; i++) {
                            self.threePopular[i] = {
                                id: i,
                                point: popular[i]
                            };
                        }
                    }
                }, function (response) {
                });
        }

        self.goToRegister = function () {
            $location.path('/register')
        }
        self.goToRestorePass = function () {
            $location.path('/password')
        }

        self.updateIndexLogged = function(numOfSaved) {
            $scope.indxCtrl.username = self.username;
            $scope.indxCtrl.numberOfSaved = numOfSaved;
            $scope.indxCtrl.headers = [
                { hashbang: "#/poi", value: "POI" },
                { hashbang: "#/home", value: "Home" },
                { hashbang: "#/about", value: "About" },
                { hashbang: "#/logout", value: "Logout" }
            ];
            $scope.indxCtrl.showSavedIcon = true;
        }


        self.getNumOfSaved = function () {
            $http({
                url: self.serverUrl + "Poi/savedByDate",
                method: "GET",
                headers: {
                    'x-auth-token': localStorageModel.getLocalStorage('token')
                },
                params: { username: self.username }
            }).then(function (response) {
                if (response.data != "No saved points") {
                    return response.data.result.length;
                }
                else {
                    return 0;
                }
            }, function (response) {
                self.login.content = "Oops, something went wrong!";
            });
        }

        self.login = function () {
            $http({
                url: self.serverUrl + "User/login",
                method: "POST",
                params: {
                    username: self.username,
                    password: self.Password
                }
            }).then(function (response) {
                self.success = true;
                localStorageModel.updateLocalStorage('token', response.data.token);
                var saved = self.getNumOfSaved();
                self.updateIndexLogged(saved);
                $location.path('/home');
            }, function (response) {
                if (response.data == "Invalid details") {
                    self.success = false;
                } else {
                    self.login.content = "Oops, something went wrong!";
                }
            });
        }


        self.modal = document.getElementById('myModal');
        self.span = document.getElementsByClassName("close")[0];
        self.btn = document.getElementById("myBtn");


        /*$scope.btnclick = function () {

            self.modal.style.display = "block";
        }*/

        $scope.spanclick = function () {

            self.modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == self.modal) {
                self.modal.style.display = "none";
            }
        }

        self.threepopular();

        /////////// THIS IS THE FOR POINTS SECTION ///////////
        
        
        self.pointLastReviews = function (myid) {
            $http({
                url: self.serverUrl + "Poi/lastTwoReviews",
                method: "GET",
                params: { pointID: myid }
            })
                .then(function (response) {
                    $scope.indxCtrl.reviews = response.data.result;
                }, function (response) {
                });
        }


        self.raiseView = function (myid) {
            $http.put(self.serverUrl + "Poi/viewPoint", JSON.stringify({ pointID: myid }))
                .then(function (response) {
                    
                });
        }

        $scope.updateSelectedPoint = function (id) {
            for (var i = 0; i < self.threePopular.length; i++) {
                if (self.threePopular[i].id == id) {
                    var rank = self.threePopular[i].point.Rank;
                    if (rank == 0) {
                        $scope.indxCtrl.pointRank = "No ranks for this point";
                    } else {
                        rank = (rank/ 5) * 100;
                        $scope.indxCtrl.pointRank = rank + "%";
                    }
                    self.raiseView(self.threePopular[i].point.PointID);
                    self.threePopular[i].point.Views = self.threePopular[i].point.Views + 1;
                    $scope.indxCtrl.currPoint = self.threePopular[i].point;
                }
            }
        }

        $scope.btnclick = function (id) {
            $scope.updateSelectedPoint(id);
            self.pointLastReviews(id);
            $scope.indxCtrl.loggedIn = false;
            $scope.indxCtrl.modal.style.display = "block";
        }

        window.onclick = function (event) {
            if (event.target == self.modal) {
                $scope.indxCtrl.modal.style.display = "none";
            }
        }



    }]);




