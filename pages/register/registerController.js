var register = angular.module("myApp")

register.config(function($routeProvider)  {
    $routeProvider
        // homepage
        .when('/', {
            template: '<h1></h1>'
        })
        .when('/login', {
            templateUrl: 'pages/login/login.html',
            controller : 'loginController as loginCtrl'
        })
        .otherwise({ redirectTo: '/' });
});

register.controller("registerController", function ($scope,myService,$window,$rootScope) {
    $rootScope.hide3Img=true;
    $rootScope.hidePhoto=true;
    $scope.register = function() {
        var my_fname = $scope.fname;
        var my_lname = $scope.lname;
        var my_city = $scope.city;
        var my_country = $scope.country;
        var my_email = $scope.email;
        var my_categories = "";
        for(var i = 0; i < $scope.categories.length - 1; i++){
            my_categories = my_categories + $scope.categories[i].replace(/ /g, '_') + ",";
        }
        if($scope.categories.length === 1){
            $window.alert("please choose at least two categories")
            return;
        }
        my_categories = my_categories + $scope.categories[$scope.categories.length-1].replace(/ /g, '_');

        var my_prq1 = $scope.prq1;
        var my_prq2 = $scope.prq2;
        var my_pra1 = $scope.pra1;
        var my_pra2 = $scope.pra2;
        var my_uname = $scope.uname;
        var my_password = $scope.password;

        if(my_prq1 === my_prq2){
            $window.alert("you can't choose the same questions, pleace replace one of them to another question");
            return;
        }
        myService.register(my_uname, my_fname, my_lname, my_password, my_city, my_country, my_email, my_categories, my_prq1, my_prq2, my_pra1, my_pra2)
        .then(function(response){
            if(response.data === "user name is already exsist"){
                $window.alert("user name is already exist, please choose another one")
            }
            else{
                $window.alert("Your registration has been entered into the system, enjoy")
                $window.location.href ='#!login';
            }
        });
        
        
    }
});