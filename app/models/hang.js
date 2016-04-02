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
        res.send(
            'Welcome to the Hangman' + "\n" +
            '# METHODS' + "\n" + 'GET /hangman' + "\t" + 'This readme' + "\n" +
            'GET /hangman/new' + "\t" + 'Launch a new game, return your gameid' + "\n" +
            'GET /hangman/new/n' + "\t" + 'Launch a new game, with a word of n letters, return your gameid' + "\n" +
            'GET /hangman/gameid' + "\t" + 'Show your status' + "\n" +
            'POST /hangman/gameid' + "\t" + 'Try a {guess:"word"}' + "\n" +
            'PUT /hangman/gameid' + "\t" + 'Try to {guess:"a"} letter'
        );
    },

    init: function(req, res) {
        var word = '';
        if (!req.params.num) {
            word = randomWord();
        } else {
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
                res.send(data._id);
            });
        });
    },

    stat: function(req, res) {
        Hang.model.findOne({_id:req.params.id},function(err, data) {
            res.send('Now : '+data.found+"\n"+'You did '+data.err+'/10 err.'+"\n"+'You played : '+data.chars.join(', '));
        });
    },

    sendChar: function(req, res) {
        Hang.model.findOne({_id:req.params.id},function(err, data) {
            data.word == data.found && res.send('You already found that word.'+"\n"+'Word was '+data.word);
            data.err >= 11 && res.send('You have too much errors on this hangman.'+"\n"+'Word was '+data.word);
            req.body.guess.length !== 1 && res.send('Please send only one char');
            data.chars.indexOf(req.body.guess) !== -1 && res.send('You already send this char');
            regex = new RegExp(req.body.guess,'g');
            data.chars.push(req.body.guess);
            if(regex.test(data.word)) {
                data.found = data.found.replace(regex,req.body.guess);console.log(data.found);
                Hang.model.findByIdAndUpdate(req.params.id,data,function() {
                    res.send('Found '+data.word.match(regex)+"\n"+'Now : '+data.found);
                });
            } else {
                data.err++;
                Hang.model.findByIdAndUpdate(req.params.id,data,function() {
                    res.send('Don\'t found '+data.word.match(regex)+"\n"+'Now : '+data.found);
                });
            }
        });
    },

    guess: function(req, res) {
        Hang.model.findOne({_id:req.params.id},function(err, data) {
            if(data.word == req.body.guess) {
                data.found = data.word;
                Hang.model.findByIdAndUpdate(req.params.id,data,function() {
                    res.send('Well done !'+"\n"+'The word was '+data.word+"\n"+'You did it with '+data.err+' err.');
                });
            } else {
                data.err++;
                Hang.model.findByIdAndUpdate(req.params.id,data,function() {
                    res.send('Nope. Try again'+"\n"+'Now : '+data.found);
                });
            }
        });
    }
};

module.exports = Hang;
