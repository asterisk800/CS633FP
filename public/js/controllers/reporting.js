'use strict';


angular.module( 'sips' ).controller( 'reportingController', ['$scope', '$http',
    function( $scope, $http ) {

        function getData(userId) {
            $http.get("/api/getDrinks").success(function (data) {
                $scope.drinkBrands = data;
                $scope.drinkTypes = $scope.drinkBrands.reduce(function(previous, current){
                    if(previous.indexOf(current.bevType) == -1){
                        previous.push(current.bevType);
                    }
                    return previous;
                }, []);
            }).error(function (error) {
                console.log('getDrinks: ', error);
            });
            $http.get("/api/getRatings").success(function (data) {
                $scope.consumption = data;
            }).error(function (error) {
                console.log('getConsumption: ', error);
            });
        }

        //$scope.consumption = [
        //    {
        //        date: 1465142400,
        //        bevID: 7,
        //        starRating: 7,
        //        image: null,
        //        comment: 'riesling comments 1'
        //    },
        //    {
        //        date: 1465142400,
        //        bevID: 7,
        //        starRating: 7,
        //        image: null,
        //        comment: 'riesling comments 2'
        //    },
        //    {
        //        date: 1465142400,
        //        bevID: 7,
        //        starRating: 7,
        //        image: null,
        //        comment: 'riesling comments 3'
        //    },
        //    {
        //        date: 1465142400,
        //        bevID: 3,
        //        starRating: 4,
        //        image: null,
        //        comment: 'Coors Light comments 1'
        //    },
        //    {
        //        date: 1465142400,
        //        bevID: 3,
        //        starRating: 4,
        //        image: null,
        //        comment: 'Coors Light comments 2'
        //    },
        //    {
        //        date: 1465142400,
        //        bevID: 2,
        //        starRating: 2,
        //        image: null,
        //        comment: 'Bud Light comments'
        //    }
        //];
        function calculateTotalConsumption(consumption, drinkTypes, drinkBrands) {
            var labels = consumption.reduce(function (previous, current) {
                var bevID = current.bevID;
                var beverage = drinkBrands.find(function (element) {
                    return element.bevID == bevID;
                });
                if (!previous.includes(beverage.bevName)) {
                    previous.push(beverage.bevName);
                }
                return previous;
            }, []);

            var consumption = consumption.reduce(function (previous, current) {
                var bevID = current.bevID;
                var beverage = drinkBrands.find(function (element) {
                    return element.bevID == bevID;
                });
                if (previous[beverage.bevName]) {
                    previous[beverage.bevName]++;
                } else {
                    previous[beverage.bevName] = 1;
                }
                return previous;
            }, {});

            var consumptionData = [];
            labels.forEach(function (element) {
                consumptionData.push(consumption[element]);
            });
            console.log(labels, consumptionData);
            $scope.labels = labels;
            $scope.series = ['Consumption', 'Baseline'];

            $scope.data = [
                consumptionData,
                [0]
            ];
            $scope.legend = [];

        };

        function calculateConsumptionByDate(consumption, drinkTypes, drinkBrands) {
            consumption.sort(function(a, b) {
                return a.date - b.date;
            });

            var labels = consumption.reduce(function (previous, current) {
                //label is a date
                var date = new Date(current.date * 1000);
                var dateCvt = (date.getMonth()+1) + '/' + date.getDate();
                if (!previous.includes(dateCvt)) {
                    previous.push(dateCvt);
                }
                return previous;
            }, []);

            var consumption = consumption.reduce(function (previous, current) {
                var date = new Date(current.date * 1000);

                var dateCvt = (date.getMonth()+1) + '/' + date.getDate();

                if (previous[dateCvt]) {
                    previous[dateCvt]++;
                } else {
                    previous[dateCvt] = 1;
                }
                return previous;
            }, {});

            var consumptionData = [];
            labels.forEach(function (element) {
                consumptionData.push(consumption[element]);
            });
            console.log(labels, consumptionData);
            $scope.labels = labels;
            $scope.series = ['Consumption', 'Baseline'];

            $scope.data = [
                consumptionData,
                [0]
            ];
            $scope.legend = [];
        };

        function calculateConsumptionByRatings(consumption, drinkTypes, drinkBrands) {
            var labels = consumption.reduce(function (previous, current) {
                var bevID = current.bevID;
                var beverage = drinkBrands.find(function (element) {
                    return element.bevID == bevID;
                });
                if (!previous.includes(beverage.bevName)) {
                    previous.push(beverage.bevName);
                }
                return previous;
            }, []);

            var ratings = {};
            consumption.forEach(function(element, index, fullArray){
                var beverage = drinkBrands.find(function (dbElement) {
                    return dbElement.bevID == element.bevID;
                });
                if(ratings[beverage.bevName]){
                    ratings[beverage.bevName] += (element.starRating - 4);
                } else {
                    ratings[beverage.bevName] = (element.starRating - 4);
                }
            });
            var consumptionCount = consumption.reduce(function (previous, current) {
                //height is a rating
                var bevID = current.bevID;
                var beverage = drinkBrands.find(function (element) {
                    return element.bevID == bevID;
                });
                if (previous[beverage.bevName]) {
                    previous[beverage.bevName]++;
                } else {
                    previous[beverage.bevName] = 1;
                }
                return previous;
            }, {});
            var consumptionData = [];
            labels.forEach(function (element) {
                var indRating = ratings[element] / consumptionCount[element];
                consumptionData.push(indRating);
            });
            console.log(labels, consumptionData);
            $scope.labels = labels;
            $scope.series = ['Rating'];

            $scope.data = [
                consumptionData
            ];
            'Strongly Dislike', 'Dislike', 'Mildly Dislike', 'Neutral', 'Mildly Like', 'Like', 'Strongly Like'
            $scope.legend = [
                {
                    value: -3,
                    description: 'Strongly Dislike'
                },
                {
                    value: -2,
                    description: 'Dislike'
                },
                {
                    value: -1,
                    description: 'Mildly Dislike'
                },
                {
                    value: 0,
                    description: 'Neutral'
                },
                {
                    value: 1,
                    description: 'Mildly Like'
                },
                {
                    value: 2,
                    description: 'Like'
                },
                {
                    value: 3,
                    description: 'Strongly Like'
                }
            ];
        };

        var userId = 1;
        getData(userId);
        $scope.$watchGroup(['consumption', 'drinkTypes', 'drinkBrands', 'dispTab'], function(newValues, oldValues, scope) {
            var consumption = newValues[0];
            var drinkTypes = newValues[1];
            var drinkBrands = newValues[2];

            var dispTab = newValues[3];

            if(consumption && consumption.length > 0 && drinkTypes && drinkTypes.length > 0 && drinkBrands && drinkBrands.length > 0){
                switch(dispTab){
                    case 'total':
                        calculateTotalConsumption(consumption, drinkTypes, drinkBrands);
                        break;
                    case 'date':
                        calculateConsumptionByDate(consumption, drinkTypes, drinkBrands);
                        break;
                    case 'ratings':
                        calculateConsumptionByRatings(consumption, drinkTypes, drinkBrands);
                        break;
                    default:
                        calculateTotalConsumption(consumption, drinkTypes, drinkBrands);

                }
            }
        });

        $scope.dispTab = 'total';


    }]);