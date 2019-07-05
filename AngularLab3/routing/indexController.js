angular.module('citiesApp')
    .controller('indexController',['setHeadersToken', function (setHeadersToken) {


        self = this;
        self.userName = setHeadersToken.userName;
        self.showFav=false;
        self.fav=0;
        self.headers = [
            {hashbang:"#/login",value:"Login"},
            {hashbang:"#/register",value:"Register"},
            {hashbang:"#/poi",value:"POI"},
            {hashbang:"#/about",value:"About"}];
    }]);
