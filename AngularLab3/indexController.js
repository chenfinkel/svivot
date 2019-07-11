angular.module('parisApp')
    .controller('indexController',['setHeadersToken', function (setHeadersToken) {


        self = this;

        self.userName = setHeadersToken.userName

    }]);
