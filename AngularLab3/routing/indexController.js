angular.module('citiesApp')
    .controller('indexController',['$location','$scope','$http', 'setHeadersToken','localStorageModel', function ($location,$scope, $http, setHeadersToken,localStorageModel) {


        self = this;
        self.username = setHeadersToken.userName;
        self.showSavedIcon = false;
        self.numberOfSaved = 0;
        self.headers = [
            {hashbang:"#/login",value:"Login"},
            {hashbang:"#/register",value:"Register"},
            {hashbang:"#/poi",value:"POI"},
            {hashbang:"#/about",value:"About"}];

        self.modal = document.getElementById('myModal');
        self.span = document.getElementsByClassName("close")[0];
        self.btn = document.getElementById("myBtn");
        self.currPoint = {};
        self.pointRank = {};
        self.reviews = [];
        self.loggedIn = false;

        self.userReview = {
            userName: "s",
            PoiId: "d",
            text: "f",
            token: "h"
        };
        self.userRank = {
            userName: "s",
            PoiId: "d",
            rank: "f",
            token: "h"
        };
        self.newReview = {
            userReview: "",
            userRank: ""
        };

        
        self.addReview = function (myusername, myid, mytext) {
            self.userReview.userName = myusername;
            self.userReview.PoiId = myid;
            self.userReview.text = mytext;
            self.userReview.token = localStorageModel.getLocalStorage('token');
            $http.post(self.serverUrl + "Poi/review", self.userReview)
                .then(function (response) {
                    if (response.data.message == "true") {
                        self.secLastReview = self.firstLastReview;
                        self.firstLastReview = mytext;
                        self.reviews[0] = {
                            myD: self.firstLastReview
                        };
                        self.reviews[1] = {
                            myD: self.secLastReview
                        };
                    }
                    else {
                        //    window.alert("FAIL");
                    }
                }, function (response) {
                    //  window.alert("liorlior");
                });
        }

        self.addRank = function (myusername, myid, myrank) {
            self.userRank.userName = myusername;
            self.userRank.PoiId = myid;
            self.userRank.rank = myrank;
            self.userRank.token = localStorageModel.getLocalStorage('token');
            $http.post(self.serverUrl + "Poi/rank", self.userRank)
                .then(function (response) {
                    if (response.data.message == "true") {
                        self.poiRankS(myid);
                    }
                    else {
                        //  window.alert("FAIL");
                    }
                }, function (response) {
                    //   window.alert("liorlior");
                });
        }


        $scope.addR = function () {
            var userName = $scope.indxCtrl.username;
            var mypoiid = self.currentPOI.PoiId;
            if (self.newReview.userReview != "") {
                if (self.newReview.userReview != null) {
                    self.addReview(userName, mypoiid, self.newReview.userReview);
                }
            }
            if (self.newReview.userRank != "") {

                if (self.newReview.userRank == "1" || self.newReview.userRank == "2" || self.newReview.userRank == "3" || self.newReview.userRank == "4" || self.newReview.userRank == "5") {
                    self.addRank(userName, mypoiid, self.newReview.userRank);
                }
            }
        }

           

        self.poiRankS = function (myid) {
            $http({
                url: self.serverUrl + "Poi/averagepoi",
                method: "GET",
                params: { PoiId: myid }
            })
                .then(function (response) {
                    if (response.data.average == "Problem came up") {
                        //        window.alert("no avg");
                    }
                    else {
                        //  window.alert(response.data.average);
                        self.currentPOIrank = (response.data.average / 5) * 100;
                        if (self.currentPOIrank == 0) {
                            self.currentPOIrank = "No one rank this poi";
                        }
                        else {
                            self.currentPOIrank = self.currentPOIrank + "%";
                        }
                    }
                }, function (response) {
                    //  window.alert("poi rank failed");
                });
        }

        $scope.spanclick = function () {

            $scope.indxCtrl.modal.style.display = "none";
        }
    }]);
