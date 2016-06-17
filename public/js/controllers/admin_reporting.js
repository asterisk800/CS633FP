'use strict';


angular.module( 'sips' ).controller( 'adminReportingController', ['$scope', '$http',
    function( $scope, $http ) {
        $scope.model = {};

        function getData() {
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
            $http.get("/api/getAllRatings").success(function (data) {
                $scope.consumption = data;
            }).error(function (error) {
                console.log('getAllRatings: ', error);
            });
        }

        function calculateDateGenderConsumption(consumption, selBeverage, drinkBrands) {
            var beverage = drinkBrands.find(function (dbElement) {
                return dbElement.bevID == selBeverage;
            });

            var dataPoints = consumption[beverage.bevName];
            if(!dataPoints || dataPoints.length == 0){
                $scope.data = ['0'];
                $scope.labels = ['Not enough Data'];
                $scope.series = ['Rating'];
                $scope.chartType = 'chart-bar';
                return;
            }

            var labels = dataPoints.reduce(function (previous, current) {
                //label is a date
                var date = new Date(current.date * 1000);
                var dateCvt = (date.getMonth()+1) + '/' + date.getDate();
                if (!previous.includes(dateCvt)) {
                    previous.push(dateCvt);
                }
                return previous;
            }, []);

            var consumptionByDate = dataPoints.reduce(function (previous, current) {
                var date = new Date(current.date * 1000);

                var dateCvt = (date.getMonth()+1) + '/' + date.getDate();

                if (!previous[dateCvt]) {
                    previous[dateCvt] = [];
                }
                previous[dateCvt].push(current);

                return previous;
            }, {});


            var maleConsumption = [];
            var femaleConsumption = [];

            var i=0;

            var keys = Object.keys(consumptionByDate);
            keys.forEach(function(dateElement){
                maleConsumption[i]=0;
                femaleConsumption[i]=0;

                consumptionByDate[dateElement].forEach(function(element){
                    if(element.gender == 'male'){
                       maleConsumption[i]++;
                       femaleConsumption[i]++;
                    } else {
                       femaleConsumption[i]++;
                    }
                });
                i++;
            });

            console.log(labels, maleConsumption, femaleConsumption);
            $scope.labels = labels;
            $scope.series = ['Male', 'Female'];

            $scope.data = [
                maleConsumption,
                femaleConsumption
            ];
            $scope.legend = [];
            $scope.chartType = 'chart-line';
            $scope.options.legend.display = true;
            $scope.options.scales.yAxes[0].ticks.suggestedMax = 3;
            $scope.options.scales.yAxes[0].ticks.suggestedMin = 0;
        };

        function calculateRatingLocation(consumption, selBeverage, drinkBrands) {

            var beverage = drinkBrands.find(function (dbElement) {
                return dbElement.bevID == selBeverage;
            });

            var dataPoints = consumption[beverage.bevName];
            if(!dataPoints || dataPoints.length == 0){
                $scope.data = ['0'];
                $scope.labels = ['Not enough Data'];
                $scope.series = ['Rating'];
                $scope.chartType = 'chart-bar';
                return;
            }
            var labels = dataPoints.reduce(function (previous, current) {
                if (!previous.includes(current.cityState)) {
                    previous.push(current.cityState);
                }
                return previous;
            }, []);

            var ratings = {};
            dataPoints.forEach(function(element){
                if(ratings[element.cityState]){
                    ratings[element.cityState] += (element.starRating - 4);
                } else {
                    ratings[element.cityState] = (element.starRating - 4);
                }
            });
            var consumptionCount = dataPoints.reduce(function (previous, current) {
                if (previous[current.cityState]) {
                    previous[current.cityState]++;
                } else {
                    previous[current.cityState] = 1;
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
            $scope.chartType = 'chart-bar';
            $scope.options.legend.display = false;
            $scope.options.scales.yAxes[0].ticks.suggestedMax = 3;
            $scope.options.scales.yAxes[0].ticks.suggestedMin = -3;
        };

        function calculateRatingAge(consumption, selBeverage, drinkBrands) {
    
            var beverage = drinkBrands.find(function (dbElement) {
                return dbElement.bevID == selBeverage;
            });
    
            var dataPoints = consumption[beverage.bevName];
            var labels = ['21-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65+'];
            if(!dataPoints || dataPoints.length == 0){
                $scope.data = ['0'];
                $scope.labels = ['Not enough Data'];
                $scope.series = ['Rating'];
                $scope.chartType = 'chart-bar';
                return;
            }
            var ratings = {};
            dataPoints.forEach(function(element, index, fullArray){
                var bucket = calculateAgeBucket(element.age);
                if(ratings[bucket]){
                    ratings[bucket] += (element.starRating - 4);
                } else {
                    ratings[bucket] = (element.starRating - 4);
                }
            });
            var consumptionCount = dataPoints.reduce(function (previous, current) {
                var bucket = calculateAgeBucket(current.age);
                if (previous[bucket]) {
                    previous[bucket]++;
                } else {
                    previous[bucket] = 1;
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
            $scope.chartType = 'chart-bar';
            $scope.options.legend.display = false;
            $scope.options.scales.yAxes[0].ticks.suggestedMax = 3;
            $scope.options.scales.yAxes[0].ticks.suggestedMin = -3;
        };

        function calculateRatingHistogram(consumption, selBeverage, drinkBrands) {

            var beverage = drinkBrands.find(function (dbElement) {
                return dbElement.bevID == selBeverage;
            });

            var dataPoints = consumption[beverage.bevName];
            var labels = ['Strongly Dislike', 'Dislike', 'Mildly Dislike', 'Neutral', 'Mildly Like', 'Like', 'Strongly Like'];
            if(!dataPoints || dataPoints.length == 0){
                $scope.data = ['0'];
                $scope.labels = ['Not enough Data'];
                $scope.series = ['Rating'];
                $scope.chartType = 'chart-bar';
                return;
            }
            var ratings = [0, 0, 0, 0, 0, 0, 0];
            dataPoints.forEach(function(element, index, fullArray){
                var bucket = element.starRating - 1;
                    ratings[bucket]++;
            });

            console.log(labels, ratings);
            $scope.labels = labels;
            $scope.series = ['Rating'];

            $scope.data = [
                ratings
            ];

            $scope.chartType = 'chart-bar';
            $scope.options.legend.display = false;
            $scope.options.scales.yAxes[0].ticks.suggestedMax = 3;
            $scope.options.scales.yAxes[0].ticks.suggestedMin = 0;
        };

        getData();
        $scope.options = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            legend: {
                display: true
            }
        };

        $scope.$watchGroup(['consumption', 'drinkTypes', 'drinkBrands', 'dispTab', 'model.drinkBrand'], function(newValues, oldValues, scope) {
            var consumption = newValues[0];
            var drinkTypes = newValues[1];
            var drinkBrands = newValues[2];

            var dispTab = newValues[3];

            var selBeverage = newValues[4] ? newValues[4].bevID : null;

            //var selBeverage = $scope.model && $scope.model.drinkBrand ? $scope.model.drinkBrand.bevID : 0;


            if(consumption && selBeverage) {
                var consumptionByBrand = {};
                consumption.forEach(function (element, index, fullArray) {
                    element.age = getAge(element.dob);
                    element.cityState = element.city + ', ' + element.state;
                    var bevID = element.bevID;
                    var beverage = drinkBrands.find(function (ele) {
                        return ele.bevID == bevID;
                    });
                    if(!consumptionByBrand[beverage.bevName]){
                        consumptionByBrand[beverage.bevName] = []
                    }
                    consumptionByBrand[beverage.bevName].push(element);
                });
                if (consumption && consumption.length > 0 && drinkTypes && drinkTypes.length > 0 && drinkBrands && drinkBrands.length > 0) {
                    switch (dispTab) {
                        case 'dateGender':
                            calculateDateGenderConsumption(consumptionByBrand, selBeverage, drinkBrands);
                            break;
                        case 'ratingLocation':
                            calculateRatingLocation(consumptionByBrand, selBeverage, drinkBrands);
                            break;
                        case 'ratingAge':
                            calculateRatingAge(consumptionByBrand, selBeverage, drinkBrands);
                            break;
                        case 'ratingHistogram':
                            calculateRatingHistogram(consumptionByBrand, selBeverage, drinkBrands);
                            break;
                        default:
                            //calculateDateLocationConsumption(consumptionByBrand, drinkTypes, drinkBrands);

                    }
                }
            }

        });

        $scope.dispTab = '';


        function getAge(dateString) {
            var today = new Date();
            var birthDate = new Date(dateString);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }
        function calculateAgeBucket(age){
            var bucket = 0;
            if(age < 25){
                bucket = '21-24';
            } else if(age < 30){
                bucket = '25-29';
            } else if(age < 35){
                bucket = '30-34';
            } else if(age < 40){
                bucket = '35-39';
            } else if(age < 45){
                bucket = '40-44';
            } else if(age < 50){
                bucket = '45-49';
            } else if(age < 55){
                bucket = '50-54';
            } else if(age < 60){
                bucket = '55-59';
            } else if(age < 65){
                bucket = '60-64';
            } else {
                bucket = '65+';
            }
            return bucket;
        }


    }]);