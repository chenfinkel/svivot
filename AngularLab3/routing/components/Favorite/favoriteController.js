angular.module('citiesApp')
.controller('favoriteController', ['$location','$scope','$http', 'setHeadersToken','localStorageModel', function ($location,$scope, $http, setHeadersToken,localStorageModel) {
  if(!$scope.indxCtrl.showFav)
  {
    $location.path('/login');
  }

  self = this;
  self.Category1="";//Category1

  self.Rank="";

  self.hello=true;
  self.ordering=[];
  self.serverUrl = 'http://localhost:4000/';
  self.poiId=[];
  self.cities = [];
  self.favorites=[];
  self.listNotLocal=[];
  self.paramPost={
    userName:"",
    token:"",
    PoiId:"a",
    order:"b"
  }

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
    self.Rank1=[
        "","Views"
    ];

      self.updateFav = function ()
      {
        var list = localStorageModel.getLocalStorage('listFav');
        var listNot = localStorageModel.getLocalStorage('listNotFav');
        var list1=[];    
        //self.listNotLocal=self.poiId;
       // window.alert(self.poiId);
        for(var i =0;i<self.poiId.length;i++)
        {
            self.listNotLocal[i]=self.poiId[i];//listnotlcal - the list from the database. of the saved place.
        }
        for(var i =0;i<list.length;i++)
        {
            self.poiId.push(list[i]);
          //window.alert(list[i]);
        }
        //window.alert(self.poiId);
        for(var j =0;j<self.poiId.length;j++)
        {
          /*for(var k=0;k<self.poiId.length;k++)
          {*/
             // window.alert(self.poiId);
            if(!listNot.includes(self.poiId[j])/*listNot[j]!=self.poiId[k]*/)
            {
                list1.push(self.poiId[j]);
                   // window.alert(self.poiId[k]);
            }
        /* }*/
        }
        if(list1.length!=0)
        {
          self.poiId=list1;
        }
        $scope.indxCtrl.fav=self.poiId.length;
      }

  self.allPoi = function () {
      // register user
      var j=0;
      for(var i=0;i<self.poiId.length;i++)
      {
      $http({
          url:self.serverUrl + "Poi/",
          method:"GET",
          params:{PoiId:self.poiId[i]}
      })
          .then(function (response) {
              if(response.data.message=="no rows")
              {
              //    window.alert("no rows");
              }
              else
              {
                  for (var x in response.data){
                      self.cities[j]={
                          id:j,
                          city:response.data[x],
                          checked:false,
                          text:""
                      };
                      j++;
                  }               
              }
              self.orderTheArray();
              self.pressCheck();

          }, function (response) {
              self.reg.content = response.data
          });
      }
  }
    self.orderTheArray= function (){
        list=[];
        self.ordering;
        self.cities;
        for(var i =0;i<self.ordering.length;i++)
        {
            for(var j=0;j<self.cities.length;j++)
            {
                if(self.ordering[i]==self.cities[j].city.PoiId)
                {
                 list.push(self.cities[j])
                }
            }
        }
        for(var i=0;i<self.cities.length;i++)
        {
            if(!list.includes(self.cities[i]))
            {
                list.push(self.cities[i]);
            }
        }
        self.cities=list;

    }

self.orderPoi=function (poiid,text)
{
    
    self.paramPost.userName=self.packet.userName;
    self.paramPost.token=self.packet.token;
    self.paramPost.PoiId=poiid;
    

    var orderNum = parseInt(text);
    if(!isNaN(orderNum)){
        self.paramPost.order=text;
        if(orderNum>0 && orderNum <=21){
            $http.post(self.serverUrl + "Poi/setOrderPoi", self.paramPost)
            .then(function (response) {

                //First function handles success
                if(response.data.message=="true")
                {
                    // we do something here
                }
               
            }, function (response) {
                //Second function handles error
                self.login.content = "Something went wrong";
            });
        }
        else{
            window.alert("number need to be 1-20")
        }
    }
    else{
        window.alert("enter a number");
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
                self.updateFav();               
                self.allPoi();
              }
              else
              {
                  for (var x in response.data){
                      self.poiId[j]=response.data[x].PoiId;
                      self.ordering[j]=response.data[x].PoiId;
                      j++;
                  }
                  window.alert(self.poiId[0]);
                  window.alert(self.poiId[1]);
                  window.alert(self.poiId[2]);
                  window.alert(self.poiId[3]);

                  $scope.indxCtrl.fav=j;
                  //add here the fav
                  self.updateFav();
                  //                  
                  self.allPoi();
                  
                  // still 5.
              }

          }, function (response) {

             // self.reg.content = response.data
          });
  }
  self.getAllSaved();

  self.pressCheck= function (){
      for(var i=0;i<self.cities.length;i++)
      {
          for(var j=0;j<self.poiId.length;j++)
          {
              if(self.cities[i].city.PoiId==self.poiId[j])
              {
                  self.cities[i].checked=true;
              }
          }
      } 
  }





  self.selectedCity= function (id){

     // window.alert (self.selected )
  }
  
  self.checkButton= function (id){
      var listnot =localStorageModel.getLocalStorage('listNotFav');
      var list =localStorageModel.getLocalStorage('listFav');

      if(list.includes(id))
      {
          var j=0;
          var list1=[]
          // remove the id
          $scope.indxCtrl.fav--;
        for(var i=0 ; i<list.length;i++)
        {
            //down the number by 1
            
            if(list[i]!=id)
            {// insert to the list
                list1[j]=list[i];
                j++;
            }
        }
        //set at local storage
        localStorageModel.updateLocalStorage('listFav',list1);
      }
      else
      {
          if(!self.listNotLocal.includes(id))
          {
              list.push(id);
              $scope.indxCtrl.fav++;
              localStorageModel.updateLocalStorage('listFav',list);
              //increase the number
              //set at local storage
          }
          
          if(listnot.includes(id))
          {
             // remove the id from listnot
             // down the name
             //set
             var j=0;
             var list1=[]
             // remove the id
             $scope.indxCtrl.fav++;
            for(var i=0 ; i<listnot.length;i++)
            {
               //up the number by 1
               
               if(listnot[i]!=id)
               {// insert to the list
                   list1[j]=listnot[i];
                   j++;
               }
           }
           //set at local storage
           localStorageModel.updateLocalStorage('listNotFav',list1);
          }
          else
          {
            if(self.listNotLocal.includes(id))
            {   
                // add the id to listnot
                // down the name
                // set at local
                listnot.push(id);
                $scope.indxCtrl.fav--;
                localStorageModel.updateLocalStorage('listNotFav',listnot);
                //increase the number
                //set at local storage
            }
          }
      }















      /*window.alert(id);
      if(list.length!=0)
      {
          if(list.includes(id))
          {
              $scope.indxCtrl.fav--;
              var list1=[];

              for(var i=0;i<list.length;i++)
              {
                  if(list[i]==id)
                  {

                  }
                  else
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
                list.push(id);
                $scope.indxCtrl.fav++;
                localStorageModel.updateLocalStorage('listFav',list);
          }
      }
      else
      {
              // we are here!          
              list.push(id);
              $scope.indxCtrl.fav++;
              localStorageModel.updateLocalStorage('listFav',list);
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
          if(!self.poiId.includes(id))
          {
              listnot.push(id);
              $scope.indxCtrl.fav--;
              localStorageModel.updateLocalStorage('listNotFav',listnot);
          }
      }*/
    
  }


   self.savePoi=function()
   {
       var list = localStorageModel.getLocalStorage('listFav');
       var listNot = localStorageModel.getLocalStorage('listNotFav');
       for(var i=0;i<listNot.length;i++)
       {
    $http({
        url:self.serverUrl + "Poi/poifromuser",
        method:"DELETE",
        params:{userName:self.packet.userName,
                token:self.packet.token,
                PoiId:listNot[i]}
    })
        .then(function (response) {
            if(response.data.message=="false")
            {
         //       window.alert("false");
            }
            else
            {
                //window.alert("true");
            }

        }, function (response) {

           // self.reg.content = response.data
        });
    }

    for(var i=0;i<list.length;i++)
    {
        var params = {
            token:localStorageModel.getLocalStorage('token'),
            PoiId:list[i],
            userName:$scope.indxCtrl.userName
        }
        $http.post(self.serverUrl + "Poi/poitouser", params)
        .then(function (response) {
            //First function handles success

            if(response.data.message=="false")
            {

            }
            else
            {
                //window.alert("Dide");
            }
           // self.login.content = response.data.token;
        }, function (response) {
            //Second function handles error
            self.login.content = "Something went wrong";
        });
    }
    localStorageModel.updateLocalStorage('listFav',[]);
    localStorageModel.updateLocalStorage('listNotFav',[]);



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


  self.addToCart = function (id, city) {
    //  window.alert(self.cities[0])
  //    window.alert(id);// the proper id.
   //   window.alert(city.name);// the object at the array up
    //  window.alert(self.amount[id]); // the value of the textbox
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
           url:self.serverUrl + "Poi/averagepoi",
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
          url:self.serverUrl + "Poi/averagepoi",
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
            //  window.alert("FAIL");
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
          //window.alert("liorlior");
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