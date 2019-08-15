let app = angular.module('myApp', ["ngRoute"]);

// config routes
app.config(function($routeProvider)  {
    $routeProvider
        // homepage
        .when('/', {
            // this is a template
            template: '<h1>This is the default route</h1>'
        })
        // about
        .when('/about', {
            // this is a template url
            templateUrl: 'pages/about/about.html',
            controller : 'aboutController as abtCtrl',
            css: 'pages/about/about.css'
            //css: ""
            //to Add here css!!! 
        })

        .when('/login', {
            // this is a template url
            templateUrl: 'pages/login/login.html',
            controller : 'loginController as loginCtrl',
            css: 'pages/login/loginStyle.css'
            //css: ""
            //to Add here css!!! 
        })

        .when('/register', {
            // this is a template url
            templateUrl: 'pages/register/register.html',
            controller : 'registerController as registerCtrl',
            css: 'pages/register/registerStyle.css'
            //css: ""
            //to Add here css!!! 
        })
        // poi
        
        .when('/showPoi', {
            templateUrl: 'pages/showPOI/showPoi.html',
            controller : 'displayPOIController as displayPOICtrl',
            css: 'pages/showPOI/showPoi.css'
        })
        .when('/user_poi', {
            templateUrl: 'pages/user_poi/user_poi.html',
            controller : 'userPOIController as UPCtrl',
            css: 'pages/user_poi/poiStyle.css'
        })
        
        .when('/poi', {
            templateUrl: 'pages/poi/poi.html',
            controller : 'poiController as poiCtrl',
            css: 'pages/poi/poi.css'
        })
       
        .otherwise({ redirectTo: '/' });
});


app.controller("myCtrl", function($scope,$http,$window,myService,$rootScope) {
    self = this;
    $scope.name="guest";
    $http.get('http://localhost:3000/poi/getRandomPOI').then(function(response){
        var poi1 = response.data.poi1;
        var poi2 = response.data.poi2;
        var poi3 = response.data.poi3;
        $http.get('http://localhost:3000/poi/getPOIByName/' + poi1).then(function(response){
            var image1 = response.data.image;
            $http.get('http://localhost:3000/poi/getPOIByName/' + poi2).then(function(response){
                var image2 = response.data.image;
                $http.get('http://localhost:3000/poi/getPOIByName/' + poi3).then(function(response){
                    var image3 = response.data.image;
                    $scope.pois = {
                        1: {name:poi1.replace(/_/g, ' '), image: image1},
                        2: {name:poi2.replace(/_/g, ' '), image: image2},
                        3: {name:poi3.replace(/_/g, ' '), image: image3}
                    }
                });
            });    
        });
      
    });
    
});