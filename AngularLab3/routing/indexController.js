angular.module('citiesApp')
    .controller('indexController',['setHeadersToken', function (setHeadersToken) {


        self = this;
        self.username = setHeadersToken.userName;
        self.showSavedIcon = false;
        self.numberOfSaved = 0;
        self.headers = [
            {hashbang:"#/login",value:"Login"},
            {hashbang:"#/register",value:"Register"},
            {hashbang:"#/poi",value:"POI"},
            {hashbang:"#/about",value:"About"}];
        
    }]);
