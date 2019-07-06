///////
angular.module('citiesApp')
    // .service('myService', function () { this.set = function() {return "hello"} })
    .service('setHeadersToken',[ '$http', function ($http) {

        let token = ""

        this.set = function (t) {
            token = t
            $http.defaults.headers.common[ 'x-access-token' ] = t
            // $httpProvider.defaults.headers.post[ 'x-access-token' ] = token
            console.log("set")

        }

        this.userName='guest';

    }])

    
    .controller('homeController', ['$location','$scope','$http', 'setHeadersToken','localStorageModel', function ($location,$scope, $http, setHeadersToken,localStorageModel) {


        self = this;
        self.lastTwoPoi=[]; // thats the one with the 2 last saved poi.
        self.populars = []; // that the one with the 2 popular
        self.serverUrl = 'http://localhost:3000/';
        self.wrongUser=false;
        self.wrongAnswers=false;
        self.wrongParameters=false;
        self.poiId=[];
        self.test={};
        self.Password="";
        self.show=false;
        self.username = $scope.indxCtrl.userName;
        self.lastSaved = function () {
            // register user
            $http({
                url:self.serverUrl + "Poi/lastTwoSaved",
                method:"GET",
                headers:{
                    'x-auth-token': localStorageModel.getLocalStorage('token')
                },
                params:{username:self.username}
            })
                .then(function (response) {
                    var k = 0;
                    points = response.data.result;
                        for(i = 0; i < points.length; i++) {
                            $http({
                                url:self.serverUrl + "Poi/",
                                method:"GET",
                                params:{pointID:points[i].PointID}
                            })
                            .then(function (response) {
                                points2 = response.data.result;
                                for(j = 0; j < points2.length; j++) {
                                    self.lastTwoPoi[k] = {
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
                url:self.serverUrl + "Poi/twopopular",
                method:"GET",
                headers:{
                    'x-auth-token': localStorageModel.getLocalStorage('token')
                },
                params:{username:self.username}
            })
                .then(function (response) {
                    popular = response.data.result;
                    for (i = 0; i < popular.length; i++){
                        self.populars[i] = {
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
        self.lastSaved();
        self.setPopular();
        self.pressCheck= function (){
            var list = localStorageModel.getLocalStorage('listFav');
            for(i = 0; i < self.populars.length; i++) {
                    if(list.includes(self.populars[i].point.PointID)){                        
                        self.populars[i].checked=true;    
                    }
            }   
        }
        self.getAllSaved = function () {
            $http({
                url:self.serverUrl + "Poi/savedByDate",
                method:"GET",
                headers:{
                    'x-auth-token': localStorageModel.getLocalStorage('token')
                },
                params:{username:self.username}
            })
                .then(function (response) {
                    if(response.data == "No saved points"){
                        localStorageModel.updateLocalStorage('listFav',[]);
                    } else {
                        list = [];
                        saved = response.data.result;
                        for (i = 0; i < saved.length; i++){
                            list[i] = saved[i].PointID;
                        }
                        localStorageModel.updateLocalStorage('listFav',list);
                        $scope.indxCtrl.fav = list.length;
                    }
                    self.pressCheck();
                }, function (response) {
                   // self.reg.content = response.data
                });
        }
        self.getAllSaved();
        self.checkButtonPop = function(id){
            self.switched(self.populars, id);
        }
        self.checkButtonLast = function(id){
            self.switched(self.lastTwoPoi, id);
    }

    self.switched = function(type, index) {
        type[index].checked = !type[index].checked;
        if (!type[index].checked){
            var list = localStorageModel.getLocalStorage('listFav');
            var list2 = [];
            for (i = 0; i < list.length; i++){
                if (list[i] != type[index].point.PointID) {
                    list2.push(list[i]);
                }
            }
            localStorageModel.updateLocalStorage('listFav',list2);
            $scope.indxCtrl.fav--;
            $http({
                url:self.serverUrl + "Poi/userPOI",
                method:"DELETE",
                headers:{
                    'x-auth-token': localStorageModel.getLocalStorage('token')
                },
                params:{username:self.username,
                        pointID:type[index].point.PointID}
            }).then(function (response) {})
        } else {
            $scope.indxCtrl.fav++;
            $http({
                url:self.serverUrl + "Poi/savePoint",
                method:"POST",
                headers:{
                    'x-auth-token': localStorageModel.getLocalStorage('token')
                },
                params:{username:self.username,
                        pointID:type[index].point.PointID}
            }).then(function (response) {})
        }
    }



        self.popUp = function ()
        {
            self.username.userName= self.userName;
            self.answers();
            self.getPassword();

        }


    self.modal=document.getElementById('myModal');
    self.span = document.getElementsByClassName("close")[0];
    self.btn = document.getElementById("myBtn");
    
    
    $scope.btnclick=function(){

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

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    self.disableButton=true;
    if(localStorageModel.getLocalStorage('token')!="")
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
         url:self.serverUrl + "Poi/lasttworeview",
         method:"GET",
         params:{PoiId:myid}
     })
     .then(function (response) {
         if(response.data.message == "no review for this poi"){
             
             self.firstLastReview="no review for this poi";
             self.secLastReview="no review for this poi";
         }
         else if(response.data.message == "No reviews"){
             //window.alert("errorrrrrrrrrrr");
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
      //   window.alert("2 last review failed");
     });
 }
 
     self.currentPOIrank = {};
     self.poiRank = function(myid){
         $http({
             url:self.serverUrl + "Poi/averagepoi",
             method:"GET",
             params:{PoiId:myid}
         })
         .then(function (response) {
             if(response.data.average == "Problem came up"){
              //   window.alert("no avg");
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
            url:self.serverUrl + "Poi/averagepoi",
            method:"GET",
            params:{PoiId:myid}
        })
        .then(function (response) {
            if(response.data.average == "Problem came up"){
               // window.alert("no avg");
            }
            else{
              //  window.alert(response.data.average);
                self.currentPOIrank = (response.data.average/5)*100;
                if(self.currentPOIrank == 0){
                    self.currentPOIrank="No one rank this poi";
                }
                else{
                    self.currentPOIrank= self.currentPOIrank +"%";
                }
            }
        }, function (response) {
          //  window.alert("poi rank failed");
        });
    }
 
     self.raiseView = function(myid){
         
         $http({
             url:self.serverUrl + "Poi/raisebyone",
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

     self.addReview = function(myusername,myid,mytext){
        self.userReview.userName = myusername;
        self.userReview.PoiId = myid;
        self.userReview.text = mytext;
        self.userReview.token=localStorageModel.getLocalStorage('token');       
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
                //window.alert("FAIL");
            }
        }, function (response) {
           // window.alert("liorlior");
        });
     }

     self.addRank = function(myusername,myid,myrank){
        self.userRank.userName = myusername;
        self.userRank.PoiId = myid;
        self.userRank.rank = myrank;
        self.userRank.token=localStorageModel.getLocalStorage('token');       
        $http.post(self.serverUrl + "Poi/rank", self.userRank)
        .then(function (response) {
            if(response.data.message == "true"){
                self.poiRankS(myid);
            }
            else{
               // window.alert("FAIL");
            }
        }, function (response) {
          //  window.alert("liorlior");
        });
     }

     self.newReview={
         userReview:"",
         userRank:""
     };
     $scope.addR=function(){
        var userName=$scope.indxCtrl.userName;
        var mypoiid = self.currentPOI.PoiId;
        if(self.newReview.userReview!=""){
            if(self.newReview.userReview != null){
                self.addReview(userName,mypoiid,self.newReview.userReview);
            }
        }
        if(self.newReview.userRank!=""){
            
            if(self.newReview.userRank == "1" || self.newReview.userRank == "2" || self.newReview.userRank == "3" || self.newReview.userRank == "4" || self.newReview.userRank == "5"){
                self.addRank(userName,mypoiid,self.newReview.userRank);
            }
        }
     }     
     $scope.preclick = function(myid)
     {
         var x = 0;
         for(var i = 0; i < self.populars.length; i++){
         
             if(self.populars[i].id == myid){
                
                 self.currentPOI = self.populars[i].city;
                 x = i;
             
             }
         }
         self.poiRank(self.currentPOI.PoiId);
         self.populars[x].city.Views = self.populars[x].city.Views + 1;
         
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
     ///////////////////////////////////////////////////////////////////////////////////////////////
     //////////////////////////////////////////////////////////////////////////////////////////////////////////
    self.disableButton2=true;
    if(localStorageModel.getLocalStorage('token')!="")
    {
        self.disableButton2=false;
    }
    else
    {
        self.disableButton2=true;
    }

    
    self.currentPOI2={};
    self.reviews2=[];
    self.firstLastReview2={};
    self.secLastReview2={};
    self.poi2lastR2 = function(myid2){
     $http({
         url:self.serverUrl + "Poi/lasttworeview",
         method:"GET",
         params:{PoiId:myid2}
     })
     .then(function (response) {
         if(response.data.message == "no review for this poi"){
             
             self.firstLastReview2="no review for this poi";
             self.secLastReview2="no review for this poi";
         }
         else if(response.data.message == "No reviews"){
         //    window.alert("errorrrrrrrrrrr");
         }
         else if(response.data.message == "2 reviews"){
             
             self.firstLastReview2=response.data.firstPoi.review;
             self.secLastReview2=response.data.secondPoi.review;
         }
         else{
             
             for (var x in response.data){
                 self.firstLastReview2=response.data[x].review;
                 self.secLastReview2="no review for this poi";
             }
         }
         self.reviews2[0] = {
             myD:self.firstLastReview2
         };
         self.reviews2[1] = {
             myD:self.secLastReview2
         };
     }, function (response) {
         //window.alert("2 last review failed");
     });
 }
 
     self.currentPOIrank2 = {};
     self.poiRank2 = function(myid2){
         $http({
             url:self.serverUrl + "Poi/averagepoi",
             method:"GET",
             params:{PoiId:myid2}
         })
         .then(function (response) {
             if(response.data.average == "Problem came up"){
               //  window.alert("no avg");
             }
             else{
                 self.currentPOIrank2 = (response.data.average/5)*100;
                 if(self.currentPOIrank2 == 0){
                     self.currentPOIrank2="No one rank this poi";
                 }
                 else{
                     self.currentPOIrank2= self.currentPOIrank2 +"%";
                 }
             }
             self.raiseView2(myid2);
         }, function (response) {
           //  window.alert("poi rank failed");
         });
     }

     self.poiRankS2 = function(myid2){
        $http({
            url:self.serverUrl + "Poi/averagepoi",
            method:"GET",
            params:{PoiId:myid2}
        })
        .then(function (response) {
            if(response.data.average == "Problem came up"){
              //  window.alert("no avg");
            }
            else{
                window.alert(response.data.average);
                self.currentPOIrank2 = (response.data.average/5)*100;
                if(self.currentPOIrank2 == 0){
                    self.currentPOIrank2="No one rank this poi";
                }
                else{
                    self.currentPOIrank2= self.currentPOIrank2 +"%";
                }
            }
        }, function (response) {
           // window.alert("poi rank failed");
        });
    }
 
     self.raiseView2 = function(myid2){
         
         $http({
             url:self.serverUrl + "Poi/raisebyone",
             method:"GET",
             params:{PoiId:myid2}
         })
         .then(function (response) {
             if(response.data.message == "No such poi exist"){
              //   window.alert("problem in raise view by 1");
             }
             if(response.data.message == "true"){
                 
             }
             self.poi2lastR2(myid2);
         }, function (response){
           //  window.alert("failed in raise view by 1");
         });
     }
 
     self.modal2=document.getElementById('myModal2');
     self.span2 = document.getElementsByClassName("close2")[0];
     self.btn2 = document.getElementById("myBtn2");
     
     self.userReview2 = {
        userName: "s",
        PoiId: "d",
        text: "f",
        token:"h"
    };

    self.userRank2 = {
        userName: "s",
        PoiId: "d",
        rank: "f",
        token:"h"
    };

     self.addReview2 = function(myusername2,myid2,mytext2){
        self.userReview2.userName = myusername2;
        self.userReview2.PoiId = myid2;
        self.userReview2.text = mytext2;
        self.userReview2.token=localStorageModel.getLocalStorage('token');       
        $http.post(self.serverUrl + "Poi/review", self.userReview2)
        .then(function (response) {
            if(response.data.message == "true"){
                self.secLastReview2 = self.firstLastReview2;
                self.firstLastReview2 = mytext2;
                self.reviews2[0] = {
                    myD:self.firstLastReview2
                };
                self.reviews2[1] = {
                    myD:self.secLastReview2
                };
            }
            else{
            //    window.alert("FAIL");
            }
        }, function (response) {
         //   window.alert("liorlior");
        });
     }

     self.addRank2 = function(myusername2,myid2,myrank2){
        self.userRank2.userName = myusername2;
        self.userRank2.PoiId = myid2;
        self.userRank2.rank = myrank2;
        self.userRank2.token=localStorageModel.getLocalStorage('token');       
        $http.post(self.serverUrl + "Poi/rank", self.userRank2)
        .then(function (response) {
            if(response.data.message == "true"){
                self.poiRankS2(myid2);
            }
            else{
           //     window.alert("FAIL");
            }
        }, function (response) {
          //  window.alert("liorlior");
        });
     }

     self.newReview2={
         userReview:"",
         userRank:""
     };

     $scope.addR2=function(){
        var userName2=$scope.indxCtrl.userName;
        var mypoiid2 = self.currentPOI2.PoiId;
        if(self.newReview2.userReview!=""){
            if(self.newReview2.userReview != null){
                self.addReview2(userName2,mypoiid2,self.newReview2.userReview);
            }
        }
        if(self.newReview2.userRank!=""){
            
            if(self.newReview2.userRank == "1" || self.newReview2.userRank == "2" || self.newReview2.userRank == "3" || self.newReview2.userRank == "4" || self.newReview2.userRank == "5"){
                self.addRank2(userName2,mypoiid2,self.newReview2.userRank);
            }
        }
     }     
     $scope.preclick2 = function(myid2)
     {
         var x2 = 0;
         for(var i = 0; i < self.lastTwoPoi.length; i++){
         
             if(self.lastTwoPoi[i].id == myid2){
                
                 self.currentPOI2 = self.lastTwoPoi[i].city;
                 x2 = i;
             
             }
         }
         //window.alert(self.currentPOI2.PoiId);
         self.poiRank2(self.currentPOI2.PoiId);
         self.lastTwoPoi[x2].city.Views = self.lastTwoPoi[x2].city.Views + 1;
         
     }
 
     $scope.btnclick2=function(myid2){
         
         $scope.preclick2(myid2);
         self.modal2.style.display = "block";
     }   
     
     $scope.spanclick2=function(){
         
         self.modal2.style.display = "none";
     }
     
     window.onclick = function(event) {
         if (event.target == self.modal) {
             self.modal2.style.display = "none";
         }
     }
     ///////////////////////////////////////////////////////////////////////////////////////////////

    }]);


