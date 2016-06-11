'use strict';


angular.module( 'sips' ).controller( 'consumptionController', ['$scope', '$http',
    function( $scope, $http ) {
    $http.get("/api/getDrinkTypes").success(function(data){
            $scope.drinkTypes = data;
        }).error(function(error){
            console.log('getDrinkTypes: ', error);
        });
    $http.get("/api/getDrinkBrands").success(function(data){
        $scope.drinkBrands = data;
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

                if (!data.success) {
                    // if not successful, bind errors to error variables
                    $scope.errorName = data.errors.name;
                } else {
                    // if successful, bind success message to message
                    $scope.message = data.message;
                }
            }, function error(data){
                console.log('error: ', data);

            });
    };


}]);
