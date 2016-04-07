// ROUTES TODOS
var Hang = require('../models/hang.js');
var HangFR = require('../models/hangFR.js');
module.exports = function(app) {

    app.get('/hangman', Hang.readme);
    app.get('/hangman/new', Hang.init);
    app.get('/hangman/new/:num', Hang.init);
    app.get('/hangman/word/:word', Hang.init);
    app.get('/hangman/:id', Hang.stat);
    app.post('/hangman/:id', Hang.guess);
    app.put('/hangman/:id', Hang.sendChar);

    app.get('/pendu', HangFR.readme);
    app.get('/pendu/nouveau', HangFR.init);
    app.get('/pendu/nouveau/:num', HangFR.init);
    app.get('/pendu/mot/:word', HangFR.init);
    app.get('/pendu/:id', HangFR.stat);
    app.post('/pendu/:id', HangFR.guess);
    app.put('/pendu/:id', HangFR.sendChar);

};
