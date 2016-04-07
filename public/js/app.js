angular.module('app', ['ngRoute', 'ngAnimate'])
    .config(routes)
    .controller('mainController', mainController)
    .controller('frController', frController)
    .service('hangService', hangService)
    .service('hangFRService', hangFRService)
    .factory('hangFactory', hangFactory);
