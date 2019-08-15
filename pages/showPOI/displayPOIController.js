var display = angular.module("myApp")

display.controller("displayPOIController", function ($scope,myService,$window,$rootScope) {
    self = this;
    $scope.star = {};

    var allLocations={
        "Cola London Eye":{x:51.503442, y:-0.119413},
        "The View from The Shard":{x:51.504476, y:-0.086479},
        "Tower Bridge":{x:51.506726, y:-0.087220},
        "ArcelorMittal Orbit":{x:51.538542, y:-0.012794},
        "Sky Garden":{x:51.511340, y:-0.083423},
        "Westminster Abbey":{x:51.499351, y:-0.127269},
        "Banqueting House":{x:51.504701, y:-0.125918},
        "The Crystal":{x:51.507574, y:0.016232},
        "BT Tower":{x:51.521567, y:-0.138789},
        "Freemasons Hall":{x:51.515077, y:-0.121038},
        "Oxford Street":{x:51.514983, y:-0.144877},
        "Regent Street":{x:51.513254, y:-0.140462},
        "Bond":{x:51.521886, y:-0.117267},
        "Covent Garden":{x:51.512915, y:-0.124328},
        "Tottenham Court Road":{x:51.520239, y:-0.133723},
        "The Barbary":{x:51.514534, y:-0.126163},
        "Social Eating House":{x:51.513926, y:-0.136652},
        "Barrafina":{x:51.514607, y:-0.122339},
        "Smoking Goat Shoreditch":{x:51.524338, y:-0.076873},
        "Borough Market":{x:51.505604, y:-0.090834}

    }

    $scope.openInNewWindow = function(name){
        var poi_name = name;
        $rootScope.hide3Img=true;
        $rootScope.hidePhoto=true;
        
        if(name.includes("_"))
            poi_name = name.replace(/_/g, ' ');   
        myService.getPOIByName(poi_name)
       .then(function(response){
            $window.location.href ='#!showPoi';
            $rootScope.poiName = poi_name;
            $rootScope.views = response.data.views;
            $rootScope.description = response.data.description;
            $rootScope.rating = response.data.rating;
            $rootScope.image = response.data.image;
            var temp = response.data.reviews.split(',');
            if(temp.length > 0)
                $rootScope.review1 = temp[0];
            if(temp.length > 1){
                $rootScope.review1 = temp[0];
                $rootScope.review2 = temp[1];
            }
       }, function error(response){
            console.log(response.statusText);
        });
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

    $scope.showMap=function(){
        var mymap = L.map('myMap').setView([allLocations[ $rootScope.poiName].x, allLocations[ $rootScope.poiName].y], 13);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZWluaSIsImEiOiJjanhxamsxdWgwMWl3M2Ntd3l5dG5idTgyIn0.rfGuxYnA9hOJYiVr_2JuiQ'
        }).addTo(mymap);
        const marker=L.marker([allLocations[ $rootScope.poiName].x,allLocations[ $rootScope.poiName].y]).addTo(mymap);
        marker.bindPopup("<div style='text-align:center'>"+ $rootScope.poiName+"</div>").openPopup();
    }


});