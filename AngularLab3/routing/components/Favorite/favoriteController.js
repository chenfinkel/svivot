angular.module('citiesApp')
    .controller('favoriteController', ['$location', '$scope', '$http', 'setHeadersToken', 'localStorageModel', function ($location, $scope, $http, setHeadersToken, localStorageModel) {
        if (!$scope.indxCtrl.showSavedIcon) {
            $location.path('/login');
        }

        self = this;
        self.serverUrl = 'http://localhost:3000/';


        self.username = $scope.indxCtrl.username;
        self.Category1 = "";//Category1

        self.Rank = "";

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
                        temp = response.data.result;
                        for (i = 0; i < temp.length; i++) {
                            list[i] = temp[i].PointID;
                            $http({
                                url: self.serverUrl + "Poi/",
                                method: "GET",
                                params: { pointID: temp[i].PointID }
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
                                    //self.reg.content = response.data
                                });
                            localStorageModel.updateLocalStorage('listFav', list);
                            $scope.indxCtrl.numberOfSaved = list.length;
                        }
                    }
                }, function (response) {
                    // self.reg.content = response.data
                });
        }

        self.getAllSaved();


        self.orderTheArray = function () {
            list = [];
            self.ordering;
            self.points;
            for (var i = 0; i < self.ordering.length; i++) {
                for (var j = 0; j < self.points.length; j++) {
                    if (self.ordering[i] == self.points[j].point.PoiId) {
                        list.push(self.points[j])
                    }
                }
            }
            for (var i = 0; i < self.points.length; i++) {
                if (!list.includes(self.points[i])) {
                    list.push(self.points[i]);
                }
            }
            self.points = list;
        }


        self.order = function (id) {
            console.log("id is: "+ id);
            pid = self.points[id].point.PointID;
            index = self.points[id].point.userIndex;
            console.log("userindex is: " + index);
            var indexNumber = parseInt(index);
            if (!isNaN(indexNumber)) {
                if (indexNumber > 0) {
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
            $scope.indxCtrl.loggedIn = false;
            $scope.indxCtrl.modal.style.display = "block";
        }

        window.onclick = function (event) {
            if (event.target == self.modal) {
                $scope.indxCtrl.modal.style.display = "none";
            }
        }


    }]);



  //////////////////////////////////////////////////////////////////////////////////////////////////////////
