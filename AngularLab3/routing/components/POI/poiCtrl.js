angular.module('citiesApp')
    .controller('poiCtrl', ['$location', '$scope', '$http', 'setHeadersToken', 'localStorageModel', function ($location, $scope, $http, setHeadersToken, localStorageModel) {


        self = this;
        self.serverUrl = 'http://localhost:3000/';


        self.username = $scope.indxCtrl.username;
        self.points = [];

        self.category = [
            "Museums",
            "Nature",
            "Food",
            "NightLife"];


        self.getAllPoints = function () {
            for (var i = 0; i < self.category.length; i++) {
                $http({
                    url: self.serverUrl + "Poi/pointByCategory",
                    method: "GET",
                    params: { Category: self.category[i] }
                })
                    .then(function (response) {
                        if (response.data != "No points in this category") {
                            result = response.data.result;
                            for (i = 0; i < result.length; i++) {
                                self.points[i] = {
                                    id: i,
                                    point: result[i],
                                    checked: false
                                };
                            }
                            self.pressCheck();
                        }

                    }, function (response) {
                        //self.reg.content = response.data
                    });
            }
        }
        
        self.getAllPoints();

        self.pressCheck = function () {
            var list = localStorageModel.getLocalStorage('listFav');
            for (i = 0; i < self.points.length; i++) {
                if (list.includes(self.points[i].point.PointID)) {
                    self.points[i].checked = true;
                }
            }
        }


        /////////// THIS IS THE FOR POINTS SECTION ///////////

        
        self.modal = document.getElementById('myModal');
        self.span = document.getElementsByClassName("close")[0];

        $scope.spanclick = function () {

            self.modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == self.modal) {
                self.modal.style.display = "none";
            }
        }

        self.switch = function (index) {
            self.points[index].checked = !self.points[index].checked;
            if (!self.points[index].checked) {
                var list = localStorageModel.getLocalStorage('listFav');
                var list2 = [];
                for (i = 0; i < list.length; i++) {
                    if (list[i] != self.points[index].point.PointID) {
                        list2.push(list[i]);
                    }
                }
                localStorageModel.updateLocalStorage('listFav', list2);
                $scope.indxCtrl.numberOfSaved--;
                $http({
                    url: self.serverUrl + "Poi/userPOI",
                    method: "DELETE",
                    headers: {
                        'x-auth-token': localStorageModel.getLocalStorage('token')
                    },
                    params: {
                        username: self.username,
                        pointID: self.points[index].point.PointID
                    }
                }).then(function (response) { })
            } else {
                $scope.indxCtrl.numberOfSaved++;
                $http({
                    url: self.serverUrl + "Poi/savePoint",
                    method: "POST",
                    headers: {
                        'x-auth-token': localStorageModel.getLocalStorage('token')
                    },
                    params: {
                        username: self.username,
                        pointID: self.points[index].point.PointID
                    }
                }).then(function (response) { })
            }
        }


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
            for (var i = 0; i < self.points.length; i++) {
                if (self.points[i].id == id) {
                    var rank = self.points[i].point.Rank;
                    if (rank == 0) {
                        $scope.indxCtrl.pointRank = "No ranks for this point";
                    } else {
                        rank = (rank / 5) * 100;
                        $scope.indxCtrl.pointRank = rank + "%";
                    }
                    self.raiseView(self.points[i].point.PointID);
                    self.points[i].point.Views = self.points[i].point.Views + 1;
                    $scope.indxCtrl.currPoint = self.points[i].point;
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

