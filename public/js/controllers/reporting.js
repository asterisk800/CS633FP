'use strict';


angular.module( 'sips' ).controller( 'reportingController', ['$scope', '$http',
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

        $scope.consumption = [
            {
                date: 1465142400,
                bevID: 7,
                starRating: 7,
                image: null,
                comment: 'riesling comments 1'
            },
            {
                date: 1465142400,
                bevID: 7,
                starRating: 7,
                image: null,
                comment: 'riesling comments 2'
            },
            {
                date: 1465142400,
                bevID: 7,
                starRating: 7,
                image: null,
                comment: 'riesling comments 3'
            },
            {
                date: 1465142400,
                bevID: 3,
                starRating: 4,
                image: null,
                comment: 'Coors Light comments 1'
            },
            {
                date: 1465142400,
                bevID: 3,
                starRating: 4,
                image: null,
                comment: 'Coors Light comments 2'
            },
            {
                date: 1465142400,
                bevID: 2,
                starRating: 2,
                image: null,
                comment: 'Bud Light comments'
            }
        ];

        var labels = $scope.consumption.reduce(function(previous, current){
            var bevId = current.bevID;
            var beverage = $scope.drinkBrands.find(function(element){
                return element.id == bevId;
            });
            if(!previous.includes(beverage.desc)) {
                previous.push(beverage.desc);
            }
            return previous;
        }, []);

        var consumption = $scope.consumption.reduce(function(previous, current){
            var bevId = current.bevID;
            var beverage = $scope.drinkBrands.find(function(element){
                return element.id == bevId;
            });
            if(previous[beverage.desc]){
                previous[beverage.desc]++;
            } else {
                previous[beverage.desc]=1;
            }
            return previous;
        }, {});

        var consumptionData = [];
        labels.forEach(function(element){
            consumptionData.push(consumption[element]);
        });
        console.log(consumptionData);
        $scope.labels = labels;
        $scope.series = ['Consumption', 'Baseline'];

        $scope.data = [
            consumptionData,
            [0]
        ];


    }]);