// HANG SERVICE
function hangService($http, hangFactory) {
    return {
        readme: function() {
            return $http.get('/hangman');
        },
        init: function() {
            return $http.get('/hangman/new');
        },
        initSized: function(length) {
            return $http.get('/hangman/new/' + length);
        },
        guessLetter: function(letter) {
            if (hangFactory.currentHangmanId)
                return $http.put('/hangman/' + hangFactory.currentHangmanId, {
                    guess: letter
                });
            else
                return 'You must init first';
        },
        guessWord: function(word) {
            if (hangFactory.currentHangmanId)
                return $http.post('/hangman/' + hangFactory.currentHangmanId, {
                    guess: word
                });
            else
                return 'You must init first';
        },
        getStatus: function() {
            if (hangFactory.currentHangmanId)
                return $http.get('/hangman/' + hangFactory.currentHangmanId);
            else
                return 'You must init first';
        }
    };
}
