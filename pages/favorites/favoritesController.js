var favorites = angular.module("myApp")

favorites.controller("favoritesController", function ($scope, $window, myService, $rootScope) {
    self = this;
    $scope.star = {};
    $scope.orders = {};
    $scope.food = [];
    $scope.shopping_centers = [];
    $scope.observation_towers = [];
    $scope.architectural_buildings = [];
    $scope.ordersNumbers = [];
    if(!($window.sessionStorage.getItem('token'))){
        $window.location.href ='#!index';
        return;
    }
    
    myService.getSavedPOI()
    .then(function(response){
        if(!response.data.pois)
            return;
        $scope.pois = [];
        $scope.poisOrders = {};
        var allUserPOItest = [];
        var allUserPOIs = response.data.pois.split(',');
        var allOrdersUserPOIs = response.data.orders.split(',');
        for(var i = 0; i < allUserPOIs.length; i++){
            allUserPOItest.push({name: allUserPOIs[i].replace(/_/g, ' '), order: allOrdersUserPOIs[i]})
        }
        allUserPOItest.sort(function(a, b){return a.order - b.order});
        
        for(var i = 0; i < allUserPOItest.length; i++){
            $scope.ordersNumbers.push({number: i+1});
            $scope.star[allUserPOItest[i].name.replace(/_/g, ' ')] = true; 
            myService.getPOIByName(allUserPOItest[i].name.replace(/ /g, '_'))
            .then(function(response){
                var image = response.data.image;
                $scope.pois.push({name: response.data.name.replace(/_/g, ' '), url: image, rating: response.data.rating, category: response.data.category});
            }, function error(response){
                console.log(response.statusText);
            });   
        }
        return; 
    }, function error(response){
        console.log(response.statusText);
    });


    $scope.filter = function(){
        if($scope.onFilter === true)
            return;
        $scope.onFilter = true;
        for(var i = 0; i <  $scope.pois.length; i++){
            if($scope.pois[i].category === "food"){
                $scope.food.push({name: $scope.pois[i].name, url: $scope.pois[i].url, rating:$scope.pois[i].rating, category: $scope.pois[i].category});
                continue;
            }
            if($scope.pois[i].category === "shopping_centers"){
                $scope.shopping_centers.push({name: $scope.pois[i].name, url: $scope.pois[i].url, rating:$scope.pois[i].rating, category: $scope.pois[i].category});
                continue;
            }
            if($scope.pois[i].category === "observation_towers"){
                $scope.observation_towers.push({name: $scope.pois[i].name, url: $scope.pois[i].url, rating:$scope.pois[i].rating, category: $scope.pois[i].category});
                continue;
            }
            if($scope.pois[i].category === "architectural_buildings"){
                $scope.architectural_buildings.push({name: $scope.pois[i].name, url: $scope.pois[i].url, rating:$scope.pois[i].rating, category: $scope.pois[i].category});
                continue;
            }
        }
    }

    $scope.byUserOrder = function(){
        var userOrder = [];
        for(var i = 0; i <  $scope.pois.length; i++){
            myService.deleteFromFavorits($scope.pois[i].name.replace(/ /g, '_'))
            .then(function(response){
            }, function error(response){
             console.log(response.statusText);
            });
            if($scope.orders[$scope.pois[i].name.replace(/_/g, ' ')] != undefined)
                userOrder.push({poi: $scope.pois[i].name.replace(/_/g, ' '), order: $scope.orders[$scope.pois[i].name.replace(/_/g, ' ')].number});
            else
                userOrder.push({poi: $scope.pois[i].name.replace(/_/g, ' '), order: 21});
        }

        userOrder.sort(function(a, b){return a.order - b.order});

        var test = userOrder[0].poi.replace(/ /g, '_');
        for(var i = 0; i < userOrder.length; i++){
            test = test + "," + userOrder[i].poi.replace(/ /g, '_');
        }

        myService.addToFavorits(test)
        .then(function(response){
        }, function error(response){
            console.log(response.statusText);
        });
    }


    $scope.sort = function(){
        $scope.pois.sort(function(a, b){return b.rating - a.rating});
        $scope.architectural_buildings.sort(function(a, b){return b.rating - a.rating});
        $scope.food.sort(function(a, b){return b.rating - a.rating});
        $scope.shopping_centers.sort(function(a, b){return b.rating - a.rating});
        $scope.observation_towers.sort(function(a, b){return b.rating - a.rating});
    }   

    $scope.addToFavorits = function(name){
        if(!($window.sessionStorage.getItem('token'))){
            $window.alert("you must login first")
            return;
        }
        myService.addToFavorits(name)
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
        myService.deleteFromFavorits(name)
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