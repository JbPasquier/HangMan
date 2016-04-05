// MAIN CONTROLLER
function mainController($scope, $http, hangService, hangFactory) {

    $scope.option = 'readme';

    $scope.send = function() {

        switch ($scope.option) {

            case 'readme':
                hangService.readme().then(function(res) {
                    $scope.result = res.data.message;
                });
                break;

            case 'init':
                hangService.init().then(function(res) {

                    hangFactory.currentHangmanId = res.data.message;

                    $scope.result = 'Jeu initialisé';

                    $scope.option = 'status';
                    $scope.send();

                });
                break;

            case 'initLength':
                if (isNaN(Number($scope.command))) {

                    $scope.option = 'init';
                    $scope.send();

                } else {

                    hangService.initSized($scope.command).then(function(res) {

                        if (res.data.message != 'Word is too long' && res.data.message != 'Word is too short') {

                            hangFactory.currentHangmanId = res.data.message;

                            $scope.result = 'Jeu initialisé';

                            $scope.option = 'status';
                            $scope.send();

                        } else {

                            $scope.result = res.data.message;

                        }

                    });

                }
                break;

            case 'status':
                if (hangFactory.currentHangmanId === false) {

                    $scope.option = 'init';
                    $scope.send();

                    $scope.option = 'status';
                    $scope.send();

                } else {

                    hangService.getStatus().then(function(res) {

                        $scope.result = res.data.message;
                        $scope.option = 'guessLetter';

                    });

                }
                break;

            case 'guessLetter':

                if (hangFactory.currentHangmanId === false) {

                    $scope.option = 'init';
                    $scope.send();

                    $scope.option = 'status';
                    $scope.send();

                } else {

                    hangService.guessLetter($scope.command).then(function(res) {
                        $scope.result = res.data.message;
                    });

                }
                break;

            case 'guessWord':

                if (hangFactory.currentHangmanId === false) {

                    $scope.option = 'init';
                    $scope.send();

                    $scope.option = 'status';
                    $scope.send();

                } else {

                    hangService.guessWord($scope.command).then(function(res) {
                        $scope.result = res.data.message;
                    });

                }
                break;

        }

        $scope.command = '';

    };
    $scope.send();
}
