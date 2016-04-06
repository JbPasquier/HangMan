// ROUTES TODOS
var Hang = require('../models/hang.js');
module.exports = function(app) {

    app.get('/hangman', Hang.readme);
    app.get('/hangman/new', Hang.init);
    app.get('/hangman/new/:num', Hang.init);
    app.get('/hangman/word/:word', Hang.init);
    app.get('/hangman/:id', Hang.stat);
    app.post('/hangman/:id', Hang.guess);
    app.put('/hangman/:id', Hang.sendChar);

};
