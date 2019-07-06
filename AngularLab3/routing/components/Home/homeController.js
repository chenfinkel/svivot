
angular.module('citiesApp')
    .controller('homeController', ['$location', '$scope', '$http', 'setHeadersToken', 'localStorageModel', function ($location, $scope, $http, setHeadersToken, localStorageModel) {

        self = this;
        self.serverUrl = 'http://localhost:3000/';


        self.lastTwoPoints = [];
        self.Populars = [];
        self.Password = "";
        self.show = false;
        self.username = $scope.indxCtrl.username;


        self.lastSaved = function () {
            // register user
            $http({
                url: self.serverUrl + "Poi/lastTwoSaved",
                method: "GET",
                headers: {
                    'x-auth-token': localStorageModel.getLocalStorage('token')
                },
                params: { username: self.username }
            })
                .then(function (response) {
                    var k = 0;
                    points = response.data.result;
                    for (i = 0; i < points.length; i++) {
                        $http({
                            url: self.serverUrl + "Poi/",
                            method: "GET",
                            params: { pointID: points[i].PointID }
                        })
                            .then(function (response) {
                                points2 = response.data.result;
                                for (j = 0; j < points2.length; j++) {
                                    self.lastTwoPoints[k] = {
                                        id: j,
                                        point: points2[j],
                                        checked: true
                                    };
                                    k++;
                                }
                            }, function (response) {
                                //self.reg.content = response.data
                            });
                    }
                }, function (response) {
                    //self.reg.content = response.data
                });
        }

        self.setPopular = function () {
            $http({
                url: self.serverUrl + "Poi/twopopular",
                method: "GET",
                headers: {
                    'x-auth-token': localStorageModel.getLocalStorage('token')
                },
                params: { username: self.username }
            })
                .then(function (response) {
                    popular = response.data.result;
                    for (i = 0; i < popular.length; i++) {
                        self.Populars[i] = {
                            id: i,
                            point: popular[i],
                            checked: false
                        }
                    }
                    self.pressCheck();


                }, function (response) {
                    //self.reg.content = response.data
                });
        }

        self.pressCheck = function () {
            var list = localStorageModel.getLocalStorage('listFav');
            for (i = 0; i < self.Populars.length; i++) {
                if (list.includes(self.Populars[i].point.PointID)) {
                    self.Populars[i].checked = true;
                }
            }
        }

        self.getAllSaved = function () {
            $http({
                url: self.serverUrl + "Poi/savedByDate",
                method: "GET",
                headers: {
                    'x-auth-token': localStorageModel.getLocalStorage('token')
                },
                params: { username: self.username }
            })
                .then(function (response) {
                    if (response.data == "No saved points") {
                        localStorageModel.updateLocalStorage('listFav', []);
                    } else {
                        list = [];
                        saved = response.data.result;
                        for (i = 0; i < saved.length; i++) {
                            list[i] = saved[i].PointID;
                        }
                        localStorageModel.updateLocalStorage('listFav', list);
                        $scope.indxCtrl.numberOfSaved = list.length;
                    }
                    self.pressCheck();
                }, function (response) {
                    // self.reg.content = response.data
                });
        }

        self.lastSaved();
        self.setPopular();
        self.getAllSaved();

        self.switchPopular = function (id) {
            self.switched(self.Populars, id);
        }

        self.switchSaved = function (id) {
            self.switched(self.lastTwoPoints, id);
        }

        self.switched = function (type, index) {
            type[index].checked = !type[index].checked;
            if (!type[index].checked) {
                var list = localStorageModel.getLocalStorage('listFav');
                var list2 = [];
                for (i = 0; i < list.length; i++) {
                    if (list[i] != type[index].point.PointID) {
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
                        pointID: type[index].point.PointID
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
                        pointID: type[index].point.PointID
                    }
                }).then(function (response) { })
            }
        }



        /*self.popUp = function () {
            self.username.userName = self.userName;
            self.answers();
            self.getPassword();

        }*/


        self.modal = document.getElementById('myModal');
        self.span = document.getElementsByClassName("close")[0];
        self.btn = document.getElementById("myBtn");


        $scope.btnclick = function () {

            self.modal.style.display = "block";
        }

        $scope.spanclick = function () {

            self.modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == self.modal) {
                self.modal.style.display = "none";
            }
        }

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

        $scope.updateSelectedPoint = function (type, id) {
            for (var i = 0; i < type.length; i++) {
                if (type[i].id == id) {
                    var rank = type[i].point.Rank;
                    if (rank == 0) {
                        $scope.indxCtrl.pointRank = "No ranks for this point";
                    } else {
                        rank = (rank/ 5) * 100;
                        $scope.indxCtrl.pointRank = rank + "%";
                    }
                    self.raiseView(type[i].point.PointID);
                    type[i].point.Views = type[i].point.Views + 1;
                    $scope.indxCtrl.currPoint = type[i].point;
                }
            }
        }

        $scope.popularClicked = function (id) {
            $scope.updateSelectedPoint(self.Populars, id);
            self.pointLastReviews(id);
            $scope.indxCtrl.loggedIn = true;
            $scope.indxCtrl.modal.style.display = "block";
        }

        $scope.savedClicked = function (id) {
            $scope.updateSelectedPoint(self.lastTwoPoints, id);
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


