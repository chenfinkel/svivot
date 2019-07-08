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

        self.review = "";
        self.rank = "";

        self.ranks = [1,2,3,4,5];
        
        $scope.addReview = function () {
            $http({
                url: self.serverUrl + "Poi/review",
                method: "POST",
                headers: {
                    'x-auth-token': localStorageModel.getLocalStorage('token')
                },
                params: {
                    pointID: $scope.indxCtrl.currPoint.PointID,
                    username: $scope.indxCtrl.username,
                    review: $scope.indxCtrl.review
                }
            }).then(function (response) {
                    window.alert("Review saved!");
                }, function (response) {
                });
        }

        self.addRank = function () {
            console.log($scope.indxCtrl.username);
            $http({
                url: self.serverUrl + "Poi/rank",
                method: "POST",
                headers: {
                    'x-auth-token': localStorageModel.getLocalStorage('token')
                },
                params: {
                    pointID: $scope.indxCtrl.currPoint.PointID,
                    username: $scope.indxCtrl.username,
                    rank: $scope.indxCtrl.rank
                }
            }).then(function (response) {
                    window.alert("Rank saved!");
                }, function (response) {
                });
        }

        $scope.spanclick = function () {

            $scope.indxCtrl.modal.style.display = "none";
        }
    }]);
