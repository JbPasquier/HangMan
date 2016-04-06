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
        initWithWord: function(word) {
            return $http.get('/hangman/word/' + word);
        },
        guessLetter: function(letter) {
            return $http.put('/hangman/' + hangFactory.currentHangmanId, {
                guess: letter
            });
        },
        guessWord: function(word) {
            return $http.post('/hangman/' + hangFactory.currentHangmanId, {
                guess: word
            });
        },
        getStatus: function() {
            return $http.get('/hangman/' + hangFactory.currentHangmanId);
        }
    };
}
