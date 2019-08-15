var loginCtrl = angular.module("myApp")
loginCtrl.config(function($routeProvider)  {
    $routeProvider
        // homepage
        .when('/', {
            template: '<h1></h1>'
        })
        // about
        .when('/user_poi', {
            templateUrl: 'pages/user_poi/user_poi.html',
            controller : 'userPOIController as UPCtrl'
            
        })
        
        .when('/login', {
            templateUrl: 'pages/login/login.html',
            controller : 'loginController as loginCtrl'
        })
        .otherwise({ redirectTo: '/' });
});

loginCtrl.controller("loginController", function($scope,myService,$window,$rootScope) {
        self = this;
        
        $rootScope.hideRegister= $window.sessionStorage.getItem('hideReg');
        if(!($window.sessionStorage.getItem('hideReg'))){
            $rootScope.hideRegister=true;
        }
        $rootScope.login= $window.sessionStorage.getItem('login');
        if(!($window.sessionStorage.getItem('login'))){
            $rootScope.login=true;
        }
        $rootScope.logout= $window.sessionStorage.getItem('logout');
        if(!($window.sessionStorage.getItem('logout'))){
            $rootScope.logout=true;
        }
        $rootScope.name= $window.sessionStorage.getItem('username') || "guest";

        $scope.login = function(){
            var username = $scope.uname;
            var password = $scope.password;
            
            let key = 'token';
            myService.login(username, password)
            .then(function(response){
               if(response.data==="incorrect details"){
                   $window.alert("your answer isn't correct")
               }
               else{
                $rootScope.name=username;
                $rootScope.hideRegister=false;
                $rootScope.login=false;
                $rootScope.logout=false;
                $rootScope.hide3Img=true;
                $rootScope.hidePhoto=true;
                $window.sessionStorage.setItem(key, response.data.token);
                $window.sessionStorage.setItem('username',username);
                $window.sessionStorage.setItem('hideReg',false);
                $window.sessionStorage.setItem('logout',false);
                $window.sessionStorage.setItem('login',false);
                $window.location.href ='#!user_poi';
                
               }
            }, function error(response){
                console.log(response.statusText);
            });
        }
       
        $scope.getUserQuestion = function(username){
            myService.getUserQuestion(username)
            .then(function(response){
                $scope.questions = {
                        1: {q: response.data.question1},
                        2: {q: response.data.question2}
                }
            }, function error(response){
                console.log(response.statusText);
            });
        }

        $scope.check = function(username){
            if(username){
                $scope.forget=true
                $scope.getUserQuestion(username)
            }
            else{
               $window.alert("please insert your user name")
               $window.location.href ='#!login';
            }
        }
        
        $scope.restorePass = function(){
            if($scope.uname=== undefined || $scope.answer===undefined){
                $window.alert("please choose a question and your answer")
                return;
            }
            var username = $scope.uname;
            var answer = $scope.answer;
            var question = $scope.selected.q;
            
            myService.restorePass(username, question, answer)
           .then(function(response){
               if(!response.data.password){
                $window.alert("your answer is wrong, try again");
                return;   
               }
                $window.alert("Your Password: " + response.data.password);
                $window.location.href ='#!login';
           }, function error(response){
            console.log(response.statusText);
            });
        }

        $scope.logoutfunc = function(){
            if(!($window.sessionStorage.getItem('token'))){
                $window.alert("you must login first")
                return;
            }
            else{
                $window.sessionStorage.removeItem('token');
                $window.sessionStorage.removeItem('username');
                $window.sessionStorage.removeItem('hideReg');
                $window.sessionStorage.removeItem('logout');
                $window.sessionStorage.removeItem('login');
                $rootScope.name = "guest";
                $rootScope.hideRegister = true;
                $rootScope.login = true;
                $rootScope.logout = true;
                $rootScope.hide3Img=false;
                $window.location.href ='#!login';
            }
        }
    


});