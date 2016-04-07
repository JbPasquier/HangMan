// MAIN CONTROLLER
function frController($scope, $http, hangFRService, hangFactory) {

    $scope.option = 'lisezmoi';

    $scope.focusCommand = function() {

        $scope.command = '';
        angular.element('[ng-model="command"]').focus();

    };

    $scope.send = function() {

        if ($scope.command) {

            if (['lisezmoi', 'init', 'initLong', 'statut', 'devinerLettre', 'devinerMot', 'initMot', 'eponger'].indexOf($scope.command) !== -1) {

                $scope.option = $scope.command;
                $scope.focusCommand();

                if ($scope.option !== 'initLong' && $scope.option !== 'initMot')
                    $scope.action();

                return;

            } else if ($scope.option === 'initLong' && !isNaN(Number($scope.command))) {

                $scope.action();

                return;

            } else if ($scope.option === 'initMot') {

                $scope.action();

                return;

            } else if ($scope.command.length === 1 && hangFactory.currentHangmanId !== false) {

                $scope.option = 'devinerLettre';
                $scope.action();

                return;

            }
            if (hangFactory.currentHangmanId === false) {

                $scope.option = 'initMot';
                $scope.action();
                return;

            } else {

                $scope.option = 'devinerMot';
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

            case 'initMot':
                hangFRService.initWithWord($scope.command).then(function(res) {

                    hangFactory.currentHangmanId = res.data.message;

                    $scope.result = 'Jeu initialisé';

                    $scope.option = 'statut';
                    $scope.send();

                });
                break;

            case 'lisezmoi':
                hangFRService.readme().then(function(res) {
                    $scope.result = res.data.message;
                });
                break;

            case 'init':
                hangFRService.init().then(function(res) {

                    hangFactory.currentHangmanId = res.data.message;

                    $scope.result = 'Jeu initialisé';

                    $scope.option = 'statut';
                    $scope.send();

                });
                break;

            case 'initLong':
                if (isNaN(Number($scope.command))) {

                    $scope.option = 'init';
                    $scope.send();

                } else {

                    hangFRService.initSized($scope.command).then(function(res) {

                        if (res.data.message != 'Le mot est trop court' && res.data.message != 'Le mot est trop long') {

                            hangFactory.currentHangmanId = res.data.message;

                            $scope.result = 'Jeu initialisé';

                            $scope.option = 'statut';
                            $scope.send();

                        } else {

                            $scope.result = res.data.message;

                        }

                    });

                }
                break;

            case 'statut':
                if (hangFactory.currentHangmanId === false) {

                    $scope.option = 'init';
                    $scope.send();

                } else {

                    hangFRService.getStatus().then(function(res) {

                        $scope.result = res.data.message;
                        $scope.option = 'devinerLettre';

                    });

                }
                break;

            case 'devinerLettre':

                if (hangFactory.currentHangmanId === false) {

                    $scope.option = 'init';
                    $scope.send();

                } else {

                    hangFRService.guessLetter($scope.command).then(function(res) {
                        $scope.result = res.data.message;
                    });

                }
                break;

            case 'devinerMot':

                if (hangFactory.currentHangmanId === false) {

                    $scope.option = 'init';
                    $scope.send();

                } else {

                    hangFRService.guessWord($scope.command).then(function(res) {
                        $scope.result = res.data.message;
                    });

                }
                break;

            case 'eponger':

                hangFactory.currentHangmanId = false;

                $scope.result = 'Jeu réinitialisé';

                $scope.option = 'lisezmoi';
                $scope.send();

                break;

        }

        $scope.focusCommand();

    };
    $scope.send();
}
