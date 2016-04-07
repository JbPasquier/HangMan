// HANG SERVICE
function hangFRService($http, hangFactory) {
    return {
        readme: function() {
            return $http.get('/pendu');
        },
        init: function() {
            return $http.get('/pendu/nouveau');
        },
        initSized: function(length) {
            return $http.get('/pendu/nouveau/' + length);
        },
        initWithWord: function(word) {
            return $http.get('/pendu/mot/' + word);
        },
        guessLetter: function(letter) {
            return $http.put('/pendu/' + hangFactory.currentHangmanId, {
                guess: letter
            });
        },
        guessWord: function(word) {
            return $http.post('/pendu/' + hangFactory.currentHangmanId, {
                guess: word
            });
        },
        getStatus: function() {
            return $http.get('/pendu/' + hangFactory.currentHangmanId);
        }
    };
}
