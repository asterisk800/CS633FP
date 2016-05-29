'use strict';


angular.module( 'sips' ).controller( 'consumptionController', ['$scope',
    function( $scope ) {
    $scope.drinkTypes = [
        {id: 1, desc: 'Beer'},
        {id: 2, desc: 'Wine'}
    ];

    $scope.list = [1];

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


}]);
