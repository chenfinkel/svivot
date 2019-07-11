angular.module('parisApp')
    .controller('favoriteController', ['$location', '$scope', '$http', 'setHeadersToken', 'localStorageModel', function ($location, $scope, $http, setHeadersToken, localStorageModel) {
        if (!$scope.indxCtrl.showSavedIcon) {
            $location.path('/login');
        }

        self = this;
        self.serverUrl = 'http://localhost:3000/';


        self.username = $scope.indxCtrl.username;
        self.Category1 = "";

        self.Rank = "";
        self.temp = {};

        self.ordering = [];

        self.points = [];
        self.favorites = [];
        self.listNotLocal = [];
        self.paramPost = {
            userName: "",
            token: "",
            PoiId: "a",
            order: "b"
        }

        self.category = [
            "Museums",
            "Nature",
            "Food",
            "NightLife"];

            self.all = function(){
                self.Category1 = "";
            }

        self.getAllSaved = function () {
            $http({
                url: self.serverUrl + "Poi/savedByDate",
                method: "GET",
                headers: {
                    'x-auth-token': localStorageModel.getLocalStorage('token')
                },
                params: { username: $scope.indxCtrl.username }
            })
                .then(function (response) {
                    if (response.data == "No saved points") {
                        localStorageModel.updateLocalStorage('listFav', []);
                    } else {
                        var k = 0;
                        list = [];
                        self.temp = response.data.result;
                        for (i = 0; i < self.temp.length; i++) {
                            list[i] = self.temp[i].PointID;
                            $http({
                                url: self.serverUrl + "Poi/",
                                method: "GET",
                                params: { pointID: self.temp[i].PointID }
                            })
                                .then(function (response) {
                                    temp2 = response.data.result;
                                    for (j = 0; j < temp2.length; j++) {
                                        self.points[k] = {
                                            id: k,
                                            point: temp2[j],
                                            checked: true,
                                            userIndex: ""
                                        };
                                        k++;
                                    }
                                }, function (response) {
                                });
                            localStorageModel.updateLocalStorage('listFav', list);
                            $scope.indxCtrl.numberOfSaved = list.length;
                        }
                    }
                }, function (response) {
                });
        }

        self.getAllSaved();

        self.sortUserOrder = function(){
            self.points.sort(function(a,b){
                return a.userIndex - b.userIndex})
        }


        self.order = function (id) {
            console.log("id is: "+ id);
            pid = self.points[id].point.PointID;
            index = self.points[id].userIndex;
            var indexNumber = parseInt(index);
            if (!isNaN(indexNumber)) {
                if (indexNumber > 0) {
                    self.points[id].userIndex = indexNumber;
                    $http({
                        url: self.serverUrl + "Poi/savedIndex",
                        method: "POST",
                        headers: {
                            'x-auth-token': localStorageModel.getLocalStorage('token')
                        },
                        params: {
                            username: self.username,
                            pointID: pid,
                            index: indexNumber
                        }
                    }).then(function (response) {
                        window.alert("Index saved");
                    });
                }
                else {
                    window.alert("Number must be greater than zero");
                }
            }
            else {
                window.alert("Please enter a number");
            }

        }

        self.switched = function (index) {
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
            $scope.indxCtrl.loggedIn = true;
            $scope.indxCtrl.modal.style.display = "block";
        }

        window.onclick = function (event) {
            if (event.target == self.modal) {
                $scope.indxCtrl.modal.style.display = "none";
            }
        }


    }]);
