angular.module('citiesApp')
 .controller('poiCtrl', ['$location','$scope','$http', 'setHeadersToken','localStorageModel', function ($location,$scope, $http, setHeadersToken,localStorageModel) {
 

    self = this;
    self.hello=true;
    self.serverUrl = 'http://localhost:4000/';
    self.poiId=[];
    self.cities = [];
    self.favorites=[];

    var token1 =localStorageModel.getLocalStorage('token');
    var userName1 = $scope.indxCtrl.userName;
    self.packet={
        userName:userName1,
        token:token1
    }

    self.category = [
        "restaurant",
        "museum",
        "shopping",
        "view point"];




    self.allPoi = function () {
        // register user
        var j=0;
        for(var i=0;i<self.category.length;i++)
        {
        $http({
            url:self.serverUrl + "Poi/poifromcategory",
            method:"GET",
            params:{Category:self.category[i]}
        })
            .then(function (response) {
                if(response.data.message=="no rows")
                {
               //     window.alert("no rows");
                }
                else
                {
                    for (var x in response.data){
                        self.cities[j]={
                            id:j,
                            city:response.data[x],
                            checked:false 
                        };
                        j++;
                    }
                    if(j==20)
                    {
                        self.pressCheck();
                    }
                }

            }, function (response) {
                self.reg.content = response.data
            });
        }
    }

    self.getAllSaved = function () {
        // register user
        var j=0;
        $http({
            url:self.serverUrl + "Poi/savedpoi",
            method:"GET",
            params:{userName:self.packet.userName,
                    token:self.packet.token}
        })
            .then(function (response) {
                if(response.data.message=="no rows")
                {
                  //  window.alert("no rows");
                }
                else
                {
                    for (var x in response.data){
                        self.poiId[j]=response.data[x].PoiId;
                        j++;
                    }
                    $scope.indxCtrl.fav=j;
                    self.pressCheck();
                }

            }, function (response) {

               // self.reg.content = response.data
            });
    }
    self.getAllSaved();
    self.allPoi();

    self.pressCheck= function (){
        var listnot =localStorageModel.getLocalStorage('listNotFav');
        var list =localStorageModel.getLocalStorage('listFav');
        $scope.indxCtrl.fav=0;
        for(var i=0;i<self.cities.length;i++)
        {
            for(var j=0;j<self.poiId.length;j++)
            {
                if(self.cities[i].city.PoiId==self.poiId[j])
                {
                    self.cities[i].checked=true;
                    $scope.indxCtrl.fav++;
                }
            }
            for(var j=0;j<list.length;j++)
            {
                if(self.cities[i].city.PoiId==list[j])
                {
                    self.cities[i].checked=true;
                    $scope.indxCtrl.fav++;
                }
            }
            for(var j=0;j<listnot.length;j++)
            {
                if(self.cities[i].city.PoiId==listnot[j])
                {
                    self.cities[i].checked=false;
                    $scope.indxCtrl.fav--;
                }
            }
        }   
    }



    self.selectedCity= function (id){

        //window.alert (self.selected )
    }
    
    self.checkButton= function (id){
        var listnot =localStorageModel.getLocalStorage('listNotFav');
        var list =localStorageModel.getLocalStorage('listFav');
        if(list.length!=0)
        {
            if(list.includes(id))
            {
                $scope.indxCtrl.fav--;
                var list1=[];
                for(var i=0;i<list.length;i++)
                {
                    if(list[i]!=id)
                    {
                        if(!self.poiId.includes(id))
                        {
                            list1.push(list[i]);
                        }
                    }
                }
                localStorageModel.updateLocalStorage('listFav',list1);
            }
            else
            {
                if(!self.poiId.includes(id))
                {
                    list.push(id);
                    $scope.indxCtrl.fav++;
                    localStorageModel.updateLocalStorage('listFav',list);
                }
            }
        }
        else
        {
            if(!self.poiId.includes(id))
            {
                list.push(id);
                $scope.indxCtrl.fav++;
                localStorageModel.updateLocalStorage('listFav',list);
            }
        }

        if(listnot.length!=0)
        {
            if(listnot.includes(id))
            {
                $scope.indxCtrl.fav++;
                var list1=[];
                for(var i=0;i<listnot.length;i++)
                {
                    if(listnot[i]!=id)
                    {
                        if(self.poiId.includes(id))
                        {
                            list1.push(listnot[i]);
                        }
                    }
                }
                localStorageModel.updateLocalStorage('listNotFav',list1);
            }
            else
            {
                if(self.poiId.includes(id))
                {
                    listnot.push(id);
                    $scope.indxCtrl.fav--;
                    localStorageModel.updateLocalStorage('listNotFav',listnot);
                }
            }
        }
        else
        {
            if(self.poiId.includes(id))
            {
                listnot.push(id);
                $scope.indxCtrl.fav--;
                localStorageModel.updateLocalStorage('listNotFav',listnot);
            }
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
            //  window.alert("errorrrrrrrrrrr");
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
         // window.alert("2 last review failed");
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
                 // window.alert("no avg");
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
             // window.alert("poi rank failed");
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
               //  window.alert("no avg");
             }
             else{
              //   window.alert(response.data.average);
                 self.currentPOIrank = (response.data.average/5)*100;
                 if(self.currentPOIrank == 0){
                     self.currentPOIrank="No one rank this poi";
                 }
                 else{
                     self.currentPOIrank= self.currentPOIrank +"%";
                 }
             }
         }, function (response) {
          //   window.alert("poi rank failed");
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
               //   window.alert("problem in raise view by 1");
              }
              if(response.data.message == "true"){
                  
              }
              self.poi2lastR(myid);
          }, function (response){
           //   window.alert("failed in raise view by 1");
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
          //   window.alert("liorlior");
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
          for(var i = 0; i < self.cities.length; i++){
          
              if(self.cities[i].id == myid){
                 
                  self.currentPOI = self.cities[i].city;
                  x = i;
              
              }
          }
          self.poiRank(self.currentPOI.PoiId);
          self.cities[x].city.Views = self.cities[x].city.Views + 1;
          
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
 
 