// MODEL
var mongoose = require('mongoose');
var randomWordFR = require('random-word-fr');

var hangSchema = new mongoose.Schema({
    word: String,
    found: String,
    err: Number,
    chars: []
});

var HangFR = {

    model: mongoose.model('HangFR', hangSchema),

    readme: function(req, res) {

        res.send({
            message: 'Bienvenue sur le pendu' + "\n" +
                'La commande peut être une lettre, un mot ou n\'importe lequel de ces verbes' + "\n" +
                '# METHODES' + "\n" +
                'lisezmoi' + "\t" + 'GET /pendu' + "\t" + 'Ce lisez-moi' + "\n" +
                'init' + "\t" + 'GET /pendu/nouveau' + "\t" + 'Lancer une partie, retourne l\'idjeu' + "\n" +
                'initLong' + "\t" + 'GET /pendu/nouveau/n' + "\t" + 'Lancer une partie, avec un mot de n lettres, retourne l\'idjeu' + "\n" +
                'initMot' + "\t" + 'GET /pendu/mot/w' + "\t" + 'Lancer une partie, avec le mot w, retourne l\'idjeu' + "\n" +
                'statut' + "\t" + 'GET /pendu/idjeu' + "\t" + 'Afficher l\'etat' + "\n" +
                'devinerMot' + "\t" + 'POST /pendu/idjeu' + "\t" + 'Essayer de {deviner:"un"} mot' + "\n" +
                'devinerLettre' + "\t" + 'PUT /pendu/idjeu' + "\t" + 'Essayer de {deviner:"u"}ne lettre' + "\n" +
                'eponger' + "\t" + 'Annuler la partie / débuter une nouvelle'
        });
        return;

    },

    init: function(req, res) {

        var word = '';

        if (req.params.word) {

            word = req.params.word.replace(/[^A-Z]+/gi, '');

        } else if (!req.params.num) {

            word = randomWordFR();

        } else {

            if (req.params.num < 3) {
                res.send({
                    message: 'Le mot est trop court'
                });
                return;
            }

            if (req.params.num > 15) {
                res.send({
                    message: 'Le mot est trop long'
                });
                return;
            }

            while (word.length != req.params.num) {
                word = randomWordFR();
            }

        }

        var found = word.replace(/[a-z]{1}/g, '_');

        HangFR.model.create({
            word: word,
            found: found,
            err: 0,
            chars: []
        }, function() {

            HangFR.model.findOne({
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

        HangFR.model.findOne({
            _id: req.params.id
        }, function(err, data) {

            if (data.err < 11) {

                res.send({
                    message: 'Actuellement : ' + data.found + "\n" + 'Tu as fait ' + data.err + '/11 err.' + "\n" + 'Tu as joué : ' + data.chars.join(', ')
                });
                return;

            } else {

                res.send({
                    message: 'Tu as perdu' + "\n" + 'Actuellement : ' + data.found + "\n" + 'Tu as fait ' + data.err + '/11 err.' + "\n" + 'Tu as joué : ' + data.chars.join(', ') + "\n" + 'Le mot était ' + data.word
                });
                return;

            }

        });

    },

    sendChar: function(req, res) {

        var guess = req.body.guess.replace(/[^A-Z]+/gi, ''),
            newData, sendMe;

        HangFR.model.findOne({
            _id: req.params.id
        }, function(err, data) {

            if (data.word == data.found) {
                res.send({
                    message: 'Tu as déjà trouvé ce mot.' + "\n" + 'Le mot était ' + data.word
                });
                return;
            }

            if (data.err >= 11) {
                res.send({
                    message: 'Tu as fait trop d\'erreur sur ce pendu.' + "\n" + 'Le mot était ' + data.word
                });
                return;
            }

            if (guess.length !== 1) {
                res.send({
                    message: 'Tu as envoyé trop de lettres'
                });
                return;
            }

            if (data.chars.indexOf(guess) !== -1) {
                res.send({
                    message: 'Tu as déjà envoyé cette lettre'
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

                sendMe = 'Trouvé ' + data.word.match(regex) + "\n" + 'Actuellement : ' + data.found;

            } else {

                data.err++;

                newData = {
                    chars: data.chars,
                    found: data.found,
                    err: data.err
                };

                sendMe = 'Non trouvé ' + guess + "\n" + 'Actuellement : ' + data.found + "\n" + 'Tu as fait ' + data.err + '/11 err.';


            }

            if (data.word === data.found) {

                sendMe = 'Bien joué !' + "\n" + 'Le mot était ' + data.word + "\n" + 'Tu as fait ' + data.err + ' err.';

            }

            HangFR.model.findByIdAndUpdate(req.params.id, newData, function() {
                res.send({
                    message: sendMe
                });
                return;
            });
        });
    },

    guess: function(req, res) {

        var newData, sendMe;

        HangFR.model.findOne({
            _id: req.params.id
        }, function(err, data) {

            if (data.word == req.body.guess.replace(/[^A-Z]+/gi, '')) {

                data.found = data.word;

                newData = {
                    chars: data.chars,
                    found: data.found,
                    err: data.err
                };


                sendMe = 'Bien joué !' + "\n" + 'Le mot était ' + data.word + "\n" + 'Tu as fait ' + data.err + ' err.';


            } else {

                data.err++;

                newData = {
                    chars: data.chars,
                    found: data.found,
                    err: data.err
                };


                sendMe = 'Raté. Essaye encore' + "\n" + 'Actuellement : ' + data.found;


            }

            HangFR.model.findByIdAndUpdate(req.params.id, newData, function() {
                res.send({
                    message: sendMe
                });
                return;
            });

        });
    }
};

module.exports = HangFR;
