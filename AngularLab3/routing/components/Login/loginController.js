
angular.module('citiesApp')
    /*.service('setHeadersToken',[ '$http', function ($http) {

        let token = ""

        this.set = function (t) {
            token = t
            $http.defaults.headers.common[ 'x-auth-token' ] = t
            console.log("set")

        }

        this.userName='guest';

    }])*/

    
    .controller('loginController', ['$location','$scope','$http', 'setHeadersToken','localStorageModel', function ($location,$scope, $http, setHeadersToken,localStorageModel) {
        // each poi has 6 attributes:
        // PoiId
        // PicturePath
        // Title
        // Description
        // Views
        // Category
        


        self = this;
        self.notSuccess=false;
        self.message="";
        self.serverUrl = 'http://localhost:3000/';
        self.PoiId={
            PoiId:"d"
        };

        self.user = {
            username: "s",
            password: "d"
        };
        // logout function
        self.threePopular=[];
        $scope.indxCtrl.userName= "guest";
        $scope.indxCtrl.headers = [
            {hashbang:"#/login",value:"Login"},
            {hashbang:"#/register",value:"Register"},
            {hashbang:"#/poi",value:"POI"},
            {hashbang:"#/about",value:"About"}];
        $scope.indxCtrl.showFav=false;
        localStorageModel.updateLocalStorage('token',"");
        localStorageModel.updateLocalStorage('listFav',[]);
        localStorageModel.updateLocalStorage('listNotFav',[]);

        self.threePopularId=[];

        self.threepopular = function () {
            // register user
            $http.get(self.serverUrl + "Poi/popular")
                .then(function (response) {
                    //First function handles success
                    popular = response.data.result;
                    if(popular.length > 0)
                    {
                        for (i = 0; i < popular.length; i++){
                            self.threePopular[i]={
                                id: i,
                                point: popular[i]
                            };
                        }   
                    }   
                    self.reg.content = response.data;
                }, function (response) {
                    self.reg.content = response.data
                });
        }
        self.threepopular();
        self.popUp = function ()
        {
            self.user.username=self.userName;
            self.user.password=self.Password;
            self.login();
        }

        self.directToPOI = function () {
            $location.path('/poi')
        }

        self.registerSend = function () {
            $location.path('/register')
        }
        self.passwordSend = function () {
            $location.path('/password')
        }


        self.getAllSaved = function () {
            var j=0;
            $http({
                url:self.serverUrl + "Poi/savedByDate",
                method:"GET",
                headers:{
                    'x-auth-token': localStorageModel.getLocalStorage('token')
                },
                params:{username:$scope.indxCtrl.userName}
            }).then(function (response) {
                if(!response.data.message=="No saved points"){
                    for (var x in response.data){
                        j++;
                    }
                    $scope.indxCtrl.fav=j;
                }
            }, function (response) {
            });
        }

        self.login = function () {
            // register user
            $http.post(self.serverUrl + "User/login", self.user)
                .then(function (response) {
                        self.notSuccess=false;
                        $scope.indxCtrl.userName= self.user.username;
                        $scope.indxCtrl.headers = [
                            {hashbang:"#/poi",value:"POI"},
                            {hashbang:"#/home",value:"Home"},
                            {hashbang:"#/about",value:"About"},
                            {hashbang:"#/logout",value:"Logout"}
                        ];
                        $scope.indxCtrl.showFav=true;
                        localStorageModel.updateLocalStorage('token',response.data.token);
                        self.getAllSaved();
                        $location.path('/home');
                }, function (response) {
                    if (response.data == "Invalid details"){
                        self.notSuccess=true;
                    } else {
                        self.login.content = "Something went wrong";
                    }
                });
        }

        self.reg = function () {
            // register user
            $http.post(serverUrl + "reg/", user)
                .then(function (response) {
                    //First function handles success
                    self.reg.content = response.data;

                }, function (response) {
                    self.reg.content = response.data
                    //Second function handles error
                    // self.reg.content = "Something went wrong";
                });
        }

        self.addTokenToLocalStorage = function (token) {
            localStorageModel.addLocalStorage('token', token)
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
self.poi2lastR = function(myid){
 $http({
     url:self.serverUrl + "Poi/lastTwoReviews",
     method:"GET",
     params:{pointID:myid}
 })
 .then(function (response) {
     self.reviews = response.data.result;
 }, function (response) {
 });
}

 self.currentPOIrank = {};
 self.poiRank = function(myid){
    if(self.currentPOI.Rank == 0){
        self.currentPOIrank="No ranks for this point";
    } else {
        self.currentPOIrank = (self.currentPOI.Rank/5)*100;
        self.currentPOIrank= self.currentPOIrank +"%";
    }
    self.raiseView(self.currentPOI.PointID);
 }

 self.poiRankS = function(myid){
    $http({
        url:self.serverUrl + "Poi/averagepoi",
        method:"GET",
        params:{PoiId:myid}
    })
    .then(function (response) {
        if(response.data.average == "Problem came up"){
    //        window.alert("no avg");
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
     $http.put(self.serverUrl + "Poi/viewPoint", JSON.stringify({pointID:myid}))
     .then(function (response) {
        self.poi2lastR(myid);
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
        //    window.alert("FAIL");
        }
    }, function (response) {
      //  window.alert("liorlior");
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
          //  window.alert("FAIL");
        }
    }, function (response) {
     //   window.alert("liorlior");
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
     //window.alert("id of picture is "+myid)
     var x = 0;
     for(var i = 0; i < self.threePopular.length; i++){
     
         if(self.threePopular[i].id == myid){
           // window.alert("hi");
             self.currentPOI = self.threePopular[i].point;
             x = i;
         
         }
     }
    // window.alert(self.currentPOI.PoiId);
     self.poiRank(self.currentPOI.PointID);
     self.threePopular[x].point.Views = self.threePopular[x].point.Views + 1;
     
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



    }]);


