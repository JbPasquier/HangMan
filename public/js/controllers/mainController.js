// MAIN CONTROLLER
function mainController($scope, $http, hangService, hangFactory) {

    $scope.option = 'readme';

    $scope.focusCommand = function() {

        $scope.command = '';
        angular.element('[ng-model="command"]').focus();

    };

    $scope.send = function() {

        if ($scope.command) {

            if (['readme', 'init', 'initLength', 'status', 'guessLetter', 'guessWord'].indexOf($scope.command) !== -1) {

                $scope.option = $scope.command;
                $scope.focusCommand();

                if ($scope.option !== 'initLength')
                    $scope.action();

                return;

            } else if ($scope.option === 'initLength' && !isNaN(Number($scope.command))) {

                $scope.action();

                return;

            } else if ($scope.command.length === 1) {

                $scope.option = 'guessLetter';
                $scope.action();

                return;

            } else {

                $scope.option = 'guessWord';
                $scope.action();

                return;

            }

        } else {
            $scope.action();
            return;
        }

    };

    $scope.action = function() {
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

        $scope.focusCommand();

    };
    $scope.send();
}
