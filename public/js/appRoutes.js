angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })


        .when('/canvas', {
            templateUrl: 'views/canvas.html',
            controller: 'CanvasController'
        });

    $locationProvider.html5Mode(true);

}]);