/**   self.disableButton=true;
  if(self.token!="")
  {
      self.disableButton=false;
  }
  else
  {
      self.disableButton=true;
  }


  self.currentPOI={};
  self.reviews=[];
  self.firstLastReview={};
  self.secLastReview={};
  self.poi2lastR = function(myid){
   $http({
       url:self.serverUrl + "Poi/lastTwoReviews",
       method:"GET",
       params:{PoiId:myid}
   })
   .then(function (response) {
       if(response.data.message == "no review for this poi"){

           self.firstLastReview="no review for this poi";
           self.secLastReview="no review for this poi";
       }
       else if(response.data.message == "No reviews"){
    //       window.alert("errorrrrrrrrrrr");
       }
       else if(response.data.message == "2 reviews"){

           self.firstLastReview=response.data.firstPoi.review;
           self.secLastReview=response.data.secondPoi.review;
       }
       else{

           for (var x in response.data){
               self.firstLastReview=response.data[x].review;
               self.secLastReview="no review for this poi";
           }
       }
       self.reviews[0] = {
           myD:self.firstLastReview
       };
       self.reviews[1] = {
           myD:self.secLastReview
       };
   }, function (response) {
   //    window.alert("2 last review failed");
   });
}

   self.currentPOIrank = {};
   self.poiRank = function(myid){
       $http({
           url:self.serverUrl + "Poi/rank",
           method:"GET",
           params:{PoiId:myid}
       })
       .then(function (response) {
           if(response.data.average == "Problem came up"){
             //  window.alert("no avg");
           }
           else{
               self.currentPOIrank = (response.data.average/5)*100;
               if(self.currentPOIrank == 0){
                   self.currentPOIrank="No one rank this poi";
               }
               else{
                   self.currentPOIrank= self.currentPOIrank +"%";
               }
           }
           self.raiseView(myid);
       }, function (response) {
         //  window.alert("poi rank failed");
       });
   }

   self.poiRankS = function(myid){
      $http({
          url:self.serverUrl + "Poi/rank",
          method:"GET",
          params:{PoiId:myid}
      })
      .then(function (response) {
          if(response.data.average == "Problem came up"){
           //   window.alert("no avg");
          }
          else{
//window.alert(response.data.average);
              self.currentPOIrank = (response.data.average/5)*100;
              if(self.currentPOIrank == 0){
                  self.currentPOIrank="No one rank this poi";
              }
              else{
                  self.currentPOIrank= self.currentPOIrank +"%";
              }
          }
      }, function (response) {
      //    window.alert("poi rank failed");
      });
  }

   self.raiseView = function(myid){

       $http({
           url:self.serverUrl + "Poi/viewPoi",
           method:"GET",
           params:{PoiId:myid}
       })
       .then(function (response) {
           if(response.data.message == "No such poi exist"){
              // window.alert("problem in raise view by 1");
           }
           if(response.data.message == "true"){

           }
           self.poi2lastR(myid);
       }, function (response){
          // window.alert("failed in raise view by 1");
       });
   }

   self.modal=document.getElementById('myModal');
   self.span = document.getElementsByClassName("close")[0];
   self.btn = document.getElementById("myBtn");

   self.userReview = {
      userName: "s",
      PoiId: "d",
      text: "f",
      token:"h"
  };

  self.userRank = {
      userName: "s",
      PoiId: "d",
      rank: "f",
      token:"h"
  };

   self.addReview = function(myid,mytext){
      self.userReview.userName = $scope.indxCtrl.userName;
      self.userReview.PoiId = myid;
      self.userReview.text = mytext;
      self.userReview.token=self.token;
      $http.post(self.serverUrl + "Poi/review", self.userReview)
      .then(function (response) {
          if(response.data.message == "true"){
              self.secLastReview = self.firstLastReview;
              self.firstLastReview = mytext;
              self.reviews[0] = {
                  myD:self.firstLastReview
              };
              self.reviews[1] = {
                  myD:self.secLastReview
              };
          }
          else{
            //  window.alert("FAIL");
          }
      }, function (response) {
         // window.alert("liorlior");
      });
   }

   self.addRank = function(myid,myrank){
      self.userRank.userName = $scope.indxCtrl.userName;
      self.userRank.PoiId = myid;
      self.userRank.rank = myrank;
      self.userRank.token=self.token;
      $http.post(self.serverUrl + "Poi/rank", self.userRank)
      .then(function (response) {
          if(response.data.message == "true"){
              self.poiRankS(myid);
          }
          else{
             // window.alert("FAIL");
          }
      }, function (response) {
          //window.alert("liorlior");
      });
   }

   self.newReview={
       userReview:"",
       userRank:""
   };
   $scope.addR=function(){
      var mypoiid = self.currentPOI.PoiId;
      if(self.newReview.userReview!=""){
          if(self.newReview.userReview != null){
              self.addReview($scope.indxCtrl.userName,mypoiid,self.newReview.userReview);
          }
      }
      if(self.newReview.userRank!=""){

          if(self.newReview.userRank == "1" || self.newReview.userRank == "2" || self.newReview.userRank == "3" || self.newReview.userRank == "4" || self.newReview.userRank == "5"){
              self.addRank($scope.indxCtrl.userName,mypoiid,self.newReview.userRank);
          }
      }
   }
   $scope.preclick = function(myid)
   {
       var x = 0;
       for(var i = 0; i < self.points.length; i++){

           if(self.points[i].id == myid){

               self.currentPOI = self.points[i].point;
               x = i;

           }
       }
       self.poiRank(self.currentPOI.PoiId);
       self.points[x].point.Views = self.points[x].point.Views + 1;

   }

   $scope.btnclick=function(myid){
       $scope.preclick(myid);
       self.modal.style.display = "block";
   }

   $scope.spanclick=function(){

       self.modal.style.display = "none";
   }

   window.onclick = function(event) {
       if (event.target == self.modal) {
           self.modal.style.display = "none";
       }
   }
}]);
   ///////////////////////////////////////////////////////////////////////////////////////////////
*/
