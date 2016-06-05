'use strict';


angular.module( 'sips' ).controller( 'consumptionController', ['$scope', '$http',
    function( $scope, $http ) {
    $scope.drinkTypes = [
        {id: 1, desc: 'Beer'},
        {id: 2, desc: 'Wine'}
    ];


    $scope.drinkBrands = [
        {id: 1, type: 1, desc: 'Budweiser'},
        {id: 2, type: 1, desc: 'Bud Light'},
        {id: 3, type: 1, desc: 'Coors Light'},
        {id: 4, type: 1, desc: 'Angry Angel'},
        {id: 5, type: 2, desc: 'Chardonnay'},
        {id: 6, type: 2, desc: 'Pinot Noir'},
        {id: 7, type: 2, desc: 'Riesling'},
        {id: 8, type: 2, desc: 'Merlot'}
    ];

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
