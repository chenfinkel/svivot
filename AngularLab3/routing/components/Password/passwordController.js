

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
        self.serverUrl = 'http://localhost:3000/';
        self.wrongUser=false;
        self.wrongAnswers=false;
        self.wrongParameters=false;
        self.Password="";
        self.show=false;
        self.username = "";
        self.answer = "";
        self.index = 1;
        self.question = "";
        self.questions = ["What is your mother's pre-marriage last name?",
                          "What city were you born in?"];

        self.popUp = function ()
        {
            for (i = 0; i < 2; i++){
                if (self.question == self.questions[i]){
                    self.index = i+1;
                }
            }
            self.username = self.userName;
            //self.answers();
            self.getPassword();

        }

        self.getPassword = function () {
            $http({
                url:self.serverUrl + "User/password",
                method:"POST",
                params:{
                    username: self.username,
                    answer: self.answer,
                    index: self.index
                }
            }).then(function (response) {
                    self.show=true;
                    self.wrongParameters=false;
                    self.Password = response.data.result;
                }, function (response) {
                    self.show=false;
                    self.wrongParameters=true;
                    //self.login.content = response.data;
                });
        }

        /*self.answers = function () {
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
        }*/


    }]);


