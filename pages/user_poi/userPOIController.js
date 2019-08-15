// poi controller
userPOI = angular.module("myApp")
userPOI.config(function($routeProvider)  {
    $routeProvider
        // homepage
        .when('/', {
            template: '<h2></h2>'
        })
        .when('/favorites', {
            templateUrl: 'pages/favorites/favorites.html',
            controller : 'favoritesController as favoritesCtrl',
            css: 'pages/favorites/favStyle.css'
        })
        .when('/poi', {
            templateUrl: 'pages/poi/poi.html',
            controller : 'poiController as poiCtrl',
            css: 'pages/poi/poi.css'
        })
        .otherwise({ redirectTo: '/' });
});

userPOI.controller("userPOIController", function($scope, $window, myService, $rootScope) {
    self = this;
    $scope.star = {};
    $scope.poisRec = [];

    if(!($window.sessionStorage.getItem('token'))){
        $window.alert("you must login first");
        $window.location.href ='#!poi';
        return;
    }
    else{
        myService.getSavedPOI()
        .then(function(response){
            if(response.data.pois){
                $rootScope.numOfFav = response.data.pois.split(',').length;
                var pois = response.data.pois.split(',');
                for(var i = 0; i < pois.length; i++){
                    $scope.star[pois[i].replace(/_/g, ' ')] = true;
                }
            }
        }, function error(response){
            console.log(response.statusText);
        });    
    }
    
    myService.getRecommendedPOI()
    .then(function(response){
        var poi1 = response.data.pois.split(',')[0];
        var poi2 = response.data.pois.split(',')[1];
        $scope.poiRec1 = poi1.replace(/_/g, ' ');
        $scope.poiRec2 = poi2.replace(/_/g, ' ');
        myService.getPOIByName(poi1)
        .then(function(response){
            var imgRec1 = response.data.image;
            $scope.poisRec.push({name: poi1, image: imgRec1})
        }, function error(response){
            console.log(response.statusText);
        });

        myService.getPOIByName(poi2)
        .then(function(response){
            var imgRec2 = response.data.image;
            $scope.poisRec.push({name: poi2, image: imgRec2})
        }, function error(response){
            console.log(response.statusText);
        });
    }, function error(response){
        console.log(response.statusText);
    });

    myService.getLastSavedPOI()
    .then(function(response){
        if(response.data === "user didn't saved any point of interest"){
            $scope.message1 = "You have no points of interest reserved to view.";
            $scope.message2 = "In order to save please click on the button";
            $scope.message3 = "below to go to the appropriate page.";
            return;
        }
        $scope.message = "";
        poisArr = response.data.pois.split(',');
        var poi1 = poisArr[0];
        var lastPoi1 = poi1.replace(/_/g, ' ');
        myService.getPOIByName(poi1)
        .then(function(response){
            var lastImg1 = response.data.image;
            if(poisArr.length > 1){
                var poi2 = poisArr[1];
                var lastPoi2 = poi2.replace(/_/g, ' ');
                myService.getPOIByName(poi2)
                .then(function(response){
                    var lastImg2 = response.data.image;
                    $scope.pois = {
                        1: {name:lastPoi1, image: lastImg1},
                        2: {name:lastPoi2, image: lastImg2}
                    }
                }, function error(response){
                    console.log(response.statusText);
                });
            }
            else{
                $scope.pois = {
                    1: {name:lastPoi1, image: lastImg1}
                }
            }
        }, function error(response){
            console.log(response.statusText);
        });
        
    }, function error(response){
        console.log(response.statusText);
    });    
    
    $scope.showFavorites = function(){
        $window.location.href ='#!favorites';
    }
    
    $scope.addToFavorits = function(name){
        if(!($window.sessionStorage.getItem('token'))){
            $window.alert("you must login first")
            return;
        }
        myService.addToFavorits(name.replace(/ /g, '_'))
        .then(function(response){
            $scope.star[name] = true;
            $window.sessionStorage.setItem(name,name);
        }, function error(response){
            console.log(response.statusText);
        });
    }

    $scope.deleteFromFavorits = function(name){
        if(!($window.sessionStorage.getItem('token'))){
            $window.alert("you must login first")
            return;
        }
        myService.deleteFromFavorits(name.replace(/ /g, '_'))
        .then(function(response){
            $scope.star[name] = false;
            $window.sessionStorage.removeItem(name);
        }, function error(response){
            console.log(response.statusText);
        });
    }

    $scope.showModal = function(poiName){
        if(!($window.sessionStorage.getItem('token'))){
            $window.alert("you must login first")
            return;
        }
        $("#myModal").modal();
        $scope.poiNameForReview = poiName;
        $scope.uname = $window.sessionStorage.getItem('username');
    }

    $scope.postReview = function(poiName){
        if(!$scope.rating)
            return;
        var numOfRating = parseFloat($scope.rating, 10);
        myService.postReview(poiName.replace(/ /g, '_'), $scope.content, numOfRating)
        .then(function(response){
        }, function error(response){
        console.log(response.statusText);
        });
        $("#myModal").modal('hide');
    }
    
});






