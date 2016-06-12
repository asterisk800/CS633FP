'use strict';


angular.module( 'sips' ).controller( 'consumptionController', ['$scope', '$http',
    function( $scope, $http ) {
    $http.get("/api/getDrinks").success(function(data){
        $scope.drinkBrands = data;
        $scope.drinkTypes = $scope.drinkBrands.reduce(function(previous, current){
            if(previous.indexOf(current.bevType) == -1){
                previous.push(current.bevType);
            }
            return previous;
        }, []);
    }).error(function(error){
        console.log('getDrinkBrands: ', error);
    });
    $scope.formData = {};

    $scope.enterConsumption = function() {

        $scope.formData.bevID = $scope.formData.drinkBrand.id || null;
        $http({
            method  : 'POST',
            url     : 'enter',
            data    : $.param($scope.formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
            .then(function success(data) {
                console.log('success: ', data);

                if (data.data.error) {
                    // if not successful, bind errors to error variables
                    $scope.errorName = data.data.errors.name;
                    $scope.message = 'There was a problem entering your consumption.';
                } else {
                    // if successful, bind success message to message
                    $scope.message = data.data.message;
                    console.log($scope.message);
                }
            }, function error(data){
                console.log('error: ', data);

            });
    };


}]);
