// MODEL
var mongoose = require('mongoose');
var randomWord = require('random-word');

var hangSchema = new mongoose.Schema({
    word: String,
    found: String,
    err: Number,
    chars: []
});

var Hang = {

    model: mongoose.model('Hang', hangSchema),

    readme: function(req, res) {

        res.send({
            message: 'Welcome to the Hangman' + "\n" +
                'Command can be a letter, a word, or any of these verbs' + "\n" +
                '# METHODS' + "\n" +
                'readme' + "\t" + 'GET /hangman' + "\t" + 'This readme' + "\n" +
                'init' + "\t" + 'GET /hangman/new' + "\t" + 'Launch a new game, return your gameid' + "\n" +
                'initLength' + "\t" + 'GET /hangman/new/n' + "\t" + 'Launch a new game, with a word of n letters, return your gameid' + "\n" +
                'initWithWord' + "\t" + 'GET /hangman/word/w' + "\t" + 'Launch a new game, with the word w, return your gameid' + "\n" +
                'status' + "\t" + 'GET /hangman/gameid' + "\t" + 'Show your status' + "\n" +
                'guessWord' + "\t" + 'POST /hangman/gameid' + "\t" + 'Try a {guess:"word"}' + "\n" +
                'guessLetter' + "\t" + 'PUT /hangman/gameid' + "\t" + 'Try to {guess:"a"} letter' + "\n" +
                'clear' + "\t" + 'Reset current game / start a new'
        });
        return;

    },

    init: function(req, res) {

        var word = '';

        if(req.params.word) {

            word = req.params.word.replace(/[^A-Z]+/gi,'');

        } else if (!req.params.num) {

            word = randomWord();

        } else {

            if (req.params.num < 3) {
                res.send({
                    message: 'Word is too short'
                });
                return;
            }

            if (req.params.num > 15) {
                res.send({
                    message: 'Word is too long'
                });
                return;
            }

            while (word.length != req.params.num) {
                word = randomWord();
            }

        }

        var found = word.replace(/[a-z]{1}/g, '_');

        Hang.model.create({
            word: word,
            found: found,
            err: 0,
            chars: []
        }, function() {

            Hang.model.findOne({
                word: word,
                found: found,
                err: 0,
                chars: []
            }, function(err, data) {

                res.send({
                    message: data._id
                });
                return;

            });

        });
    },

    stat: function(req, res) {

        Hang.model.findOne({
            _id: req.params.id
        }, function(err, data) {

            if (data.err < 11) {

                res.send({
                    message: 'Now : ' + data.found + "\n" + 'You did ' + data.err + '/11 err.' + "\n" + 'You played : ' + data.chars.join(', ')
                });
                return;

            } else {

                res.send({
                    message: 'You lose' + "\n" + 'Now : ' + data.found + "\n" + 'You did ' + data.err + '/11 err.' + "\n" + 'You played : ' + data.chars.join(', ') + "\n" + 'Word was ' + data.word
                });
                return;

            }

        });

    },

    sendChar: function(req, res) {

        var guess = req.body.guess,
            newData, sendMe;

        Hang.model.findOne({
            _id: req.params.id
        }, function(err, data) {

            if (data.word == data.found) {
                res.send({
                    message: 'You already found that word.' + "\n" + 'Word was ' + data.word
                });
                return;
            }

            if (data.err >= 11) {
                res.send({
                    message: 'You have too much errors on this hangman.' + "\n" + 'Word was ' + data.word
                });
                return;
            }

            if (guess.length !== 1) {
                res.send({
                    message: 'Please send only one char'
                });
                return;
            }

            if (data.chars.indexOf(guess) !== -1) {
                res.send({
                    message: 'You already send this char'
                });
                return;
            }

            regex = new RegExp(guess, 'g');

            data.chars.push(guess);

            if (regex.test(data.word)) {

                var fd = data.found.split('');

                data.word.split('').forEach(function(v, i) {
                    if (v == guess) fd[i] = v;
                });

                data.found = fd.join('');

                newData = {
                    chars: data.chars,
                    found: data.found,
                    err: data.err
                };

                sendMe = 'Found ' + data.word.match(regex) + "\n" + 'Now : ' + data.found;

            } else {

                data.err++;

                newData = {
                    chars: data.chars,
                    found: data.found,
                    err: data.err
                };

                sendMe = 'Don\'t found ' + guess + "\n" + 'Now : ' + data.found + "\n" + 'You did ' + data.err + '/11 err.';


            }
            Hang.model.findByIdAndUpdate(req.params.id, newData, function() {
                res.send({
                    message: sendMe
                });
                return;
            });
        });
    },

    guess: function(req, res) {

        var newData, sendMe;

        Hang.model.findOne({
            _id: req.params.id
        }, function(err, data) {

            if (data.word == req.body.guess) {

                data.found = data.word;

                newData = {
                    chars: data.chars,
                    found: data.found,
                    err: data.err
                };


                sendMe = 'Well done !' + "\n" + 'The word was ' + data.word + "\n" + 'You did it with ' + data.err + ' err.';


            } else {

                data.err++;

                newData = {
                    chars: data.chars,
                    found: data.found,
                    err: data.err
                };


                sendMe = 'Nope. Try again' + "\n" + 'Now : ' + data.found;


            }

            Hang.model.findByIdAndUpdate(req.params.id, newData, function() {
                res.send({
                    message: sendMe
                });
                return;
            });

        });
    }
};

module.exports = Hang;
