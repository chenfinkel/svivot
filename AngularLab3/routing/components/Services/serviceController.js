

angular.module('parisApp')
    .service('setHeadersToken',[ '$http', function ($http) {

        let token = ""

        this.set = function (t) {
            token = t
            $http.defaults.headers.common[ 'x-access-token' ] = t
            console.log("set")

        }

        this.userName='guest';
 

    }])

    
    .controller('serviceController', ['$location', '$http', 'setHeadersToken','localStorageModel', function ($location, $http, setHeadersToken,localStorageModel) {


        self = this;

        self.directToPOI = function () {
            $location.path('/poi')
        }

        let serverUrl = 'http://localhost:8080/'

        let user = {
            userName: "guest",
            password: "abcd",
            isAdmin: true
        }


        self.signUp = function () {
            $http.post(serverUrl + "Users/", user)
                .then(function (response) {
                    self.signUp.content = response.data;
                }, function (response) {
                    self.signUp.content = "Something went wrong";
                });
        }

        self.login = function () {
            $http.post(serverUrl + "Users/login", user)
                .then(function (response) {
                    self.login.content = response.data.token;
                    console.log("fffffffffffffffffff" + self.login.content);
                    setHeadersToken.set(self.login.content)


                }, function (response) {
                    self.login.content = "Something went wrong";
                });
        }

        self.reg = function () {
            $http.post(serverUrl + "reg/", user)
                .then(function (response) {
                    self.reg.content = response.data;
                }, function (response) {
                    self.reg.content = response.data
                });
        }

        self.addTokenToLocalStorage = function () {
            localStorageModel.addLocalStorage('token', self.login.content)
        }



    }]);


