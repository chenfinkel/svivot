let app = angular.module('citiesApp', ["ngRoute", 'LocalStorageModule']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {


    $locationProvider.hashPrefix('');


    $routeProvider/*.when('/', {
        template: '<h1>This is the default route</h1>'
    })*/
        .when('/about', {
            templateUrl: 'components/About/about.html',
            controller : 'aboutController as abtCtrl'
        })
        .when('/poi', {
            templateUrl: 'components/POI/poi.html',
            controller : 'poiCtrl as poiCtrl'
        })
        .when('/service', {
            templateUrl: 'components/Services/service.html',
            controller : 'serviceController as srvCtrl'
        })
        .when('/register', {
            templateUrl: 'components/Register/register.html',
            controller : 'registerController as rgstrCtrl'
        })
        .when('/password', {
            templateUrl: 'components/Password/password.html',
            controller : 'passwordController as pssCtrl'
        })
        .when('/login', {
            templateUrl: 'components/Login/login.html',
            controller : 'loginController as lgnCtrl'
        })
        .when('/logout', {
            templateUrl: 'components/Login/login.html',
            controller : 'loginController as lgnCtrl'
        })
        .when('/home', {
            templateUrl: 'components/Home/home.html',
            controller : 'homeController as hmCtrl'
        })
        .when('/favorite', {
            templateUrl: 'components/Favorite/favorite.html',
            controller : 'favoriteController as fvrCtrl'
        })
        .otherwise({ redirectTo: '/login' });

        
}]);










