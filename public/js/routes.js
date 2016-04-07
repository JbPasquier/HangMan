function routes($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'mainController'
        })
        .when('/fr', {
            templateUrl: 'views/fr.html',
            controller: 'frController'
        })
        .otherwise({
            redirectTo: '/'
        });
}
