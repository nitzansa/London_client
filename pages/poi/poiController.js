var poi = angular.module("myApp")
poi.config(function($routeProvider)  {
    $routeProvider
        // homepage
        .when('/', {
        })
        .when('/user_poi', {
            templateUrl: 'pages/user_poi/user_poi.html',
            controller : 'userPOIController as UPCtrl'
        })
        .when('/showPoi', {
            templateUrl: 'pages/showPOI/showPoi.html',
            controller : 'displayPOIController as displayPOICtrl'
        })
        .otherwise({ redirectTo: '/' });
});

poi.controller("poiController", function ($scope,myService,$window,$rootScope) {
    self = this;
    $scope.star = {};
    $scope.pois = [];

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

    if($window.sessionStorage.getItem('token')){
         myService.getSavedPOI()
        .then(function(response){
            if(response.data.pois){
                var pois = response.data.pois.split(',');
                for(var i = 0; i < pois.length; i++){
                    $scope.star[pois[i].replace(/_/g, ' ')] = true;
                }
            }
        }, function error(response){
        console.log(response.statusText);
        });
    }
    
    $scope.search = function(){
        $scope.onFilter = true;
        var name = $scope.poiname;
        myService.getPOIByName(name)
        .then(function(response){
            if(!response.data.name){
                $window.alert("This Point Of Interest is't exist")
                return;
            }else
                $scope.pois = [
                    {name: response.data.name.replace(/_/g, ' '), image: response.data.image, rating: response.data.rating}
                ] 
        }, function error(response){
            console.log(response.statusText);
        });
    }

    $scope.filter = function(){
        $scope.onFilter = true;
        var category = $scope.categories.replace(/ /g, '_');
        myService.getPOIByCategory(category)
        .then(function(response){
            $scope.pois = [
                {name: response.data[0]['name'].replace(/_/g, ' '), image: response.data[0]['picture'], rating: response.data[0]['rating']},
                {name: response.data[1]['name'].replace(/_/g, ' '), image: response.data[1]['picture'], rating: response.data[1]['rating']},
                {name: response.data[2]['name'].replace(/_/g, ' '), image: response.data[2]['picture'], rating: response.data[2]['rating']},
                {name: response.data[3]['name'].replace(/_/g, ' '), image: response.data[3]['picture'], rating: response.data[3]['rating']},
                {name: response.data[4]['name'].replace(/_/g, ' '), image: response.data[4]['picture'], rating: response.data[4]['rating']}
            ]
            $scope.checked = true;
        }, function error(response){
            console.log(response.statusText);
        });
    }

    $scope.sort = function(){
        $scope.pois.sort(function(a, b){return b.rating - a.rating});
        $scope.food.sort(function(a, b){return b.rating - a.rating});
        $scope.shopping_centers.sort(function(a, b){return b.rating - a.rating});
        $scope.observation_towers.sort(function(a, b){return b.rating - a.rating});
        $scope.architectural_buildings.sort(function(a, b){return b.rating - a.rating});
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
           console.log(response.data);
           $scope.star[name] = false;
           $window.sessionStorage.removeItem(name);
       }, function error(response){
        console.log(response.statusText);
        });
    }

    myService.getPOIByCategory("food")
    .then(function(response){
        $scope.food = [
            {name: response.data[0]['name'].replace(/_/g, ' ') , image: response.data[0]['picture'], rating: response.data[0]['rating']},
            {name: response.data[1]['name'].replace(/_/g, ' ') , image: response.data[1]['picture'], rating: response.data[1]['rating']},
            {name: response.data[2]['name'].replace(/_/g, ' ') , image: response.data[2]['picture'], rating: response.data[2]['rating']},
            {name: response.data[3]['name'].replace(/_/g, ' ') , image: response.data[3]['picture'], rating: response.data[3]['rating']},
            {name: response.data[4]['name'].replace(/_/g, ' ') , image: response.data[4]['picture'], rating: response.data[4]['rating']}
        ]
    }, function error(response){
        console.log(response.statusText);
    });
    myService.getPOIByCategory("shopping_centers")
    .then(function(response){
        $scope.shopping_centers = [
            {name: response.data[0]['name'].replace(/_/g, ' ') , image: response.data[0]['picture'], rating: response.data[0]['rating']},
            {name: response.data[1]['name'].replace(/_/g, ' ') , image: response.data[1]['picture'], rating: response.data[1]['rating']},
            {name: response.data[2]['name'].replace(/_/g, ' ') , image: response.data[2]['picture'], rating: response.data[2]['rating']},
            {name: response.data[3]['name'].replace(/_/g, ' ') , image: response.data[3]['picture'], rating: response.data[3]['rating']},
            {name: response.data[4]['name'].replace(/_/g, ' ') , image: response.data[4]['picture'], rating: response.data[4]['rating']}
        ]
    }, function error(response){
        console.log(response.statusText);
    });
    myService.getPOIByCategory("observation_towers")
    .then(function(response){
        $scope.observation_towers = [
            {name: response.data[0]['name'].replace(/_/g, ' ') , image: response.data[0]['picture'], rating: response.data[0]['rating']},
            {name: response.data[1]['name'].replace(/_/g, ' ') , image: response.data[1]['picture'], rating: response.data[1]['rating']},
            {name: response.data[2]['name'].replace(/_/g, ' ') , image: response.data[2]['picture'], rating: response.data[2]['rating']},
            {name: response.data[3]['name'].replace(/_/g, ' ') , image: response.data[3]['picture'], rating: response.data[3]['rating']},
            {name: response.data[4]['name'].replace(/_/g, ' ') , image: response.data[4]['picture'], rating: response.data[4]['rating']}
        ]
    }, function error(response){
        console.log(response.statusText);
    });
    myService.getPOIByCategory("architectural_buildings")
    .then(function(response){
        $scope.architectural_buildings = [
            {name: response.data[0]['name'].replace(/_/g, ' ') , image: response.data[0]['picture'], rating: response.data[0]['rating']},
            {name: response.data[1]['name'].replace(/_/g, ' ') , image: response.data[1]['picture'], rating: response.data[1]['rating']},
            {name: response.data[2]['name'].replace(/_/g, ' ') , image: response.data[2]['picture'], rating: response.data[2]['rating']},
            {name: response.data[3]['name'].replace(/_/g, ' ') , image: response.data[3]['picture'], rating: response.data[3]['rating']},
            {name: response.data[4]['name'].replace(/_/g, ' ') , image: response.data[4]['picture'], rating: response.data[4]['rating']}
        ]
    }, function error(response){
        console.log(response.statusText);
    });
});