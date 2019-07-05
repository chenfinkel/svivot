

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

    
    .controller('passwordController', ['$location','$http', 'setHeadersToken','localStorageModel', function ($location, $http, setHeadersToken,localStorageModel) {


        self = this;
        self.serverUrl = 'http://localhost:4000/';
        self.wrongUser=false;
        self.wrongAnswers=false;
        self.wrongParameters=false;
        self.Password="";
        self.show=false;

        self.username ={
            userName:"4"
        }
        
        self.Answers={
            answer1: "",
            answer2: ""
        }

        self.popUp = function ()
        {
            self.username.userName= self.userName;
            self.answers();
            self.getPassword();

        }

        self.getPassword = function () {
            $http.post(self.serverUrl + "User/password", self.username)
                .then(function (response) {
                    //First function handles success
                    //self.message=response.data.message;
                    if(response.data.message)
                    {
                        self.show=false;
                        self.wrongParameters=true;
                    }
                    else
                    {
                    }
                    self.Password=response.data.password;
                }, function (response) {
                    //Second function handles error
                    self.login.content = "Something went wrong";
                });
        }

        self.answers = function () {
            // register user
            $http.post(self.serverUrl + "User/securityAnswers", self.username)
                .then(function (response) {
                    //First function handles success
                    //self.message=response.data.message;
                    if(response.data.message)
                    {
                        self.show=false;
                        self.wrongParameters=true;
                    }
                    else
                    {
                        self.Answers.answer1=response.data.answer1;
                        self.Answers.answer2=response.data.answer2;
                        if(self.Answers.answer1 == self.answer1 && self.Answers.answer2 == self.answer2)
                        {
                            self.show=true;
                            self.wrongParameters=false;
                        }
                        else
                        {
                            self.wrongParameters=true;
                            self.show=false;
                        }
                    }

                }, function (response) {
                    //Second function handles error
                    self.login.content = "Something went wrong";
                });
        }


    }]);


