angular.module("myApp").service("myService",function($http,$window){
    this.register = function(my_uname, my_fname, my_lname, my_password, my_city, my_country, my_email, my_categories, my_prq1, my_prq2, my_pra1, my_pra2){
        return  $http({
            method: 'POST',
            url: 'http://localhost:3000/user/register',
            data:{
                "user_name": my_uname,
                "first_name": my_fname,
                "last_name":my_lname,
                "password": my_password,
                "city": my_city,
                "country":my_country,
                "email":my_email,
                "preferredDomains": my_categories,
                "question1": my_prq1,
                "question2": my_prq2,
                "ans1":my_pra1,
                "ans2":my_pra2
            }
        })
    }
    
    this.login = function(uname, password){
        return $http({
                    method: 'POST',
                    url: 'http://localhost:3000/user/login',
                    data:{
                        "user_name" : uname,
                        "password" : password
                    }
                })
    }

    this.getUserQuestion = function(uname){
        return $http({
            method: 'POST',
            url: 'http://localhost:3000/user/showQuestion',
            data:{
                "user_name": uname
            }
        })
    }

    this.restorePass = function(uname, question, answer){
        return $http({
            method: 'POST',
            url: 'http://localhost:3000/user/restorePassword',
            data:{
                "user_name": uname,
                "PRQuestion": question,
                "PRAnswer": answer
            }
        })
    }

    this.getRecommendedPOI= function(){
        return $http({
            method:'GET',
            url:'http://localhost:3000/poi/private/getRecommendedPOI',
            headers:{
                'x-auth-token': $window.sessionStorage.getItem('token')
            }
        })
    }

    this.getPOIByName = function(poiName){
        poi = poiName.replace(/ /g, '_')
        return $http.get('http://localhost:3000/poi/getPOIByName/' + poi);
    }

    this.getLastSavedPOI = function(){
        return $http({
            method:'GET',
            url:'http://Localhost:3000/favorites/private/getLastPOI',
            headers:{
                'x-auth-token': $window.sessionStorage.getItem('token')
            }
        })
    }

    this.getSavedPOI = function(){
        return $http({
            method:'GET',
            url:'http://Localhost:3000/favorites/private/getSavedPOI',
            headers:{
                'x-auth-token': $window.sessionStorage.getItem('token')
            }
        })
    }

    this.getPOIByCategory = function(category){
        return $http({
            method:'GET',
            url:'http://Localhost:3000/poi/getPOIByCategory/' + category
        })
    }
    
    this.addToFavorits = function(poiName){
        return $http({
            method: 'POST',
            url: 'http://localhost:3000/favorites/private/addToFavList',
            headers:{
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data:{
                "poi": poiName
            }
        })
    }

    this.deleteFromFavorits = function(poiName){
        return $http.delete('http://localhost:3000/favorites/private/deletePOIOfUser',
        {data: {"poi": poiName}, 
        headers: {'x-auth-token': $window.sessionStorage.getItem('token'),'Content-Type': 'application/json'}})
    }

    this.postReview = function(poiName, content, rating){
        return $http({
            method: 'POST',
            url: 'http://localhost:3000/poi/private/postReview',
            headers:{
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data:{
                "poi_name": poiName,
                "review": content,
                "rating": rating
            }
        })
    }
    
});