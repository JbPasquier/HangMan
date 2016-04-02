angular.module('app', ['ngRoute', 'ngAnimate'])
    .config(routes)
    .controller('mainController', mainController)
    .service('hangService', hangService);
