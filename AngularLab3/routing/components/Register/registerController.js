

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

        this.userName='guest'
 

    }])

    
    .controller('registerController', ['$location', '$http', 'setHeadersToken','localStorageModel', function ($location, $http, setHeadersToken,localStorageModel) {


        self = this;
        self.exist=false;
        self.countChecked=0;
        self.valid=true;
        self.user = {
            username: "guest",
            Password: "abcd",
            Fname:"a",
            Lname:"b",
            Country:"c",
            City:"d",
            museums:"e",
            nature:"f",
            food:"g",
            nightlife: "h",
            Answer1:"i",
            Answer2:"j",
            mail:"k"
        }
        self.checkBoxFirst=true;
        self.Country = [];
        self.serverUrl = 'http://localhost:3000/'
        self.getCountry = function (){
            $http.get(self.serverUrl + "User/countries")
                .then(function (response) {
                    self.Country=response.data.countries;
                    self.signUp.content = response.data;
                }, function (response) {
                    self.signUp.content = "Something went wrong"; 
                });
        }
        self.getCountry();

        self.category = [
            {id:"Museums",checked:false},
            {id:"Nature",checked:false},
            {id:"Food",checked:false},
            {id:"NightLife",checked:false}];


        self.tricky = function (checkedBox){
            if(checkedBox==true)
            {
                self.countChecked++;
            }
            else
            {
                self.countChecked--;
            }
            if(self.countChecked>1)
            {
                self.valid=false;
            }
            else
            {
                self.valid=true;
            }
        }
        self.popUp = function (){
             self.user.username= self.userName;
             self.user.Password= self.Password;
             self.user.Fname=self.Fname;
             self.user.Lname=self.Lname;
             self.user.Country=self.Country1;
             self.user.City=self.city;
             if(self.category[0].checked){
                self.user.museums="1";
             } else {
                self.user.museums="0";
             } if(self.category[1].checked) {
                self.user.nature="1";
             } else {
                self.user.nature="0";
             } if(self.category[2].checked) {
                self.user.food="1";
             } else {
                self.user.food="0";
             }if(self.category[3].checked) {
                self.user.nightlife="1";
             }
             else
             {
                self.user.nightlife="0";
             }
             self.user.Answer1=self.answer1;
             self.user.Answer2=self.answer2;
             self.user.mail=self.email;
             var x=4;
             self.signUp();

        }



        self.signUp = function () {
            self.exist = true;
            // register user
            $http({
                url:self.serverUrl + "User/register",
                method:"POST",
                params:{
                    username: self.user.username,
                    Password: self.user.Password,
                    Firstname: self.user.Fname,
                    Lastname: self.user.Lname,
                    Country: self.user.Country,
                    City: self.user.City,
                    Answer1: self.user.Answer1,
                    Answer2: self.user.Answer2,
                    Email: self.user.mail,
                    Museums: self.user.museums,
                    Nature: self.user.nature,
                    Food: self.user.food,
                    NightLife: self.user.nightlife
                }
            })
                .then(function (response) {
                    self.signUp.content = response.data;
                    $location.path('/login');
                }, function (response) {
                    //Second function handles error
                    self.signUp.content = "";
                    errors = response.data.error;
                    for (i = 0; i < errors.length; i++){
                        if (errors[i] == "Username is taken"){
                            self.exist = false;
                        }
                        self.signUp.content += errors[i];
                        self.signUp.content += "\n";
                    }
                });
        }


        self.addTokenToLocalStorage = function () {
            localStorageModel.addLocalStorage('token', self.login.content)
        }



    }]);


